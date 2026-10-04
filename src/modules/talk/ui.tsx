import { useNavigate } from 'react-router'
import { Ellipsis, MessageCircle, ShoppingBag, User, Users } from 'lucide-react'
import { TabBar } from '../../core/ui/TabBar'
import type { Friend } from './data'

export function Avatar({ f, size = 48 }: { f: Pick<Friend, 'emoji' | 'color'>; size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-[38%]" style={{ width: size, height: size, background: `${f.color}40`, fontSize: size * 0.55 }}>
      {f.emoji}
    </span>
  )
}

export function TalkTabs({ active }: { active: 'friends' | 'chats' }) {
  const navigate = useNavigate()
  return (
    <TabBar
      active={active === 'friends' ? 0 : 1}
      items={[
        { label: '친구', icon: User, onClick: () => navigate('/talk', { replace: true }), target: 'tab-friends' },
        { label: '채팅', icon: MessageCircle, onClick: () => navigate('/talk/chats', { replace: true }), target: 'tab-chats' },
        { label: '오픈채팅', icon: Users },
        { label: '쇼핑', icon: ShoppingBag },
        { label: '더보기', icon: Ellipsis },
      ]}
    />
  )
}

export function TalkHeader({ title }: { title: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center px-5">
      <h1 className="text-[22px] font-extrabold">{title}</h1>
    </header>
  )
}
