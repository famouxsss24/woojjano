import { useEffect, type ReactNode } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Bookmark, ChevronLeft, Flag, Share2, CircleDot } from 'lucide-react'
import { emit } from '../../../core/mission/missionStore'
import { notReady } from '../../../core/ui/toast'
import { HERE, distanceLabel, distanceM, findPlace } from '../data'
import { LeafletMap } from '../LeafletMap'

export default function MapPlace() {
  const { id } = useParams()
  const navigate = useNavigate()
  const place = findPlace(id)

  useEffect(() => {
    if (place) emit('map.place.view', { id: place.id })
  }, [place])

  if (!place) return <Navigate to="/map" replace />

  return (
    <div className="relative flex h-full flex-col bg-white">
      <div className="relative min-h-0 flex-1">
        <LeafletMap
          center={place.ll}
          zoom={16}
          markers={[
            { ll: HERE, kind: 'here' },
            { ll: place.ll, kind: 'place' },
          ]}
        />
        <div className="absolute inset-x-0 top-0 z-10 flex gap-2 p-3">
          <button aria-label="뒤로" onClick={() => navigate(-1)} className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.14)]">
            <ChevronLeft size={28} />
          </button>
          <button onClick={() => navigate('/map/search')} className="flex h-14 min-w-0 flex-1 items-center rounded-2xl bg-white px-4 text-left text-[18px] font-bold shadow-[0_4px_16px_rgba(0,0,0,0.14)]">
            <span className="truncate">{place.name}</span>
          </button>
        </div>
      </div>

      <section className="relative z-10 -mt-6 shrink-0 rounded-t-3xl bg-white px-5 pt-6 pb-[max(20px,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <h2 className="text-[26px] font-extrabold">{place.name}</h2>
        <p className="mt-1 text-[16px] text-sub">
          {place.category} · <span className="tabular-nums">{distanceLabel(distanceM(HERE, place.ll))}</span>
        </p>
        <p className="text-[16px] text-sub">{place.area}</p>
        <div className="mt-5 grid grid-cols-4 gap-2">
          <ActionButton label="출발" onClick={notReady}>
            <CircleDot size={22} />
          </ActionButton>
          <button data-target="place-arrive" onClick={() => navigate(`/map/route/${place.id}`)} className="flex h-18 flex-col items-center justify-center gap-1 rounded-2xl bg-(--brand) text-white">
            <Flag size={22} />
            <span className="text-[15px] font-bold">도착</span>
          </button>
          <ActionButton label="저장" onClick={notReady}>
            <Bookmark size={22} />
          </ActionButton>
          <ActionButton label="공유" onClick={notReady}>
            <Share2 size={22} />
          </ActionButton>
        </div>
      </section>
    </div>
  )
}

function ActionButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className="flex h-18 flex-col items-center justify-center gap-1 rounded-2xl bg-canvas">
      {children}
      <span className="text-[15px] font-bold">{label}</span>
    </button>
  )
}
