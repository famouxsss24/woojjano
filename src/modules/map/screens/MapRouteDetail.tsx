import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { ChevronLeft, Footprints } from 'lucide-react'
import { emit } from '../../../core/mission/missionStore'
import { PRACTICE } from '../../../core/config'
import { minutesLabel } from '../../../core/format'
import { HERE, ROUTES, findPlace, routeSummary, type LatLng } from '../data'
import { LeafletMap, type MapMarker } from '../LeafletMap'

const WALK_COLOR = '#9CA3AF'

export default function MapRouteDetail() {
  const { id, idx } = useParams()
  const navigate = useNavigate()
  const place = findPlace(id)
  const legs = place ? ROUTES[place.id]?.[Number(idx)] : undefined

  useEffect(() => {
    if (place && legs) emit('map.route.detail', { id: place.id })
  }, [place, legs])

  if (!place || !legs) return <Navigate to={place ? `/map/route/${place.id}` : '/map'} replace />

  const { total, transfers } = routeSummary(legs)
  const points: LatLng[] = [HERE, ...legs.map((l) => l.ll)]
  const path = legs.map((l, i) => ({ points: [points[i], l.ll], color: l.kind === 'walk' ? WALK_COLOR : l.color, dashed: l.kind === 'walk' }))
  const markers: MapMarker[] = [
    { ll: HERE, kind: 'here' },
    ...legs.flatMap((l, i): MapMarker[] => (l.kind === 'subway' ? [{ ll: points[i], kind: 'stop', color: l.color }, { ll: l.ll, kind: 'stop', color: l.color }] : [])),
    { ll: place.ll, kind: 'place' },
  ]

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="relative h-[42%] shrink-0">
        <LeafletMap center={place.ll} zoom={13} markers={markers} path={path} fit={[...points, place.ll]} />
        <button aria-label="뒤로" onClick={() => navigate(-1)} className="absolute top-3 left-3 z-10 grid size-12 place-items-center rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.14)]">
          <ChevronLeft size={28} />
        </button>
      </div>

      <main className="relative z-10 -mt-5 min-h-0 flex-1 overflow-y-auto rounded-t-3xl bg-white px-5 pt-5 pb-8 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <p className="text-[26px] font-extrabold tabular-nums">{minutesLabel(total)}</p>
        <p className="text-[15px] text-sub">{transfers ? `환승 ${transfers}회` : '갈아타지 않아요'} · 연습용 예시 경로</p>

        <ol className="mt-6">
          <Stop color="#2F6BFF" title={`출발 · 내 위치 (${PRACTICE.here.name})`} />
          {legs.map((l, i) =>
            l.kind === 'walk' ? (
              <li key={i} className="flex gap-4 pb-5">
                <span className="flex w-8 justify-center">
                  <span className="w-1 rounded-full" style={{ backgroundImage: `linear-gradient(${WALK_COLOR} 50%, transparent 50%)`, backgroundSize: '4px 10px' }} />
                </span>
                <p className="flex items-center gap-2 text-[17px] text-sub">
                  <Footprints size={18} /> {l.to}까지 걷기 · {l.minutes}분
                </p>
              </li>
            ) : (
              <li key={i} className="flex gap-4 pb-5">
                <span className="flex w-8 justify-center">
                  <span className="w-1.5 rounded-full" style={{ background: l.color }} />
                </span>
                <div className="py-1">
                  <span className="rounded-md px-2 py-0.5 text-[14px] font-bold text-white" style={{ background: l.color }}>
                    {l.line}
                  </span>
                  <p className="mt-2 text-[19px] font-bold">{l.from} 승차</p>
                  <p className="text-[16px] text-sub">{l.toward}</p>
                  <p className="mt-1 text-[16px] font-semibold">
                    {l.stops}개 역 이동 · {l.minutes}분
                  </p>
                  <p className="mt-2 text-[19px] font-bold">{l.to} 하차</p>
                </div>
              </li>
            ),
          )}
          <Stop color="var(--brand)" title={`도착 · ${place.name}`} />
        </ol>
      </main>
    </div>
  )
}

function Stop({ color, title }: { color: string; title: string }) {
  return (
    <li className="flex items-center gap-4 pb-5">
      <span className="flex w-8 justify-center">
        <span className="size-4 rounded-full" style={{ background: color }} />
      </span>
      <p className="text-[18px] font-bold">{title}</p>
    </li>
  )
}
