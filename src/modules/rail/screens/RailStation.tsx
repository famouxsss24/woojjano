import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Search } from 'lucide-react'
import { AppBar } from '../../../core/ui/AppBar'
import { STATIONS } from '../data'
import { railActions, useRail } from '../store'

export default function RailStation() {
  const { which } = useParams()
  const query = useRail((s) => s.query)
  const navigate = useNavigate()
  const [text, setText] = useState('')
  if (which !== 'from' && which !== 'to') return <Navigate to="/rail" replace />

  const selected = query[which]
  const list = STATIONS.filter((s) => s.name.includes(text.trim()))

  return (
    <div className="flex h-full flex-col bg-white">
      <AppBar title={which === 'from' ? '출발역 선택' : '도착역 선택'} backIcon="close" />
      <div className="px-5 pb-3">
        <label className="flex h-13 items-center gap-2 rounded-2xl bg-canvas px-4">
          <Search size={20} className="text-faint" />
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="역 이름 검색 (예: 대전)" className="min-w-0 flex-1 bg-transparent text-[17px] outline-none" />
        </label>
      </div>
      <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
        <p className="pt-2 pb-3 text-[15px] font-semibold text-sub">{text ? '검색 결과' : '주요역'}</p>
        {list.length === 0 ? (
          <p className="py-10 text-center text-[16px] text-sub">'{text}' 역이 없어요. 역 이름을 다시 확인해 주세요</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {list.map((s) => (
              <button
                key={s.id}
                data-target={`station-${s.id}`}
                onClick={() => {
                  railActions.setStation(which, s.id)
                  navigate(-1)
                }}
                className={`h-14 rounded-2xl text-[17px] font-bold ${s.id === selected ? 'bg-(--brand) text-white' : 'bg-canvas'}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
