import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Check, Minus, Plus } from 'lucide-react'
import { emit } from '../../../core/mission/missionStore'
import { won } from '../../../core/format'
import { AppBar } from '../../../core/ui/AppBar'
import { BottomBar, CTA } from '../../../core/ui/CTA'
import { Dialog } from '../../../core/ui/Overlays'
import { toast } from '../../../core/ui/toast'
import { findShop, type OptionGroup } from '../data'
import { foodActions } from '../store'

/** 그룹별로 고른 선택지 id */
type Picks = Record<string, string[]>

export default function FoodMenu() {
  const { shop: shopId, menu: menuId } = useParams()
  const navigate = useNavigate()
  const [picks, setPicks] = useState<Picks>({})
  const [qty, setQty] = useState(1)
  const [conflict, setConflict] = useState(false)
  const shop = findShop(shopId)
  const menu = shop?.menus.find((m) => m.id === menuId)
  if (!shop || !menu) return <Navigate to={shop ? `/food/s/${shop.id}` : '/food'} replace />

  const groups = menu.options ?? []
  const missing = groups.find((g) => g.required && !picks[g.id]?.length)
  const chosen = groups.flatMap((g) => g.choices.filter((c) => picks[g.id]?.includes(c.id)))
  const unit = menu.price + chosen.reduce((a, c) => a + c.price, 0)

  const toggle = (g: OptionGroup, choiceId: string) =>
    setPicks((p) => {
      const cur = p[g.id] ?? []
      const next = g.multi ? (cur.includes(choiceId) ? cur.filter((x) => x !== choiceId) : [...cur, choiceId]) : [choiceId]
      return { ...p, [g.id]: next }
    })

  const add = (replace = false) => {
    if (missing) {
      toast(`'${missing.name}'을 골라 주세요`)
      return
    }
    const ok = foodActions.addToCart({ shopId: shop.id, menuId: menu.id, name: menu.name, options: chosen.map((c) => c.name).join(', '), unit, qty }, replace)
    if (!ok) {
      setConflict(true)
      return
    }
    toast('장바구니에 담았어요')
    navigate(-1)
    emit('food.cart.add', { menuName: menu.name, shopId: shop.id })
  }

  return (
    <div className="relative flex h-full flex-col bg-canvas">
      <AppBar title={menu.name} backIcon="close" />
      <main className="min-h-0 flex-1 overflow-y-auto pb-6">
        <section className="bg-white px-5 pb-6 text-center">
          <div className="grid h-40 place-items-center rounded-3xl bg-canvas text-[80px]">{menu.emoji}</div>
          <h2 className="mt-4 text-[24px] font-extrabold">{menu.name}</h2>
          <p className="mt-1 text-[16px] text-sub">{menu.desc}</p>
          <p className="mt-2 text-[20px] font-bold tabular-nums">{won(menu.price)}</p>
        </section>

        {groups.map((g) => (
          <section key={g.id} className="mt-2 bg-white px-5 py-5">
            <div className="flex items-center gap-2">
              <h3 className="text-[19px] font-bold">{g.name}</h3>
              <span className={`rounded-full px-2 py-0.5 text-[13px] font-bold ${g.required ? 'bg-(--brand)/12 text-(--brand)' : 'bg-canvas text-sub'}`}>
                {g.required ? '필수' : '선택'}
              </span>
            </div>
            <ul data-target={missing?.id === g.id ? 'opt-next' : undefined} className="mt-2">
              {g.choices.map((c) => {
                const on = !!picks[g.id]?.includes(c.id)
                return (
                  <li key={c.id}>
                    <button onClick={() => toggle(g, c.id)} className="flex w-full items-center gap-3 py-3 text-left">
                      <span
                        className={`grid size-6 shrink-0 place-items-center ${g.multi ? 'rounded-md' : 'rounded-full'} ${on ? 'bg-(--brand) text-white' : 'bg-white shadow-[inset_0_0_0_2px_#d1d5db]'}`}
                      >
                        {on && <Check size={16} strokeWidth={3} />}
                      </span>
                      <span className="flex-1 text-[17px]">{c.name}</span>
                      <span className="text-[16px] text-sub tabular-nums">{c.price ? `+${won(c.price)}` : ''}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}

        <section className="mt-2 flex items-center justify-between bg-white px-5 py-5">
          <h3 className="text-[19px] font-bold">수량</h3>
          <div className="flex items-center rounded-full bg-canvas">
            <button aria-label="빼기" disabled={qty <= 1} onClick={() => setQty(qty - 1)} className="grid size-11 place-items-center disabled:opacity-30">
              <Minus size={20} />
            </button>
            <span className="w-8 text-center text-[19px] font-bold tabular-nums">{qty}</span>
            <button aria-label="더하기" disabled={qty >= 20} onClick={() => setQty(qty + 1)} className="grid size-11 place-items-center disabled:opacity-30">
              <Plus size={20} />
            </button>
          </div>
        </section>
      </main>

      <BottomBar>
        <CTA target="add-cart" onClick={() => add()}>
          {won(unit * qty)} 담기
        </CTA>
      </BottomBar>

      <Dialog
        open={conflict}
        title="장바구니에는 같은 가게 메뉴만 담을 수 있어요"
        actions={[
          { label: '취소', onClick: () => setConflict(false) },
          {
            label: '담기',
            primary: true,
            onClick: () => {
              setConflict(false)
              add(true)
            },
          },
        ]}
      >
        전에 담은 다른 가게 메뉴는 지우고 이 메뉴를 담을까요?
      </Dialog>
    </div>
  )
}
