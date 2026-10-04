import { useEffect } from 'react'
import { Navigate } from 'react-router'
import { ChevronDown } from 'lucide-react'
import { emit } from '../../../core/mission/missionStore'
import { hhmm, won } from '../../../core/format'
import { AppBar } from '../../../core/ui/AppBar'
import { notReady } from '../../../core/ui/toast'
import { MY_ACCOUNT, formatAccount, type Tx } from '../data'
import { useBank } from '../store'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']
const dayKey = (t: number) => {
  const d = new Date(t)
  return `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, '0')} (${DAYS[d.getDay()]})`
}

export default function BankHistory() {
  const loggedIn = useBank((s) => s.loggedIn)
  const balance = useBank((s) => s.balance)
  const txs = useBank((s) => s.txs)

  useEffect(() => {
    if (loggedIn) emit('bank.history.open')
  }, [loggedIn])

  if (!loggedIn) return <Navigate to="/bank" replace />

  const groups = txs.reduce<Map<string, Tx[]>>((map, tx) => {
    const k = dayKey(tx.at)
    map.set(k, [...(map.get(k) ?? []), tx])
    return map
  }, new Map())

  return (
    <div className="flex h-full flex-col bg-white">
      <AppBar title="거래내역조회" />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <section className="px-5 pt-2 pb-6">
          <p className="text-[15px] text-sub">
            {MY_ACCOUNT.name} · {formatAccount(MY_ACCOUNT.account)}
          </p>
          <p className="mt-1 text-[30px] font-extrabold tabular-nums">{won(balance)}</p>
        </section>
        <button onClick={notReady} className="flex w-full items-center justify-end gap-1 bg-canvas px-5 py-3 text-[15px] font-semibold text-sub">
          1개월 · 전체 · 최신순 <ChevronDown size={18} />
        </button>
        {[...groups].map(([day, list]) => (
          <section key={day} className="px-5 pt-5">
            <p className="pb-1 text-[14px] font-semibold text-faint">{day}</p>
            <ul>
              {list.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[17px] font-semibold">{tx.label}</p>
                    <p className="text-[14px] text-faint tabular-nums">{hhmm(new Date(tx.at))}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`text-[18px] font-bold tabular-nums ${tx.amount > 0 ? 'text-(--brand)' : ''}`}>
                      {tx.amount > 0 ? '+' : '-'}
                      {won(Math.abs(tx.amount))}
                    </p>
                    <p className="text-[14px] text-faint tabular-nums">잔액 {won(tx.balance)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className="py-10 text-center text-[15px] text-faint">최근 1개월 거래내역이에요</p>
      </main>
    </div>
  )
}
