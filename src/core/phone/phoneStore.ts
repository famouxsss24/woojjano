import { create } from 'zustand'
import { uid } from '../format'

/** 가짜 휴대폰 문자(인증번호 등). 메모리에만 두고 저장하지 않는다. */
export type Sms = { id: string; from: string; body: string; at: number }

type PhoneState = { inbox: Sms[]; bannerId: string | null; shadeOpen: boolean }

export const usePhone = create<PhoneState>(() => ({ inbox: [], bannerId: null, shadeOpen: false }))

const BANNER_MS = 8000
let bannerTimer: number | undefined

export function receiveSms(from: string, body: string) {
  const sms: Sms = { id: uid(), from, body, at: Date.now() }
  usePhone.setState((s) => ({ inbox: [sms, ...s.inbox], bannerId: sms.id }))
  window.clearTimeout(bannerTimer)
  bannerTimer = window.setTimeout(() => usePhone.setState({ bannerId: null }), BANNER_MS)
}

export const dismissBanner = () => usePhone.setState({ bannerId: null })
export const setShade = (shadeOpen: boolean) => usePhone.setState({ shadeOpen, bannerId: shadeOpen ? null : usePhone.getState().bannerId })

export function resetPhone() {
  window.clearTimeout(bannerTimer)
  usePhone.setState({ inbox: [], bannerId: null, shadeOpen: false })
}
