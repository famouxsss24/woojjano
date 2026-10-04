import { Navigate, useNavigate } from 'react-router'
import { Bell, Gift, House, LayoutGrid, Menu, ShoppingBag, Copy } from 'lucide-react'
import { PRACTICE } from '../../../core/config'
import { won } from '../../../core/format'
import { IconButton } from '../../../core/ui/AppBar'
import { TabBar } from '../../../core/ui/TabBar'
import { notReady, toast } from '../../../core/ui/toast'
import { MY_ACCOUNT, formatAccount } from '../data'
import { useBank } from '../store'
import { BankLogo } from '../ui'

const QUICK_MENU = [
  { emoji: '📋', label: '전체계좌' },
  { emoji: '🧾', label: '공과금' },
  { emoji: '💱', label: '환율' },
  { emoji: '🏠', label: '대출' },
]

export default function BankHome() {
  const loggedIn = useBank((s) => s.loggedIn)
  const balance = useBank((s) => s.balance)
  const navigate = useNavigate()
  if (!loggedIn) return <Navigate to="/bank" replace />

  return (
    <div className="flex h-full flex-col bg-canvas">
      <header className="flex h-14 shrink-0 items-center justify-between pr-1 pl-4">
        <BankLogo />
        <div className="flex">
          <IconButton label="알림" onClick={notReady}>
            <Bell size={24} />
          </IconButton>
          <IconButton label="전체메뉴" onClick={notReady}>
            <Menu size={24} />
          </IconButton>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        <p className="px-1 pt-3 pb-4 text-[21px] font-bold">{PRACTICE.userName}님</p>

        <section className="rounded-3xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[16px] font-semibold">{MY_ACCOUNT.name}</p>
          <button onClick={() => toast('계좌번호를 복사했어요')} className="mt-0.5 inline-flex items-center gap-1 text-[15px] text-sub">
            {MY_ACCOUNT.bank} {formatAccount(MY_ACCOUNT.account)} <Copy size={14} />
          </button>
          <p className="mt-5 text-[30px] font-extrabold tabular-nums">{won(balance)}</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button data-target="bank-history" onClick={() => navigate('/bank/history')} className="h-13 rounded-2xl bg-canvas text-[17px] font-bold">
              조회
            </button>
            <button data-target="bank-transfer" onClick={() => navigate('/bank/transfer')} className="h-13 rounded-2xl bg-(--brand) text-[17px] font-bold text-white">
              이체
            </button>
          </div>
        </section>

        <section className="mt-3 grid grid-cols-4 rounded-3xl bg-white px-2 py-4">
          {QUICK_MENU.map((q) => (
            <button key={q.label} onClick={notReady} className="flex flex-col items-center gap-1.5 rounded-xl py-1 active:bg-black/5">
              <span className="text-[28px]">{q.emoji}</span>
              <span className="text-[14px] font-semibold text-sub">{q.label}</span>
            </button>
          ))}
        </section>

        <section className="mt-3 rounded-3xl bg-(--brand)/10 p-5">
          <p className="text-[15px] font-bold text-(--brand)">알아두세요</p>
          <p className="mt-1 text-[16px] leading-relaxed">은행은 전화나 문자로 비밀번호를 절대 묻지 않아요.</p>
        </section>
      </main>

      <TabBar
        active={0}
        items={[
          { label: '홈', icon: House },
          { label: '상품', icon: ShoppingBag },
          { label: '혜택', icon: Gift },
          { label: '전체', icon: LayoutGrid },
        ]}
      />
    </div>
  )
}
