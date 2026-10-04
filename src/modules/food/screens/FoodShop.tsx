import { Navigate, useNavigate, useParams } from 'react-router'
import { Heart, Share2, Star } from 'lucide-react'
import { won } from '../../../core/format'
import { AppBar, IconButton } from '../../../core/ui/AppBar'
import { notReady } from '../../../core/ui/toast'
import { findShop } from '../data'
import { cartCount, cartShopId, cartSum, useFood } from '../store'

export default function FoodShop() {
  const { shop: shopId } = useParams()
  const cart = useFood((s) => s.cart)
  const navigate = useNavigate()
  const shop = findShop(shopId)
  if (!shop) return <Navigate to="/food" replace />

  const myCart = cartShopId(cart) === shop.id ? cart : []
  const popular = shop.menus.filter((m) => m.popular)
  const sections = [
    ...(popular.length ? [{ title: '대표 메뉴', menus: popular }] : []),
    { title: '전체 메뉴', menus: shop.menus },
  ]

  return (
    <div className="flex h-full flex-col bg-canvas">
      <AppBar
        title={shop.name}
        right={
          <>
            <IconButton label="찜" onClick={notReady}>
              <Heart size={22} />
            </IconButton>
            <IconButton label="공유" onClick={notReady}>
              <Share2 size={22} />
            </IconButton>
          </>
        }
      />
      <main className="min-h-0 flex-1 overflow-y-auto pb-6">
        <section className="bg-white px-5 pt-2 pb-6 text-center">
          <span className="text-[56px] leading-none">{shop.emoji}</span>
          <h2 className="mt-2 text-[24px] font-extrabold">{shop.name}</h2>
          <p className="mt-1 flex items-center justify-center gap-1 text-[16px]">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <b>{shop.rating}</b>
            <span className="text-sub">리뷰 {shop.reviews.toLocaleString('ko-KR')}</span>
          </p>
          <dl className="mx-auto mt-4 grid max-w-xs gap-1.5 text-left text-[15px]">
            <Info k="최소주문" v={won(shop.minOrder)} />
            <Info k="배달시간" v={shop.eta} />
            <Info k="배달팁" v={won(shop.tip)} />
          </dl>
        </section>

        {sections.map((sec) => (
          <section key={sec.title} className="mt-2 bg-white px-5 py-4">
            <h3 className="pb-1 text-[19px] font-bold">{sec.title}</h3>
            <ul>
              {sec.menus.map((m, i) => (
                <li key={m.id} data-target={sec === sections[0] && i === 0 ? 'menu-first' : undefined}>
                  {/* 대표·전체에 같은 메뉴가 두 번 나오면 도움말은 화면 위쪽(먼저 나온) 것을 가리킨다 */}
                  <button
                    data-target={`menu-${m.id}`}
                    onClick={() => navigate(`/food/s/${shop.id}/m/${m.id}`)}
                    className="flex w-full items-center gap-4 py-3 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[18px] font-bold">{m.name}</span>
                      <span className="block truncate text-[15px] text-sub">{m.desc}</span>
                      <span className="mt-1 block text-[17px] font-bold tabular-nums">{won(m.price)}</span>
                    </span>
                    <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-canvas text-[40px]">{m.emoji}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>

      {myCart.length > 0 && (
        <div className="shrink-0 bg-white px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <button data-target="cart-bar" onClick={() => navigate('/food/cart')} className="flex h-14 w-full items-center gap-3 rounded-2xl bg-(--brand) px-5 text-white">
            <span className="grid size-7 place-items-center rounded-full bg-white text-[15px] font-extrabold text-(--brand) tabular-nums">{cartCount(myCart)}</span>
            <span className="flex-1 text-left text-[18px] font-bold">장바구니 보기</span>
            <span className="text-[17px] font-bold tabular-nums">{won(cartSum(myCart))}</span>
          </button>
        </div>
      )}
    </div>
  )
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-16 shrink-0 text-sub">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  )
}
