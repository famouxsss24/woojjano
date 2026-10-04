import { useNavigate } from 'react-router'
import { CircleUserRound, Ticket, TrainFront } from 'lucide-react'
import { TabBar } from '../../core/ui/TabBar'

export function RailHeader({ title = 'KW레일' }: { title?: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center bg-(--brand) px-5 text-white">
      <p className="text-[21px] font-extrabold tracking-tight">{title}</p>
    </header>
  )
}

type Tab = 'book' | 'tickets' | 'my'
const ORDER: Tab[] = ['book', 'tickets', 'my']

/** 예매 / 승차권 확인 / 마이 — 탭 전환은 뒤로가기 기록을 쌓지 않는다 */
export function RailTabs({ active }: { active: Tab }) {
  const navigate = useNavigate()
  const go = (path: string) => () => navigate(path, { replace: true })
  return (
    <TabBar
      active={ORDER.indexOf(active)}
      items={[
        { label: '승차권 예매', icon: TrainFront, onClick: go('/rail'), target: 'rail-tab-book' },
        { label: '승차권 확인', icon: Ticket, onClick: go('/rail/tickets'), target: 'rail-tab-tickets' },
        { label: '마이', icon: CircleUserRound, onClick: go('/rail/my'), target: 'rail-tab-my' },
      ]}
    />
  )
}
