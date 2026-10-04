import type { HintStep, PracticeModule } from '../../core/mission/types'
import { PRACTICE } from '../../core/config'
import { findShop } from './data'
import { cartShopId, cartSum, foodActions, useFood } from './store'

const belowMin = () => {
  const { cart } = useFood.getState()
  const shop = findShop(cartShopId(cart) ?? undefined)
  return !!shop && cartSum(cart) < shop.minOrder
}

const MENU_DETAIL: HintStep = { path: '/food/s/:shop/m/:menu', text: '꼭 골라야 하는 것(필수)을 고르고 아래 [담기]를 누르세요', target: ['opt-next', 'add-cart'] }

export const foodModule: PracticeModule = {
  id: 'food',
  name: '음식 주문',
  brand: 'KW배달',
  emoji: '🍜',
  color: '#FF6B3D',
  ink: '#FFFFFF',
  summary: '장바구니 담기 · 주소 설정 · 결제',
  modeledOn: '배달의민족의 순서(종류 → 가게 → 메뉴·옵션 → 장바구니 → 주소·요청사항 → 결제)를 그대로 따라 만들었어요. 가게는 모두 연습용이에요.',
  basePath: '/food',
  freePath: '/food',
  reset: (missionId) => foodActions.reset(missionId),
  missions: [
    {
      id: 'cart',
      title: '짜장면 장바구니에 담기',
      detail: '실제 앱에서도 여기까지만 해봐요',
      startPath: '/food',
      completeOn: 'food.cart.add',
      check: (p) => (p.menuName === '짜장면' ? null : `짜장면을 담아야 해요. 이번엔 '${String(p.menuName)}'을 담았어요`),
      steps: [
        { path: '/food', text: '[중식]을 누르세요', target: 'cat-chinese' },
        { path: '/food/c/:cat', text: '[월계반점]을 누르세요', target: 'shop-wolgye' },
        { path: '/food/s/:shop', text: '[짜장면]을 누르세요', target: 'menu-jjajang' },
        MENU_DETAIL,
      ],
    },
    {
      id: 'address',
      title: '배달 받을 주소 설정하기',
      detail: '주소 검색 → 동·호수 입력',
      startPath: '/food',
      completeOn: 'food.address.set',
      steps: [
        { path: '/food', text: '맨 위 [주소를 설정해 주세요]를 누르세요', target: 'food-address' },
        { path: '/food/address', when: () => useFood.getState().addressDraft == null, text: "검색칸에 '석계로'처럼 길 이름을 쓰고, 나온 주소를 누르세요", target: ['addr-result-0', 'addr-search'] },
        { path: '/food/address', text: "상세주소(예: '1층', '101동 202호')를 쓰고 [이 주소로 설정]을 누르세요", target: 'addr-next' },
      ],
    },
    {
      id: 'order',
      title: '치킨 시켜서 결제까지 해보기',
      detail: '진짜 돈은 나가지 않아요',
      startPath: '/food',
      completeOn: 'food.ordered',
      check: (p) => (p.cat === 'chicken' ? null : '치킨집에서 시켜야 해요'),
      steps: [
        { path: '/food', text: '[치킨]을 누르세요', target: 'cat-chicken' },
        { path: '/food/c/:cat', text: '[바삭치킨 월계점]을 누르세요. 다른 치킨집도 괜찮아요', target: 'shop-crispy' },
        { path: '/food/s/:shop', when: () => useFood.getState().cart.length > 0, text: '아래 [장바구니 보기]를 누르세요', target: 'cart-bar' },
        { path: '/food/s/:shop', text: '먹고 싶은 메뉴를 누르세요', target: 'menu-first' },
        MENU_DETAIL,
        { path: '/food/cart', when: belowMin, text: '최소주문금액이 모자라요. ‹ 를 눌러 메뉴를 더 담으세요', target: 'cart-add-more' },
        { path: '/food/cart', text: '[배달 주문하기]를 누르세요', target: 'cart-order' },
        { path: '/food/order', text: `요청사항을 확인하고 [결제하기] → 결제 비밀번호 ${PRACTICE.simplePin}`, target: ['keypad', 'pay-submit'] },
      ],
    },
  ],
}
