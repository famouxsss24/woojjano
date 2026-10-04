import { useNavigate } from 'react-router'
import { Minus, Plus, X } from 'lucide-react'
import { won } from '../../../core/format'
import { AppBar } from '../../../core/ui/AppBar'
import { BottomBar, CTA } from '../../../core/ui/CTA'
import { notReady } from '../../../core/ui/toast'
import { findShop } from '../data'
import { cartShopId, cartSum, foodActions, useFood } from '../store'

export default function FoodCart() {
  const cart = useFood((s) => s.cart)
  const navigate = useNavigate()
  const shop = findShop(cartShopId(cart) ?? undefined)

  if (!shop || cart.length === 0) {
    return (
      <div className="flex h-full flex-col bg-white">
        <AppBar title="장바구니" />
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="text-[56px]">🛒</p>
          <p className="mt-3 text-[20px] font-bold">장바구니가 비어 있어요</p>
          <CTA variant="soft" className="mt-6 max-w-60" onClick={() => navigate('/food', { replace: true })}>
            메뉴 보러 가기
          </CTA>
        </div>
      </div>
    )
  }

  const sum = cartSum(cart)
  const short = shop.minOrder - sum

  return (
    <div className="flex h-full flex-col bg-canvas">
      <AppBar title="장바구니" />
      <main className="min-h-0 flex-1 overflow-y-auto pb-6">
        <div className="mx-4 mt-1 grid grid-cols-2 rounded-xl bg-white p-1 text-[16px] font-bold">
          <span className="rounded-lg bg-ink py-2.5 text-center text-white">배달</span>
          <button onClick={notReady} className="py-2.5 text-faint">
            포장
          </button>
        </div>

        <section className="mt-3 bg-white px-5 py-4">
          <p className="text-[19px] font-bold">
            {shop.emoji} {shop.name}
          </p>
          <ul className="mt-2">
            {cart.map((item) => (
              <li key={item.key} className="py-3">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[17px] font-bold">{item.name}</p>
                    {item.options && <p className="text-[15px] text-sub">{item.options}</p>}
                    <p className="mt-1 text-[17px] font-bold tabular-nums">{won(item.unit * item.qty)}</p>
                  </div>
                  <button aria-label={`${item.name} 빼기`} onClick={() => foodActions.remove(item.key)} className="grid size-10 place-items-center rounded-full text-faint active:bg-black/5">
                    <X size={20} />
                  </button>
                </div>
                <div className="mt-2 flex w-fit items-center rounded-full bg-canvas">
                  <button aria-label="빼기" disabled={item.qty <= 1} onClick={() => foodActions.setQty(item.key, item.qty - 1)} className="grid size-10 place-items-center disabled:opacity-30">
                    <Minus size={18} />
                  </button>
                  <span className="w-7 text-center text-[17px] font-bold tabular-nums">{item.qty}</span>
                  <button aria-label="더하기" onClick={() => foodActions.setQty(item.key, item.qty + 1)} className="grid size-10 place-items-center">
                    <Plus size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button data-target="cart-add-more" onClick={() => navigate(`/food/s/${shop.id}`)} className="mt-1 flex h-12 w-full items-center justify-center gap-1 rounded-2xl bg-canvas text-[16px] font-bold">
            <Plus size={18} /> 메뉴 더 담기
          </button>
        </section>

        <section className="mt-2 grid gap-2 bg-white px-5 py-5 text-[17px]">
          <Line k="메뉴 금액" v={won(sum)} />
          <Line k="배달팁" v={won(shop.tip)} />
          <div className="mt-2 flex justify-between text-[19px] font-extrabold">
            <span>결제 예정 금액</span>
            <span className="tabular-nums">{won(sum + shop.tip)}</span>
          </div>
        </section>
      </main>

      <BottomBar>
        {short > 0 && <p className="mb-2 text-center text-[15px] font-semibold text-(--brand)">최소주문금액까지 {won(short)} 남았어요</p>}
        <CTA target="cart-order" disabled={short > 0} onClick={() => navigate('/food/order')}>
          {won(sum + shop.tip)} 배달 주문하기
        </CTA>
      </BottomBar>
    </div>
  )
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sub">{k}</span>
      <span className="font-semibold tabular-nums">{v}</span>
    </div>
  )
}
