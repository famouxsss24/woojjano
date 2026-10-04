import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { ChevronDown } from 'lucide-react'
import { digitsOnly } from '../../../core/format'
import { AppBar } from '../../../core/ui/AppBar'
import { BottomBar, CTA } from '../../../core/ui/CTA'
import { BottomSheet } from '../../../core/ui/Overlays'
import { notReady } from '../../../core/ui/toast'
import { BANKS, RECENT_PAYEES, formatAccount, lookupName, type Payee } from '../data'
import { bankActions, useBank } from '../store'

const TABS = ['최근', '자주', '내 계좌']

export default function BankTransfer() {
  const loggedIn = useBank((s) => s.loggedIn)
  const form = useBank((s) => s.form)
  const navigate = useNavigate()
  const [sheet, setSheet] = useState(false)
  if (!loggedIn) return <Navigate to="/bank" replace />

  const valid = !!form.bank && form.account.length >= 10 && form.account.length <= 14

  const choose = (payee: Payee) => {
    bankActions.pickPayee(payee)
    navigate('/bank/transfer/amount')
  }

  const next = () => {
    if (!valid || !form.bank) return
    choose({ name: lookupName(form.bank, form.account), bank: form.bank, account: form.account })
  }

  return (
    <div className="relative flex h-full flex-col bg-white">
      <AppBar title="이체" />
      <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        <h2 className="pt-2 text-[24px] font-bold">누구에게 보낼까요?</h2>

        <div className="mt-5 rounded-2xl bg-canvas">
          <button data-target="bank-select" onClick={() => setSheet(true)} className="flex h-14 w-full items-center justify-between px-4 text-[18px] font-semibold">
            <span className={form.bank ? '' : 'text-faint'}>{form.bank ?? '은행 선택'}</span>
            <ChevronDown size={22} className="text-sub" />
          </button>
          <input
            data-target="account-input"
            inputMode="numeric"
            placeholder="계좌번호 입력 (숫자만)"
            value={form.account}
            maxLength={14}
            onChange={(e) => bankActions.setForm({ account: digitsOnly(e.target.value) })}
            className="h-14 w-full rounded-b-2xl bg-transparent px-4 text-[19px] tabular-nums outline-none focus:bg-(--brand)/5"
          />
        </div>
        {form.account.length > 0 && form.account.length < 10 && <p className="mt-2 text-[15px] text-sub">계좌번호는 10~14자리예요</p>}

        <div className="mt-8 flex gap-5">
          {TABS.map((t, i) => (
            <button key={t} onClick={i === 0 ? undefined : notReady} className={`pb-1 text-[17px] font-bold ${i === 0 ? 'border-b-2 border-ink' : 'text-faint'}`}>
              {t}
            </button>
          ))}
        </div>
        <p className="mt-4 mb-1 text-[14px] font-semibold text-faint">최근 보낸 분</p>
        <ul>
          {RECENT_PAYEES.map((p) => (
            <li key={p.account}>
              <button data-target={`recent-${p.name}`} onClick={() => choose(p)} className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-2xl px-2 py-3 text-left active:bg-black/5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-(--brand)/10 text-[18px] font-bold text-(--brand)">{p.name[0]}</span>
                <span className="min-w-0">
                  <span className="block text-[18px] font-bold">
                    {p.name} {p.relation && <span className="text-[15px] font-semibold text-sub">· {p.relation}</span>}
                  </span>
                  <span className="block text-[15px] text-sub tabular-nums">
                    {p.bank} {formatAccount(p.account)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </main>

      <BottomBar>
        <CTA target="transfer-next" disabled={!valid} onClick={next}>
          다음
        </CTA>
      </BottomBar>

      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="은행을 골라 주세요">
        <div className="grid grid-cols-3 gap-2 px-5 pb-6">
          {BANKS.map((b) => (
            <button
              key={b}
              data-target={`bank-opt-${b}`}
              onClick={() => {
                bankActions.setForm({ bank: b })
                setSheet(false)
              }}
              className={`h-16 rounded-2xl text-[16px] font-semibold ${form.bank === b ? 'bg-(--brand) text-white' : 'bg-canvas'}`}
            >
              {b}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}
