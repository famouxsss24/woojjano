import { useNavigate } from 'react-router'
import { ListMusic } from 'lucide-react'
import { PRACTICE } from '../../../core/config'
import { findVideo } from '../data'
import { useMusic } from '../store'
import { MusicTabs, Thumb } from '../ui'

export default function MusicLibrary() {
  const playlists = useMusic((s) => s.playlists)
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex h-14 shrink-0 items-center px-5">
        <h1 className="text-[22px] font-extrabold">내 페이지</h1>
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto pb-6">
        <div className="flex items-center gap-4 px-5 py-3">
          <span className="grid size-16 place-items-center rounded-full bg-canvas text-[30px]">🙂</span>
          <div>
            <p className="text-[20px] font-bold">{PRACTICE.userName}</p>
            <p className="text-[14px] text-sub">KW뮤직 회원</p>
          </div>
        </div>
        <p className="px-5 pt-6 pb-3 text-[19px] font-bold">재생목록</p>
        <ul className="grid gap-3 px-4">
          {playlists.map((p) => {
            const first = findVideo(p.videoIds[0])
            return (
              <li key={p.id}>
                <button data-target={`playlist-${p.id}`} onClick={() => navigate(`/music/playlist/${p.id}`)} className="flex w-full items-center gap-4 rounded-2xl text-left active:bg-black/5">
                  {first ? (
                    <Thumb v={first} className="w-36 shrink-0 text-[32px]" showTime={false} />
                  ) : (
                    <span className="grid aspect-video w-36 shrink-0 place-items-center rounded-2xl bg-canvas text-faint">
                      <ListMusic size={30} />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-[18px] font-bold">{p.name}</span>
                    <span className="block text-[14px] text-sub">비공개 · 동영상 {p.videoIds.length}개</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </main>
      <MusicTabs active="library" />
    </div>
  )
}
