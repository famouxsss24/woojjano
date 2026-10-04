import { useState } from 'react'
import { useNavigate } from 'react-router'
import { LocateFixed, Navigation, Search } from 'lucide-react'
import { emit } from '../../../core/mission/missionStore'
import { HERE } from '../data'
import { LeafletMap } from '../LeafletMap'
import { START_ZOOM, mapActions } from '../store'

export default function MapHome() {
  const navigate = useNavigate()
  // 내 위치 버튼: 지도를 처음 상태로 다시 그린다
  const [nonce, setNonce] = useState(0)

  const onZoom = (zoom: number) => {
    if (mapActions.trackZoom(zoom)) emit('map.pinch')
  }

  return (
    <div className="relative h-full">
      <LeafletMap key={nonce} center={HERE} zoom={START_ZOOM} markers={[{ ll: HERE, kind: 'here' }]} onZoom={onZoom} />

      <div className="absolute inset-x-0 top-0 z-10 p-3">
        <button data-target="map-search" onClick={() => navigate('/map/search')} className="flex h-14 w-full items-center gap-3 rounded-2xl bg-white px-4 text-left shadow-[0_4px_16px_rgba(0,0,0,0.14)]">
          <Search size={22} className="text-(--brand)" />
          <span className="text-[17px] text-faint">장소, 버스, 지하철, 주소 검색</span>
        </button>
      </div>

      <div className="absolute right-3 bottom-24 z-10 flex flex-col gap-3">
        <button aria-label="내 위치" onClick={() => setNonce((n) => n + 1)} className="grid size-13 place-items-center rounded-full bg-white text-ink shadow-[0_4px_16px_rgba(0,0,0,0.16)]">
          <LocateFixed size={24} />
        </button>
      </div>
      <button
        onClick={() => navigate('/map/search')}
        className="absolute bottom-7 left-1/2 z-10 flex h-14 -translate-x-1/2 items-center gap-2 rounded-full bg-(--brand) px-7 text-[18px] font-bold text-white shadow-[0_6px_20px_rgba(0,0,0,0.2)]"
      >
        <Navigation size={20} /> 길찾기
      </button>
    </div>
  )
}
