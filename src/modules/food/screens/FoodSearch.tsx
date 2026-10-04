import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import { AppBar } from '../../../core/ui/AppBar'
import { SHOPS } from '../data'
import { ShopCard } from '../ui'

const POPULAR = ['짜장면', '치킨', '떡볶이', '국밥', '피자']

export default function FoodSearch() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const q = text.trim()
  const results = q ? SHOPS.filter((s) => s.name.includes(q) || s.menus.some((m) => m.name.includes(q))) : []

  return (
    <div className="flex h-full flex-col bg-canvas">
      <div className="shrink-0 bg-white pb-3">
        <AppBar title="검색" />
        <label className="mx-4 flex h-13 items-center gap-2 rounded-2xl bg-canvas px-4">
          <Search size={20} className="text-faint" />
          <input autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="가게나 메뉴 이름" className="min-w-0 flex-1 bg-transparent text-[17px] outline-none" />
        </label>
      </div>
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {!q ? (
          <>
            <p className="pb-3 text-[16px] font-bold">많이 찾는 음식</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <button key={p} onClick={() => setText(p)} className="h-11 rounded-full bg-white px-5 text-[16px] font-semibold">
                  {p}
                </button>
              ))}
            </div>
          </>
        ) : results.length === 0 ? (
          <p className="pt-16 text-center text-[17px] text-sub">'{q}'(으)로 찾은 가게가 없어요</p>
        ) : (
          <div className="grid gap-2">
            {results.map((s) => (
              <ShopCard key={s.id} shop={s} onClick={() => navigate(`/food/s/${s.id}`)} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
