import { useNavigate } from 'react-router'
import { House, Heart, Receipt, Search, CircleUserRound, Star } from 'lucide-react'
import { won } from '../../core/format'
import { TabBar } from '../../core/ui/TabBar'
import type { Shop } from './data'

export function FoodTabs({ active }: { active: 'home' | 'search' }) {
  const navigate = useNavigate()
  return (
    <TabBar
      active={active === 'home' ? 0 : 1}
      items={[
        { label: '홈', icon: House, onClick: () => navigate('/food', { replace: true }) },
        { label: '검색', icon: Search, onClick: () => navigate('/food/search') },
        { label: '찜', icon: Heart },
        { label: '주문내역', icon: Receipt },
        { label: '마이', icon: CircleUserRound },
      ]}
    />
  )
}

export function ShopCard({ shop, onClick, target }: { shop: Shop; onClick: () => void; target?: string }) {
  return (
    <button data-target={target} onClick={onClick} className="flex w-full gap-4 rounded-3xl bg-white p-4 text-left active:bg-black/[0.02]">
      <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-(--brand)/8 text-[42px]">{shop.emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[19px] font-bold">{shop.name}</span>
        <span className="mt-0.5 flex items-center gap-1 text-[15px]">
          <Star size={15} className="fill-amber-400 text-amber-400" />
          <b>{shop.rating}</b>
          <span className="text-sub">({shop.reviews.toLocaleString('ko-KR')})</span>
        </span>
        <span className="mt-1 block text-[14px] text-sub">
          {shop.eta} · 배달팁 {won(shop.tip)}
        </span>
        <span className="block text-[14px] text-sub">최소주문 {won(shop.minOrder)}</span>
      </span>
    </button>
  )
}
