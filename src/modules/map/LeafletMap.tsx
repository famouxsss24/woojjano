import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { LatLng } from './data'

export type MapMarker = { ll: LatLng; kind: 'here' | 'place' | 'stop'; color?: string }

type Props = {
  center: LatLng
  zoom: number
  markers?: MapMarker[]
  path?: { points: LatLng[]; color: string; dashed?: boolean }[]
  /** 경로 전체가 보이게 맞춘다 */
  fit?: LatLng[]
  onZoom?: (zoom: number) => void
  className?: string
}

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

function icon(m: MapMarker): L.DivIcon {
  if (m.kind === 'here')
    return L.divIcon({ className: '', iconSize: [22, 22], html: '<div style="width:22px;height:22px;border-radius:50%;background:#2F6BFF;border:4px solid #fff;box-shadow:0 0 0 6px rgba(47,107,255,.25)"></div>' })
  if (m.kind === 'stop')
    return L.divIcon({ className: '', iconSize: [16, 16], html: `<div style="width:16px;height:16px;border-radius:50%;background:#fff;border:4px solid ${m.color ?? '#555'}"></div>` })
  return L.divIcon({
    className: '',
    iconSize: [34, 44],
    iconAnchor: [17, 42],
    html: `<svg width="34" height="44" viewBox="0 0 34 44"><path d="M17 43C17 43 32 27 32 16A15 15 0 0 0 2 16C2 27 17 43 17 43Z" fill="${m.color ?? '#12A150'}" stroke="#fff" stroke-width="3"/><circle cx="17" cy="16" r="6" fill="#fff"/></svg>`,
  })
}

/**
 * Leaflet을 감싼 지도. React가 다시 그려도 지도는 한 번만 만들고,
 * 표시물(마커·선)만 바꾼다. 확대/축소 버튼은 숨겨 '두 손가락'으로만 조작하게 한다.
 */
export function LeafletMap({ center, zoom, markers = [], path = [], fit, onZoom, className = '' }: Props) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)
  const onZoomRef = useRef(onZoom)
  onZoomRef.current = onZoom

  useEffect(() => {
    if (!el.current) return
    const m = L.map(el.current, { center, zoom, zoomControl: false, attributionControl: true })
    L.tileLayer(TILE_URL, { maxZoom: 19, attribution: ATTRIBUTION }).addTo(m)
    m.attributionControl.setPrefix(false)
    m.on('zoomend', () => onZoomRef.current?.(m.getZoom()))
    layer.current = L.layerGroup().addTo(m)
    map.current = m
    // 부모 크기가 정해진 뒤 타일을 다시 맞춘다
    const ro = new ResizeObserver(() => m.invalidateSize())
    ro.observe(el.current)
    return () => {
      ro.disconnect()
      m.remove()
      map.current = null
      layer.current = null
    }
    // 지도는 처음 한 번만 만든다 (center/zoom 변경은 아래 effect에서)
  }, [])

  const key = JSON.stringify({ markers, path, fit, center, zoom })
  useEffect(() => {
    const m = map.current
    const g = layer.current
    if (!m || !g) return
    g.clearLayers()
    for (const p of path) L.polyline(p.points, { color: p.color, weight: 7, opacity: 0.9, dashArray: p.dashed ? '2 10' : undefined, lineCap: 'round' }).addTo(g)
    for (const mk of markers) L.marker(mk.ll, { icon: icon(mk), interactive: false, keyboard: false }).addTo(g)
    if (fit && fit.length > 1) m.fitBounds(L.latLngBounds(fit), { padding: [40, 40] })
    else m.setView(center, zoom, { animate: false })
    // key가 표시물 전체를 대표한다 (배열이 매번 새로 만들어져도 내용이 같으면 다시 그리지 않음)
  }, [key])

  // isolate: Leaflet 내부 z-index(400~1000)가 바깥의 알림·도움말·완료 창 위로 올라오지 않게 가둔다
  return <div ref={el} className={`isolate h-full w-full ${className}`} />
}
