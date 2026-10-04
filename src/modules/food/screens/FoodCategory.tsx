import { Navigate, useNavigate, useParams } from 'react-router'
import { AppBar } from '../../../core/ui/AppBar'
import { CATEGORIES, SHOPS, categoryName } from '../data'
import { ShopCard } from '../ui'

export default function FoodCategory() {
  const { cat = '' } = useParams()
  const navigate = useNavigate()
  if (!CATEGORIES.some((c) => c.id === cat)) return <Navigate to="/food" replace />
  const shops = SHOPS.filter((s) => s.cat === cat)

  return (
    <div className="flex h-full flex-col bg-canvas">
      <div className="shrink-0 bg-white">
        <AppBar title={categoryName(cat)} />
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/food/c/${c.id}`, { replace: true })}
              className={`h-10 shrink-0 rounded-full px-4 text-[15px] font-bold ${c.id === cat ? 'bg-ink text-white' : 'bg-canvas'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <div className="grid gap-2">
          {shops.map((s) => (
            <ShopCard key={s.id} shop={s} target={`shop-${s.id}`} onClick={() => navigate(`/food/s/${s.id}`)} />
          ))}
        </div>
      </main>
    </div>
  )
}
