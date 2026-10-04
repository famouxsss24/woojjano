import { useState } from 'react'
import { Check } from 'lucide-react'
import { PRACTICE } from '../config'
import { digitsOnly, mmss } from '../format'
import { receiveSms } from '../phone/phoneStore'
import { useCountdown } from '../useNow'
import { BottomBar, CTA } from '../ui/CTA'
import { CARRIERS, TERMS, useVerify } from './verifyStore'

const SMS_DELAY_MS = 1200

/**
 * 휴대폰 본인인증 (약관 동의 → 통신사 → 번호 → 인증번호 문자 → 제한 시간 안에 입력).
 * '지금 눌러야 할 곳'에 data-target="verify-next"를 붙여 도움말이 따라가게 한다.
 */
export function PhoneVerification({ sender, onVerified }: { sender: string; onVerified: () => void }) {
  const { agreed, carrier, phone, code, deadline } = useVerify()
  const { left, expired } = useCountdown(deadline)
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const allAgreed = agreed.every(Boolean)
  const phoneOk = /^01\d{8,9}$/.test(phone)
  const sent = code != null
  const next = !allAgreed ? 'agree' : !carrier ? 'carrier' : !phoneOk ? 'phone' : !sent ? 'request' : input.length < 6 ? 'code' : 'confirm'
  const mark = (step: typeof next) => (next === step ? 'verify-next' : undefined)

  const toggleAll = () => useVerify.setState({ agreed: TERMS.map(() => !allAgreed) })
  const toggleOne = (i: number) => useVerify.setState({ agreed: agreed.map((v, j) => (j === i ? !v : v)) })

  const request = () => {
    if (!allAgreed || !carrier || !phoneOk) return
    const newCode = String(Math.floor(100000 + Math.random() * 900000))
    useVerify.setState({ code: newCode, deadline: Date.now() + PRACTICE.verifySeconds * 1000 })
    setInput('')
    setError(null)
    window.setTimeout(() => receiveSms('1600-0000', `[Web발신]\n[${sender}] 인증번호 [${newCode}]를 입력해 주세요. 다른 사람에게 절대 알려주지 마세요.`), SMS_DELAY_MS)
  }

  const confirm = () => {
    if (expired) return setError('입력 시간이 지났어요. [재전송]을 눌러 새 번호를 받아 주세요')
    if (input !== code) return setError('인증번호가 맞지 않아요. 문자를 다시 확인해 주세요')
    onVerified()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
        <h2 className="pt-2 text-[24px] leading-snug font-bold">
          휴대폰 본인인증을
          <br />
          진행해 주세요
        </h2>

        <section className="mt-6 rounded-2xl bg-canvas p-2">
          <button data-target={mark('agree')} onClick={toggleAll} className="flex w-full items-center gap-3 rounded-xl bg-white p-4 text-left">
            <CheckCircle on={allAgreed} />
            <span className="text-[17px] font-bold">약관 전체 동의</span>
          </button>
          <ul className="px-2 py-1">
            {TERMS.map((t, i) => (
              <li key={t}>
                <button onClick={() => toggleOne(i)} className="flex w-full items-center gap-2.5 py-2 text-left text-[15px] text-sub">
                  <Check size={18} className={agreed[i] ? 'text-(--brand)' : 'text-gray-300'} strokeWidth={3} />
                  (필수) {t}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-7 mb-2 text-[15px] font-semibold text-sub">통신사</p>
        <div data-target={mark('carrier')} className="grid grid-cols-4 gap-2">
          {CARRIERS.map((c) => (
            <button
              key={c}
              onClick={() => useVerify.setState({ carrier: c })}
              className={`h-12 rounded-xl text-[16px] font-semibold ${carrier === c ? 'bg-(--brand) text-(--brand-ink)' : 'bg-canvas'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mt-7 mb-2 text-[15px] font-semibold text-sub">휴대폰 번호</p>
        <div className="flex gap-2">
          <input
            data-target={mark('phone')}
            inputMode="numeric"
            placeholder="숫자만 입력 (예: 01012345678)"
            value={phone}
            maxLength={11}
            onChange={(e) => useVerify.setState({ phone: digitsOnly(e.target.value) })}
            className="h-14 min-w-0 flex-1 rounded-xl bg-canvas px-4 text-[18px] tabular-nums outline-none focus:ring-2 focus:ring-(--brand)"
          />
          <button
            data-target={mark('request')}
            onClick={request}
            disabled={!allAgreed || !carrier || !phoneOk}
            className="h-14 w-[7.5rem] shrink-0 rounded-xl bg-ink text-[16px] font-bold text-white disabled:bg-gray-200 disabled:text-gray-400"
          >
            {sent ? '재전송' : '인증번호 받기'}
          </button>
        </div>
        <p className="mt-2 text-[14px] text-faint">연습 앱은 번호를 저장하지 않아요. 아무 번호나 넣어도 돼요.</p>

        {sent && (
          <>
            <p className="mt-7 mb-2 text-[15px] font-semibold text-sub">인증번호 6자리</p>
            <div className="relative">
              <input
                data-target={mark('code')}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="문자로 받은 숫자"
                value={input}
                maxLength={6}
                onChange={(e) => {
                  setInput(digitsOnly(e.target.value))
                  setError(null)
                }}
                className="h-14 w-full rounded-xl bg-canvas pr-20 pl-4 text-[20px] tracking-[0.2em] tabular-nums outline-none focus:ring-2 focus:ring-(--brand)"
              />
              <span className={`absolute top-1/2 right-4 w-[5ch] -translate-y-1/2 text-right text-[17px] font-bold tabular-nums ${expired ? 'text-faint' : 'text-red-500'}`}>
                {mmss(left)}
              </span>
            </div>
            <p className="mt-2 min-h-[1.5em] text-[15px] font-semibold text-red-500">{error}</p>
            <p className="text-[14px] leading-relaxed text-faint">문자 알림을 놓쳤다면 화면 맨 위를 아래로 쓸어내려 보세요.</p>
          </>
        )}
      </main>
      <BottomBar>
        <CTA target={mark('confirm')} disabled={!sent || input.length < 6} onClick={confirm}>
          확인
        </CTA>
      </BottomBar>
    </div>
  )
}

function CheckCircle({ on }: { on: boolean }) {
  return (
    <span className={`grid size-7 shrink-0 place-items-center rounded-full ${on ? 'bg-(--brand) text-(--brand-ink)' : 'bg-gray-200 text-white'}`}>
      <Check size={18} strokeWidth={3} />
    </span>
  )
}
