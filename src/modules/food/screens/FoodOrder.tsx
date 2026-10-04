import { useState, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { ChevronRight, MapPin } from 'lucide-react'
import { emit } from '../../../core/mission/missionStore'
import { PayCheckout, PayMethodList, type PayMethodId } from '../../../core/flows/Payment'
import { won } from '../../../core/format'
import { AppBar } from '../../../core/ui/AppBar'
import { toast } from '../../../core/ui/toast'
import { findShop } from '../data'
import { cartShopId, cartSum, foodActions, useFood } from '../store'

const RIDER_REQUESTS = ['문 앞에 두고 벨 눌러 주세요', '직접 받을게요', '문 앞에 두고 벨은 누르지 마세요']

export default function FoodOrder() {
  const cart = useFood((s) => s.cart)
  const address = useFood((s) => s.address)
  const hasOrder = useFood((s) => s.order != null)
  const navigate = useNavigate()
  const [toShop, setToShop] = useState('')
  const [rider, setRider] = useState(RIDER_REQUESTS[0])
  const [spoon, setSpoon] = useState(false)
  const [method, setMethod] = useState<PayMethodId>('kwpay')
  const shop = findShop(cartShopId(cart) ?? undefined)
  // 결제 직후엔 장바구니가 비므로, 방금 한 주문이 있으면 주문 현황으로 보낸다 (경합 방지)
  if (!shop || cart.length === 0) return <Navigate to={hasOrder ? '/food/status' : '/food/cart'} replace />

  const total = cartSum(cart) + shop.tip

  const paid = () => {
    const order = foodActions.placeOrder()
    if (!order) return toast('주문할 수 없어요. 주소와 장바구니를 확인해 주세요')
    navigate('/food/status', { replace: true })
    emit('food.ordered', { cat: order.cat, total: order.total })
  }

  return (
    <div className="relative flex h-full flex-col bg-canvas">
      <AppBar title="주문하기" />
      <main className="min-h-0 flex-1 overflow-y-auto pb-6">
        <Section title="배달 주소">
          <button data-target={address ? undefined : 'order-address'} onClick={() => navigate('/food/address')} className="flex w-full items-center gap-3 text-left">
            <MapPin className="shrink-0 text-(--brand)" size={22} />
            {address ? (
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-bold">{address.label}</span>
                <span className="block text-[15px] text-sub">
                  {address.road} {address.detail}
                </span>
              </span>
            ) : (
              <span className="flex-1 text-[17px] font-bold text-(--brand)">배달 받을 주소를 설정해 주세요</span>
            )}
            <ChevronRight className="shrink-0 text-faint" size={22} />
          </button>
        </Section>

        <Section title="요청사항">
          <p className="mb-2 text-[15px] font-semibold text-sub">가게 사장님께</p>
          <input
            value={toShop}
            onChange={(e) => setToShop(e.target.value)}
            maxLength={50}
            placeholder="예: 덜 맵게 해 주세요"
            className="h-13 w-full rounded-xl bg-canvas px-4 text-[17px] outline-none focus:ring-2 focus:ring-(--brand)"
          />
          <label className="mt-3 flex items-center gap-2 text-[16px]">
            <input type="checkbox" checked={spoon} onChange={(e) => setSpoon(e.target.checked)} className="size-5 accent-(--brand)" />
            일회용 수저·포크 받기
          </label>
          <p className="mt-5 mb-2 text-[15px] font-semibold text-sub">배달 기사님께</p>
          <div className="grid gap-2">
            {RIDER_REQUESTS.map((r) => (
              <button key={r} onClick={() => setRider(r)} className={`h-12 rounded-xl px-4 text-left text-[16px] font-semibold ${r === rider ? 'bg-(--brand)/10 text-(--brand)' : 'bg-canvas'}`}>
                {r}
              </button>
            ))}
          </div>
        </Section>

        <Section title="결제 수단">
          <PayMethodList value={method} onChange={setMethod} />
        </Section>

        <Section title="결제 금액">
          <div className="grid gap-2 text-[17px]">
            <div className="flex justify-between">
              <span className="text-sub">주문 금액</span>
              <span className="tabular-nums">{won(cartSum(cart))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sub">배달팁</span>
              <span className="tabular-nums">{won(shop.tip)}</span>
            </div>
            <div className="mt-1 flex justify-between text-[19px] font-extrabold">
              <span>총 결제 금액</span>
              <span className="tabular-nums">{won(total)}</span>
            </div>
          </div>
        </Section>
        {!address && <p className="px-5 pt-3 text-center text-[15px] font-semibold text-(--brand)">주소를 먼저 설정해야 결제할 수 있어요</p>}
      </main>

      <PayCheckout amount={total} disabled={!address} onPaid={paid} />
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-2 bg-white px-5 py-5">
      <h3 className="mb-3 text-[18px] font-bold">{title}</h3>
      {children}
    </section>
  )
}
