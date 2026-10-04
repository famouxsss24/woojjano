import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { AppBar } from '../../../core/ui/AppBar'
import { CTA } from '../../../core/ui/CTA'
import { notReady } from '../../../core/ui/toast'
import { continueAfterLogin, type LoginState } from '../flow'

const TABS = ['휴대폰번호', '회원번호', '이메일'] as const

export default function RailLogin() {
  const navigate = useNavigate()
  const state = useLocation().state as LoginState
  const [tab, setTab] = useState<(typeof TABS)[number]>('휴대폰번호')
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const valid = id.trim().length >= 4 && pw.length >= 4

  return (
    <div className="flex h-full flex-col bg-white">
      <AppBar title="로그인" backIcon="close" />
      <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
        <h2 className="pt-2 text-[26px] font-extrabold text-(--brand)">KW레일</h2>
        <div className="mt-6 grid grid-cols-3 rounded-xl bg-canvas p-1">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`h-11 rounded-lg text-[15px] font-bold ${t === tab ? 'bg-white shadow-sm' : 'text-faint'}`}>
              {t}
            </button>
          ))}
        </div>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          inputMode={tab === '이메일' ? 'email' : 'numeric'}
          placeholder={tab}
          className="mt-4 h-14 w-full rounded-xl bg-canvas px-4 text-[18px] outline-none focus:ring-2 focus:ring-(--brand)"
        />
        <input
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          type="password"
          placeholder="비밀번호"
          className="mt-2 h-14 w-full rounded-xl bg-canvas px-4 text-[18px] outline-none focus:ring-2 focus:ring-(--brand)"
        />
        <p className="mt-2 text-[14px] text-faint">연습 앱이라 아무거나 4글자 이상 넣으면 로그인돼요.</p>
        <CTA className="mt-6" disabled={!valid} onClick={() => continueAfterLogin(navigate, state)}>
          로그인
        </CTA>
        <div className="mt-8 flex justify-center gap-6 text-[16px] font-semibold text-sub">
          <button data-target="rail-signup" onClick={() => navigate('/rail/signup', { state })} className="py-2">
            회원가입
          </button>
          <button onClick={notReady} className="py-2">
            비밀번호 찾기
          </button>
          <button onClick={notReady} className="py-2">
            비회원 예매
          </button>
        </div>
      </main>
    </div>
  )
}
