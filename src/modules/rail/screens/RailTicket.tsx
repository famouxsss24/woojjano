import { useEffect, useMemo } from 'react'
import { Navigate, useParams } from 'react-router'
import { emit } from '../../../core/mission/missionStore'
import { AppBar } from '../../../core/ui/AppBar'
import { useRail } from '../store'
import { TicketSummary } from './TicketSummary'

const QR_SIZE = 21

/** 승차권 QR 자리 (실제 QR이 아닌 무늬) */
function FakeQr({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let h = 0
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
    return Array.from({ length: QR_SIZE * QR_SIZE }, (_, i) => {
      h = (h * 1103515245 + 12345) >>> 0
      const x = i % QR_SIZE
      const y = Math.floor(i / QR_SIZE)
      const finder = (x < 7 && y < 7) || (x >= QR_SIZE - 7 && y < 7) || (x < 7 && y >= QR_SIZE - 7)
      if (finder) {
        const fx = x >= QR_SIZE - 7 ? x - (QR_SIZE - 7) : x
        const fy = y >= QR_SIZE - 7 ? y - (QR_SIZE - 7) : y
        return fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4)
      }
      return (h >>> 16) % 2 === 0
    })
  }, [seed])
  return (
    <div className="grid size-44 gap-0" style={{ gridTemplateColumns: `repeat(${QR_SIZE}, 1fr)` }} aria-label="승차권 QR (연습용)">
      {cells.map((on, i) => (
        <span key={i} className={on ? 'bg-ink' : ''} />
      ))}
    </div>
  )
}

export default function RailTicket() {
  const { id } = useParams()
  const ticket = useRail((s) => s.tickets.find((t) => t.id === id))

  useEffect(() => {
    if (ticket) emit('rail.ticket.view', { id: ticket.id })
  }, [ticket])

  if (!ticket) return <Navigate to="/rail/tickets" replace />

  return (
    <div className="flex h-full flex-col bg-(--brand)">
      <AppBar title="승차권" tone="brand" />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
        <div className="rounded-3xl bg-white p-4">
          <div className="flex flex-col items-center py-4">
            <FakeQr seed={ticket.id} />
            <p className="mt-3 text-[14px] text-sub">개찰구가 없는 역이 많아요. 승무원이 확인할 때 이 화면을 보여 주세요</p>
          </div>
          <TicketSummary t={ticket} />
        </div>
      </main>
    </div>
  )
}
