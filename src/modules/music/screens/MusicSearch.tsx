import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ArrowUpLeft, ChevronLeft, Clock, Search, X } from 'lucide-react'
import { POPULAR_SEARCHES, searchVideos } from '../data'
import { musicActions, useMusic } from '../store'
import { Thumb } from '../ui'

export default function MusicSearch() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const recent = useMusic((s) => s.recent)
  const [text, setText] = useState(q)

  const run = (query: string) => {
    const t = query.trim()
    if (!t) return
    setText(t)
    musicActions.addRecent(t)
    setParams({ q: t })
  }

  const results = searchVideos(q)

  return (
    <div className="flex h-full flex-col bg-white">
      <form
        className="flex h-16 shrink-0 items-center gap-1 px-1"
        onSubmit={(e) => {
          e.preventDefault()
          run(text)
        }}
      >
        <button type="button" aria-label="뒤로" onClick={() => navigate(-1)} className="grid size-11 shrink-0 place-items-center rounded-full active:bg-black/5">
          <ChevronLeft size={30} />
        </button>
        <label data-target="search-box" className="flex h-12 min-w-0 flex-1 items-center rounded-full bg-canvas pr-1 pl-4">
          <input
            type="search"
            enterKeyHint="search"
            autoFocus={!q}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="KW뮤직 검색"
            className="min-w-0 flex-1 bg-transparent text-[18px] outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {text && (
            <button type="button" aria-label="지우기" onClick={() => setText('')} className="grid size-10 place-items-center text-faint">
              <X size={20} />
            </button>
          )}
        </label>
        <button type="submit" aria-label="검색" className="grid size-11 shrink-0 place-items-center rounded-full active:bg-black/5">
          <Search size={24} />
        </button>
      </form>

      <main className="min-h-0 flex-1 overflow-y-auto pb-6">
        {!q ? (
          <ul>
            {[...recent.map((r) => ({ r, icon: Clock })), ...POPULAR_SEARCHES.filter((p) => !recent.includes(p)).map((r) => ({ r, icon: Search }))].map(({ r, icon: Icon }) => (
              <li key={r}>
                <button data-target={`popular-${r}`} onClick={() => run(r)} className="flex h-14 w-full items-center gap-4 px-5 text-left text-[18px] active:bg-black/5">
                  <Icon size={20} className="text-sub" />
                  <span className="flex-1">{r}</span>
                  <ArrowUpLeft size={20} className="text-faint" />
                </button>
              </li>
            ))}
          </ul>
        ) : results.length === 0 ? (
          <p className="pt-16 text-center text-[17px] text-sub">'{q}' 검색 결과가 없어요</p>
        ) : (
          <ul className="grid gap-4 px-4 pt-2">
            {results.map((v, i) => (
              <li key={v.id}>
                <button data-target={i === 0 ? 'result-0' : undefined} onClick={() => navigate(`/music/watch/${v.id}`)} className="flex w-full gap-3 text-left">
                  <Thumb v={v} className="w-40 shrink-0 text-[36px]" />
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 block text-[17px] leading-snug font-bold">
                      {v.artist} - {v.title}
                    </span>
                    <span className="mt-1 block text-[14px] text-sub">{v.channel}</span>
                    <span className="block text-[14px] text-sub">{v.views}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
