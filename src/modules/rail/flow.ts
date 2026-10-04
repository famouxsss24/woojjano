import type { NavigateFunction } from 'react-router'
import { railActions } from './store'

/** 로그인 화면에 들어올 때 들고 오는 '로그인 후 갈 곳' */
export type LoginState = { next?: 'pay' } | null

/** 로그인(또는 회원가입) 뒤: 고르던 열차가 있으면 예약하고 결제로, 아니면 마이로 */
export function continueAfterLogin(navigate: NavigateFunction, state: LoginState) {
  railActions.login()
  if (state?.next === 'pay' && railActions.reserve()) navigate('/rail/pay', { replace: true })
  else navigate('/rail/my', { replace: true })
}
