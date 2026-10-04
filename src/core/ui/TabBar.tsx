import type { LucideIcon } from 'lucide-react'
import { notReady } from './toast'

export type TabItem = { label: string; icon: LucideIcon; onClick?: () => void; target?: string }

/** 앱 하단 탭. onClick이 없는 탭은 '준비 중' 안내를 띄운다. */
export function TabBar({ items, active, tone = 'light' }: { items: TabItem[]; active: number; tone?: 'light' | 'dark' }) {
  const base = tone === 'dark' ? 'bg-[#0f0f0f] text-white/60' : 'bg-white text-faint'
  const on = tone === 'dark' ? 'text-white' : 'text-ink'
  return (
    <nav className={`flex shrink-0 pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_12px_rgba(0,0,0,0.06)] ${base}`}>
      {items.map(({ label, icon: Icon, onClick, target }, i) => (
        <button key={label} data-target={target} onClick={i === active ? undefined : (onClick ?? notReady)} className={`flex h-16 flex-1 flex-col items-center justify-center gap-1 ${i === active ? on : ''}`}>
          <Icon size={24} strokeWidth={i === active ? 2.4 : 1.8} />
          <span className="text-[12px] font-semibold">{label}</span>
        </button>
      ))}
    </nav>
  )
}
