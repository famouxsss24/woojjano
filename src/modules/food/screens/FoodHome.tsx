import { useNavigate } from 'react-router'
import { Bell, ChevronDown, Search } from 'lucide-react'
import { IconButton } from '../../../core/ui/AppBar'
import { notReady } from '../../../core/ui/toast'
import { CATEGORIES, SHOPS } from '../data'
import { useFood } from '../store'
import { FoodTabs, ShopCard } from '../ui'

export default function FoodHome() {
  const address = useFood((s) => s.address)
  const order = useFood((s) => s.order)
  const navigate = useNavigate()
  const shortRoad = address ? address.road.split(' ').slice(2).join(' ') : null

  return (
    <div className="flex h-full flex-col bg-canvas">
      <header className="shrink-0 bg-(--brand) px-4 pt-2 pb-4 text-white">
        <div className="flex items-center justify-between">
          <button data-target="food-address" onClick={() => navigate('/food/address')} className="flex h-11 min-w-0 items-center gap-1 rounded-full pr-2 text-[19px] font-bold">
            <span className="truncate">{shortRoad ?? '주소를 설정해 주세요'}</span>
            <ChevronDown size={22} className="shrink-0" />
          </button>
          <IconButton label="알림" onClick={notReady}>
            <Bell size={24} />
          </IconButton>
        </div>
        <button onClick={() => navigate('/food/search')} className="mt-2 flex h-12 w-full items-center gap-2 rounded-2xl bg-white px-4 text-[16px] text-faint">
          <Search size={20} /> 짜장면, 치킨 먹고 싶을 땐 검색!
        </button>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto pb-6">
        {order && (
          <button onClick={() => navigate('/food/status')} className="mx-4 mt-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-2xl bg-ink px-5 py-4 text-left text-white">
            <span className="text-[16px] font-bold">🛵 {order.shopName} 주문 진행 중</span>
            <span className="text-[14px] text-white/70">보기</span>
          </button>
        )}

        <section className="mx-4 mt-4 grid grid-cols-4 gap-y-4 rounded-3xl bg-white px-2 py-5">
          {CATEGORIES.map((c) => (
            <button key={c.id} data-target={`cat-${c.id}`} onClick={() => navigate(`/food/c/${c.id}`)} className="flex flex-col items-center gap-1.5 rounded-xl py-1 active:bg-black/5">
              <span className="text-[34px] leading-none">{c.emoji}</span>
              <span className="text-[14px] font-semibold">{c.name}</span>
            </button>
          ))}
        </section>

        <p className="px-5 pt-7 pb-3 text-[19px] font-bold">우리 동네 인기 가게</p>
        <div className="grid gap-2 px-4">
          {SHOPS.filter((s) => s.rating >= 4.9).map((s) => (
            <ShopCard key={s.id} shop={s} onClick={() => navigate(`/food/s/${s.id}`)} />
          ))}
        </div>
      </main>
      <FoodTabs active="home" />
    </div>
  )
}
