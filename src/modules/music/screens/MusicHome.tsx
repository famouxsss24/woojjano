import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Bell, Search } from 'lucide-react'
import { IconButton } from '../../../core/ui/AppBar'
import { notReady } from '../../../core/ui/toast'
import { VIDEOS } from '../data'
import { MusicLogo, MusicTabs, Thumb } from '../ui'

const CHIPS = ['전체', '트로트', '가요', '7080', '최근 업로드']

export default function MusicHome() {
  const navigate = useNavigate()
  const [chip, setChip] = useState(CHIPS[0])
  const list = chip === '트로트' ? VIDEOS.filter((v) => v.channel.includes('트로트')) : chip === '가요' ? VIDEOS.filter((v) => v.channel.includes('가요')) : VIDEOS

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex h-14 shrink-0 items-center justify-between pr-1 pl-4">
        <MusicLogo />
        <div className="flex">
          <IconButton label="알림" onClick={notReady}>
            <Bell size={24} />
          </IconButton>
          <IconButton label="검색" target="music-search" onClick={() => navigate('/music/search')}>
            <Search size={24} />
          </IconButton>
        </div>
      </header>
      <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-4 pb-3">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => (c === '7080' || c === '최근 업로드' ? notReady() : setChip(c))}
            className={`h-10 shrink-0 rounded-xl px-4 text-[15px] font-bold ${c === chip ? 'bg-ink text-white' : 'bg-canvas'}`}
          >
            {c}
          </button>
        ))}
      </div>
      <main className="min-h-0 flex-1 overflow-y-auto pb-4">
        <ul className="grid gap-6">
          {list.map((v) => (
            <li key={v.id}>
              <button onClick={() => navigate(`/music/watch/${v.id}`)} className="w-full px-4 text-left">
                <Thumb v={v} className="w-full text-[64px]" />
                <p className="mt-2.5 text-[18px] leading-snug font-bold">
                  {v.artist} - {v.title}
                </p>
                <p className="mt-0.5 text-[14px] text-sub">
                  {v.channel} · {v.views} · {v.ago}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </main>
      <MusicTabs active="home" />
    </div>
  )
}
