import { useState } from 'react'
import { Check } from 'lucide-react'
import { PRACTICE } from '../config'
import { won } from '../format'
import { BottomBar, CTA } from '../ui/CTA'
import { KeypadSheet } from '../ui/SecureKeypad'

export const PAY_METHODS = [
  { id: 'kwpay', label: 'KW페이', sub: '간편결제 · 비밀번호 6자리' },
  { id: 'card', label: '신용·체크카드', sub: 'KW카드 ****1234' },
  { id: 'account', label: '계좌이체', sub: 'KW뱅킹 110-***-375910' },
] as const

export type PayMethodId = (typeof PAY_METHODS)[number]['id']

/** 결제 수단 고르기 */
export function PayMethodList({ value, onChange }: { value: PayMethodId; onChange: (id: PayMethodId) => void }) {
  return (
    <ul className="grid gap-2">
      {PAY_METHODS.map((m) => {
        const on = m.id === value
        return (
          <li key={m.id}>
            <button onClick={() => onChange(m.id)} className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left ${on ? 'bg-(--brand)/10' : 'bg-canvas'}`}>
              <span className={`grid size-6 shrink-0 place-items-center rounded-full ${on ? 'bg-(--brand) text-(--brand-ink)' : 'bg-white'}`}>
                {on && <Check size={16} strokeWidth={3} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-bold">{m.label}</span>
                <span className="block text-[14px] text-sub">{m.sub}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

type CheckoutProps = { amount: number; disabled?: boolean; onPaid: () => void }

/** 화면 맨 아래 [결제하기] + 결제 비밀번호 창. 화면 루트(relative) 안에 둔다. */
export function PayCheckout({ amount, disabled, onPaid }: CheckoutProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <BottomBar>
        <CTA target="pay-submit" disabled={disabled} onClick={() => setOpen(true)}>
          {won(amount)} 결제하기
        </CTA>
      </BottomBar>
      <KeypadSheet
        open={open && !disabled}
        title="결제 비밀번호"
        subtitle={`${won(amount)}을 결제해요`}
        length={6}
        answer={PRACTICE.simplePin}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false)
          onPaid()
        }}
      />
    </>
  )
}
