import { useNavigate } from 'react-router'
import { CirclePlus, CircleUserRound, House, Play, Clapperboard, Rows3 } from 'lucide-react'
import { TabBar } from '../../core/ui/TabBar'
import { duration, type Video } from './data'

export function MusicLogo() {
  return (
    <span className="flex items-center gap-1.5">
      <span className="grid h-6 w-8 place-items-center rounded-md bg-(--brand) text-white">
        <Play size={14} fill="currentColor" />
      </span>
      <span className="text-[19px] font-extrabold tracking-tight">KW뮤직</span>
    </span>
  )
}

/** 영상 썸네일 (그림 대신 색 + 이모지) */
export function Thumb({ v, className = '', showTime = true }: { v: Video; className?: string; showTime?: boolean }) {
  return (
    <span className={`relative grid aspect-video place-items-center overflow-hidden rounded-2xl text-[44px] ${className}`} style={{ background: v.bg }}>
      {v.emoji}
      {showTime && <span className="absolute right-1.5 bottom-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[12px] font-semibold text-white tabular-nums">{duration(v.seconds)}</span>}
    </span>
  )
}

export function MusicTabs({ active }: { active: 'home' | 'library' }) {
  const navigate = useNavigate()
  return (
    <TabBar
      active={active === 'home' ? 0 : 4}
      items={[
        { label: '홈', icon: House, onClick: () => navigate('/music', { replace: true }) },
        { label: 'Shorts', icon: Clapperboard },
        { label: '만들기', icon: CirclePlus },
        { label: '구독', icon: Rows3 },
        { label: '내 페이지', icon: CircleUserRound, onClick: () => navigate('/music/library', { replace: true }), target: 'tab-library' },
      ]}
    />
  )
}
