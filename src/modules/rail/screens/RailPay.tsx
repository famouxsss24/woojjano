import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { emit } from '../../../core/mission/missionStore'
import { PayCheckout, PayMethodList, type PayMethodId } from '../../../core/flows/Payment'
import { mmss } from '../../../core/format'
import { useCountdown } from '../../../core/useNow'
import { AppBar } from '../../../core/ui/AppBar'
import { Dialog } from '../../../core/ui/Overlays'
import { toast } from '../../../core/ui/toast'
import { railActions, useRail } from '../store'
import { TicketSummary } from './TicketSummary'

export default function RailPay() {
  const reservation = useRail((s) => s.reservation)
  const lastTicketId = useRail((s) => s.tickets[0]?.id)
  const navigate = useNavigate()
  const [method, setMethod] = useState<PayMethodId>('kwpay')
  const { left, expired } = useCountdown(reservation?.deadline ?? null)
  // 결제 직후엔 예약이 비므로 방금 나온 승차권으로 보낸다 (처음 화면으로 튕기는 경합 방지)
  if (!reservation) return <Navigate to={lastTicketId ? `/rail/ticket/${lastTicketId}` : '/rail'} replace />

  const paid = () => {
    const ticket = railActions.pay()
    if (!ticket) return toast('결제 기한이 지났어요')
    navigate(`/rail/ticket/${ticket.id}`, { replace: true })
    emit('rail.paid', { from: ticket.query.from, to: ticket.query.to })
  }

  return (
    <div className="relative flex h-full flex-col bg-white">
      <AppBar title="결제하기" />
      <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        <div className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3">
          <div>
            <p className="text-[16px] font-bold text-red-600">결제 기한</p>
            <p className="text-[14px] text-red-500">시간 안에 결제하지 않으면 예약이 취소돼요</p>
          </div>
          <p className="w-[5ch] shrink-0 text-right text-[26px] font-extrabold text-red-600 tabular-nums">{mmss(left)}</p>
        </div>

        <div className="mt-5">
          <TicketSummary t={reservation} />
        </div>

        <p className="mt-8 mb-3 text-[18px] font-bold">결제 수단</p>
        <PayMethodList value={method} onChange={setMethod} />
      </main>

      <PayCheckout amount={reservation.total} disabled={expired} onPaid={paid} />

      <Dialog
        open={expired}
        title="결제 기한이 지났어요"
        actions={[
          {
            label: '다시 조회하기',
            primary: true,
            onClick: () => {
              railActions.cancelReservation()
              navigate('/rail/trains', { replace: true })
            },
          },
        ]}
      >
        예약이 취소됐어요. 실제 앱에서도 시간이 지나면 처음부터 다시 예매해야 해요.
      </Dialog>
    </div>
  )
}
