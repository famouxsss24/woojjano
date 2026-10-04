import { create } from 'zustand'

export const TERMS = ['개인정보 이용 동의', '고유식별정보 처리 동의', '통신사 이용약관 동의', '본인확인 서비스 이용 동의'] as const
export const CARRIERS = ['SKT', 'KT', 'LG U+', '알뜰폰'] as const

/**
 * 휴대폰 본인인증 진행 상태. 문자 앱에 다녀와도(화면이 바뀌어도) 남아 있어야 해서 스토어에 둔다.
 * 전화번호가 들어가므로 저장소(persist)에는 쓰지 않고 메모리에만 둔다.
 */
type VerifyState = {
  agreed: boolean[]
  carrier: string | null
  phone: string
  code: string | null
  deadline: number | null
}

const initial = (): VerifyState => ({ agreed: TERMS.map(() => false), carrier: null, phone: '', code: null, deadline: null })

export const useVerify = create<VerifyState>(initial)
export const resetVerify = () => useVerify.setState(initial())
