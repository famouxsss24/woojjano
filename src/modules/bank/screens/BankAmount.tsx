import { Navigate, useNavigate } from 'react-router'
import { koreanWon, won } from '../../../core/format'
import { AppBar } from '../../../core/ui/AppBar'
import { BottomBar, CTA } from '../../../core/ui/CTA'
import { formatAccount } from '../data'
import { bankActions, useBank } from '../store'
import { NumberPad } from '../ui'

const QUICK = [
  { label: '+1만', add: 10_000 },
  { label: '+5만', add: 50_000 },
  { label: '+10만', add: 100_000 },
  { label: '+100만', add: 1_000_000 },
]
const MAX_DIGITS = 9

export default function BankAmount() {
  const draft = useBank((s) => s.draft)
  const balance = useBank((s) => s.balance)
  const navigate = useNavigate()
  if (!draft.payee) return <Navigate to="/bank/transfer" replace />

  const { amount, payee } = draft
  const over = amount > balance
  const set = (n: number) => bankActions.setAmount(Math.min(Math.max(0, n), 10 ** MAX_DIGITS - 1))

  const digit = (d: string) => {
    if (String(amount).length + d.length > MAX_DIGITS && amount > 0) return
    set(amount === 0 ? Number(d) : Number(`${amount}${d}`))
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <AppBar title="보낼 금액" />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5">
        <p className="pt-2 text-[18px]">
          <b>{payee.name}</b>님에게
        </p>
        <p className="text-[15px] text-sub tabular-nums">
          {payee.bank} {formatAccount(payee.account)}
        </p>

        {/* 금액·읽기·안내 줄은 높이를 고정해 아래 버튼이 위아래로 흔들리지 않게 한다 */}
        <div className="mt-6 h-12">
          {amount > 0 ? (
            <p className={`text-[34px] leading-none font-extrabold tabular-nums ${over ? 'text-red-500' : ''}`}>{won(amount)}</p>
          ) : (
            <p className="text-[30px] leading-none font-bold text-faint">얼마를 보낼까요?</p>
          )}
        </div>
        <p className="h-7 text-[17px] font-semibold text-(--brand)">{amount > 0 ? koreanWon(amount) : ''}</p>
        <p className={`h-7 text-[15px] tabular-nums ${over ? 'font-semibold text-red-500' : 'text-sub'}`}>
          {over ? '잔액이 부족해요' : `보낼 수 있는 돈 ${won(balance)}`}
        </p>

        <div className="mt-auto grid grid-cols-5 gap-1.5 pb-3">
          {QUICK.map((q) => (
            <button key={q.label} data-target={`quick-${q.add}`} onClick={() => set(amount + q.add)} className="h-12 rounded-xl bg-canvas text-[15px] font-bold">
              {q.label}
            </button>
          ))}
          <button onClick={() => set(balance)} className="h-12 rounded-xl bg-canvas text-[15px] font-bold">
            전액
          </button>
        </div>
      </main>
      <NumberPad onDigit={digit} onBackspace={() => set(Math.floor(amount / 10))} />
      <BottomBar>
        <CTA target="amount-next" disabled={amount <= 0 || over} onClick={() => navigate('/bank/transfer/confirm')}>
          다음
        </CTA>
      </BottomBar>
    </div>
  )
}
