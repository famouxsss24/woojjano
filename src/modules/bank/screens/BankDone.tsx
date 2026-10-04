import { Navigate, useNavigate } from 'react-router'
import { CircleCheck } from 'lucide-react'
import { won } from '../../../core/format'
import { BottomBar, CTA } from '../../../core/ui/CTA'
import { useBank } from '../store'

export default function BankDone() {
  const last = useBank((s) => s.last)
  const navigate = useNavigate()
  if (!last) return <Navigate to="/bank/home" replace />

  return (
    <div className="flex h-full flex-col bg-white">
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <CircleCheck size={72} className="text-(--brand)" strokeWidth={1.8} />
        <h2 className="mt-6 text-[26px] leading-snug font-bold">
          {last.payee.name}님에게
          <br />
          <span className="tabular-nums">{won(last.amount)}</span>을 보냈어요
        </h2>
        <p className="mt-4 text-[17px] text-sub tabular-nums">남은 돈 {won(last.balance)}</p>
      </main>
      <BottomBar>
        <CTA onClick={() => navigate('/bank/home', { replace: true })}>확인</CTA>
      </BottomBar>
    </div>
  )
}
