import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { PartyPopper } from 'lucide-react'
import { PRACTICE } from '../../../core/config'
import { BottomBar, CTA } from '../../../core/ui/CTA'
import { continueAfterLogin, type LoginState } from '../flow'

export default function RailSignupDone() {
  const navigate = useNavigate()
  const state = useLocation().state as LoginState
  const [memberNo] = useState(() => String(Math.floor(1e9 + Math.random() * 9e9)))
  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <PartyPopper size={64} className="text-(--brand)" strokeWidth={1.6} />
        <h2 className="mt-6 text-[26px] font-bold">가입을 축하해요!</h2>
        <p className="mt-2 text-[17px] text-sub">{PRACTICE.userName}님의 회원번호</p>
        <p className="mt-1 text-[24px] font-extrabold tracking-wider tabular-nums">{memberNo}</p>
        <p className="mt-6 text-[15px] text-faint">실제 앱에서는 회원번호를 적어 두면 좋아요</p>
      </main>
      <BottomBar>
        <CTA onClick={() => continueAfterLogin(navigate, state)}>로그인하고 계속하기</CTA>
      </BottomBar>
    </div>
  )
}
