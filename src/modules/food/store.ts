import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '../../core/format'
import { sessionJSON } from '../../core/persist'
import { DEFAULT_ADDRESS, findShop, type Address } from './data'

export type CartItem = { key: string; shopId: string; menuId: string; name: string; options: string; unit: number; qty: number }
export type SavedAddress = Address & { detail: string; label: string }
export type Order = { id: string; shopId: string; shopName: string; cat: string; total: number; placedAt: number; address: string }

type FoodState = {
  address: SavedAddress | null
  cart: CartItem[]
  order: Order | null
  /** 주소 설정 화면 진행 상태 (도움말이 따라갈 수 있게) */
  addressDraft: Address | null
}

const initial = (address: SavedAddress | null = DEFAULT_ADDRESS): FoodState => ({ address, cart: [], order: null, addressDraft: null })

export const useFood = create<FoodState>()(persist(() => initial(), { name: 'wz.food', storage: sessionJSON }))

export const cartShopId = (cart: CartItem[]) => cart[0]?.shopId ?? null
export const cartSum = (cart: CartItem[]) => cart.reduce((a, i) => a + i.unit * i.qty, 0)
export const cartCount = (cart: CartItem[]) => cart.reduce((a, i) => a + i.qty, 0)

export const foodActions = {
  /** 주소 설정 연습과 자유 연습은 주소 없이 시작 (처음 앱을 깐 상태) */
  reset: (missionId: string | null) => useFood.setState(initial(missionId === 'address' || missionId === null ? null : DEFAULT_ADDRESS)),
  pickAddress: (addressDraft: Address | null) => useFood.setState({ addressDraft }),
  saveAddress: (a: SavedAddress) => useFood.setState({ address: a, addressDraft: null }),
  /** 다른 가게 메뉴가 담겨 있으면 false (호출한 쪽에서 비울지 묻는다) */
  addToCart: (item: Omit<CartItem, 'key'>, replace = false): boolean => {
    const { cart } = useFood.getState()
    const shopId = cartShopId(cart)
    if (shopId && shopId !== item.shopId && !replace) return false
    const base = shopId && shopId !== item.shopId ? [] : cart
    const same = base.find((i) => i.menuId === item.menuId && i.options === item.options)
    useFood.setState({
      cart: same ? base.map((i) => (i === same ? { ...i, qty: i.qty + item.qty } : i)) : [...base, { ...item, key: uid() }],
    })
    return true
  },
  setQty: (key: string, qty: number) => useFood.setState(({ cart }) => ({ cart: cart.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i)) })),
  remove: (key: string) => useFood.setState(({ cart }) => ({ cart: cart.filter((i) => i.key !== key) })),
  /** 결제 완료 → 주문 생성, 장바구니 비움 */
  placeOrder: (): Order | null => {
    const { cart, address } = useFood.getState()
    const shop = findShop(cartShopId(cart) ?? undefined)
    if (!shop || !address || cart.length === 0) return null
    const order: Order = {
      id: uid(),
      shopId: shop.id,
      shopName: shop.name,
      cat: shop.cat,
      total: cartSum(cart) + shop.tip,
      placedAt: Date.now(),
      address: `${address.road} ${address.detail}`.trim(),
    }
    useFood.setState({ order, cart: [] })
    return order
  },
}
