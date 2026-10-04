import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, Clock, MapPin, X } from 'lucide-react'
import { HERE, PLACES, distanceLabel, distanceM, findPlace, type Place } from '../data'
import { mapActions, useMapStore } from '../store'

export default function MapSearch() {
  const navigate = useNavigate()
  const recentIds = useMapStore((s) => s.recent)
  const [text, setText] = useState('')
  const q = text.trim()
  const results = q ? PLACES.filter((p) => p.name.includes(q) || p.category.includes(q) || p.area.includes(q)) : []
  const recent = recentIds.map((id) => findPlace(id)).filter((p): p is Place => !!p)

  const open = (p: Place) => {
    mapActions.addRecent(p.id)
    navigate(`/map/place/${p.id}`)
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center gap-1 px-1">
        <button aria-label="뒤로" onClick={() => navigate(-1)} className="grid size-11 place-items-center rounded-full active:bg-black/5">
          <ChevronLeft size={30} />
        </button>
        <label className="flex h-12 min-w-0 flex-1 items-center rounded-2xl bg-canvas pr-1 pl-4">
          <input
            data-target="search-input"
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="장소, 주소 검색"
            className="min-w-0 flex-1 bg-transparent text-[18px] outline-none"
          />
          {text && (
            <button aria-label="지우기" onClick={() => setText('')} className="grid size-10 place-items-center text-faint">
              <X size={20} />
            </button>
          )}
        </label>
        <span className="w-2" />
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        {!q && (
          <>
            <p className="px-1 pt-3 pb-2 text-[15px] font-semibold text-sub">{recent.length ? '최근 검색' : '이렇게 찾아보세요'}</p>
            {recent.length ? (
              <PlaceList places={recent} icon="recent" onPick={open} />
            ) : (
              <p className="px-1 text-[16px] leading-relaxed text-faint">서울역, 노원역, 상계백병원, 노원구청…</p>
            )}
          </>
        )}
        {q && results.length === 0 && <p className="pt-16 text-center text-[17px] text-sub">'{q}' 검색 결과가 없어요</p>}
        {q && results.length > 0 && <PlaceList places={results} icon="pin" onPick={open} />}
      </main>
    </div>
  )
}

function PlaceList({ places, icon, onPick }: { places: Place[]; icon: 'recent' | 'pin'; onPick: (p: Place) => void }) {
  return (
    <ul>
      {places.map((p) => (
        <li key={p.id}>
          <button data-target={`result-${p.id}`} onClick={() => onPick(p)} className="flex w-full items-center gap-3 rounded-2xl px-1 py-3 text-left active:bg-black/5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-canvas text-sub">{icon === 'recent' ? <Clock size={18} /> : <MapPin size={18} />}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[18px] font-bold">{p.name}</span>
              <span className="block truncate text-[15px] text-sub">
                {p.category} · {p.area}
              </span>
            </span>
            <span className="shrink-0 text-[14px] text-faint tabular-nums">{distanceLabel(distanceM(HERE, p.ll))}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
