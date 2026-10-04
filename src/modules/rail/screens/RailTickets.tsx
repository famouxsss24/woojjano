import { useNavigate } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { clock, dateLabel, fromYmd } from '../../../core/format'
import { stationName } from '../data'
import { useRail } from '../store'
import { RailHeader, RailTabs } from '../ui'

export default function RailTickets() {
  const tickets = useRail((s) => s.tickets)
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col bg-canvas">
      <RailHeader title="승차권 확인" />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {tickets.length === 0 ? (
          <div className="pt-24 text-center">
            <p className="text-[19px] font-bold">예매한 승차권이 없어요</p>
            <p className="mt-2 text-[16px] text-sub">[승차권 예매]에서 표를 사면 여기에 나와요</p>
          </div>
        ) : (
          <ul className="grid gap-3">
            {tickets.map((t, i) => (
              <li key={t.id}>
                <button
                  data-target={`rail-ticket-${i}`}
                  onClick={() => navigate(`/rail/ticket/${t.id}`)}
                  className="flex w-full items-center gap-3 rounded-3xl bg-white p-5 text-left shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-sub">{dateLabel(fromYmd(t.query.date))}</p>
                    <p className="mt-1 text-[22px] font-extrabold">
                      {stationName(t.query.from)} → {stationName(t.query.to)}
                    </p>
                    <p className="text-[16px] text-sub tabular-nums">
                      {clock(t.train.dep)} 출발 · {t.train.kind} {t.train.no}
                    </p>
                  </div>
                  <ChevronRight className="shrink-0 text-faint" size={24} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
      <RailTabs active="tickets" />
    </div>
  )
}
