import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { ArrowUpDown, Bike, Car, ChevronLeft, Footprints, TramFront } from 'lucide-react'
import { PRACTICE } from '../../../core/config'
import { ampm, minutesLabel } from '../../../core/format'
import { useNow } from '../../../core/useNow'
import { notReady, toast } from '../../../core/ui/toast'
import { HERE, ROUTES, distanceLabel, distanceM, findPlace, routeSummary, type Leg } from '../data'

const MODES = [
  { id: 'transit', label: '대중교통', icon: TramFront },
  { id: 'car', label: '자동차', icon: Car },
  { id: 'walk', label: '도보', icon: Footprints },
  { id: 'bike', label: '자전거', icon: Bike },
] as const
type Mode = (typeof MODES)[number]['id']

/** 도로 굴곡을 감안한 대략 시간(분) — 직선거리 × 1.3 */
const ROAD = 1.3
const SPEED_M_PER_MIN: Record<Exclude<Mode, 'transit'>, number> = { car: 400, walk: 67, bike: 230 }

export default function MapRoute() {
  const { id } = useParams()
  const navigate = useNavigate()
  const now = useNow(30_000)
  const [mode, setMode] = useState<Mode>('transit')
  const place = findPlace(id)
  if (!place) return <Navigate to="/map" replace />

  const routes = ROUTES[place.id] ?? []
  const roadM = distanceM(HERE, place.ll) * ROAD

  return (
    <div className="flex h-full flex-col bg-canvas">
      <section className="shrink-0 bg-white px-2 pt-2 pb-3">
        <div className="flex items-start gap-1">
          <button aria-label="뒤로" onClick={() => navigate(-1)} className="grid size-11 shrink-0 place-items-center rounded-full active:bg-black/5">
            <ChevronLeft size={30} />
          </button>
          <div className="min-w-0 flex-1 rounded-2xl bg-canvas">
            <p className="flex h-12 items-center gap-3 px-4 text-[17px]">
              <span className="size-3 shrink-0 rounded-full bg-[#2F6BFF]" />
              <span className="truncate font-semibold">내 위치 ({PRACTICE.here.name})</span>
            </p>
            <p className="flex h-12 items-center gap-3 px-4 text-[17px]">
              <span className="size-3 shrink-0 rounded-full bg-(--brand)" />
              <span className="truncate font-bold">{place.name}</span>
            </p>
          </div>
          <button aria-label="출발 도착 바꾸기" onClick={notReady} className="grid size-11 shrink-0 place-items-center self-center rounded-full active:bg-black/5">
            <ArrowUpDown size={22} />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1 px-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex h-12 items-center justify-center gap-1 rounded-xl text-[15px] font-bold ${m.id === mode ? 'bg-(--brand) text-white' : 'text-sub'}`}
            >
              <m.icon size={18} /> {m.label}
            </button>
          ))}
        </div>
      </section>

      <main className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {mode === 'transit' ? (
          <ul className="grid gap-2">
            {routes.map((legs, i) => (
              <li key={i}>
                <RouteCard legs={legs} now={now} target={`route-${i}`} onClick={() => navigate(`/map/route/${place.id}/${i}`)} />
              </li>
            ))}
          </ul>
        ) : (
          <button onClick={() => toast('연습 앱에서는 대중교통 길만 자세히 볼 수 있어요')} className="w-full rounded-3xl bg-white p-5 text-left">
            <p className="text-[26px] font-extrabold tabular-nums">{minutesLabel(Math.max(1, Math.round(roadM / SPEED_M_PER_MIN[mode])) + (mode === 'car' ? 4 : 0))}</p>
            <p className="mt-1 text-[16px] text-sub tabular-nums">약 {distanceLabel(roadM)}</p>
          </button>
        )}
        <p className="px-2 pt-4 text-[14px] leading-relaxed text-faint">연습용 예시 경로예요. 실제 길과 시간은 네이버 지도에서 확인하세요.</p>
      </main>
    </div>
  )
}

function legLabel(l: Leg) {
  return l.kind === 'walk' ? `도보 ${l.minutes}분` : `${l.line} ${l.minutes}분`
}

function RouteCard({ legs, now, target, onClick }: { legs: Leg[]; now: number; target: string; onClick: () => void }) {
  const { total, transfers, walkOnly } = routeSummary(legs)
  const firstRide = legs.find((l) => l.kind === 'subway')
  return (
    <button data-target={target} onClick={onClick} className="w-full rounded-3xl bg-white p-5 text-left active:bg-black/[0.02]">
      <div className="flex items-baseline justify-between">
        <p className="text-[26px] font-extrabold tabular-nums">{minutesLabel(total)}</p>
        <p className="text-[15px] text-sub tabular-nums">{ampm(new Date(now + total * 60_000))} 도착</p>
      </div>
      <div className="mt-3 flex h-7 gap-0.5 overflow-hidden rounded-full">
        {legs.map((l, i) => (
          <span
            key={i}
            style={{ flexGrow: Math.max(l.minutes, 3), background: l.kind === 'walk' ? '#E5E7EB' : l.color }}
            className={`grid min-w-0 place-items-center text-[12px] font-bold ${l.kind === 'walk' ? 'text-sub' : 'text-white'}`}
          >
            {l.minutes}분
          </span>
        ))}
      </div>
      <p className="mt-3 text-[16px] font-semibold">{legs.map(legLabel).join(' · ')}</p>
      <p className="text-[15px] text-sub">
        {walkOnly ? '걸어서 가요' : `${firstRide?.kind === 'subway' ? `${firstRide.from} 승차` : ''} · ${transfers ? `환승 ${transfers}회` : '갈아타지 않아요'}`}
      </p>
    </button>
  )
}
