import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clock, dateLabel, fromYmd, minutesLabel, won, ymd } from '../../../core/format'
import { AppBar } from '../../../core/ui/AppBar'
import { CTA } from '../../../core/ui/CTA'
import { BottomSheet } from '../../../core/ui/Overlays'
import { CLASS_LABEL, fare, findTrains, stationName, type SeatClass, type Train } from '../data'
import { railActions, useRail } from '../store'
import type { LoginState } from '../flow'

export default function RailTrains() {
  const q = useRail((s) => s.query)
  const pending = useRail((s) => s.pending)
  const loggedIn = useRail((s) => s.loggedIn)
  const navigate = useNavigate()

  const trains = useMemo(() => {
    const isToday = q.date === ymd(new Date())
    const now = new Date()
    const nowMin = now.getHours() * 60 + now.getMinutes()
    return findTrains(q.from, q.to, q.date).filter((t) => t.dep >= q.hour * 60 && (!isToday || t.dep > nowMin))
  }, [q.from, q.to, q.date, q.hour])
  const firstOpen = trains.find((t) => !t.soldOut.general)?.id

  const day = fromYmd(q.date)
  const today = ymd(new Date())
  const shiftDay = (delta: number) => {
    const d = new Date(day.getFullYear(), day.getMonth(), day.getDate() + delta)
    if (ymd(d) < today) return
    railActions.setQuery({ date: ymd(d), hour: delta < 0 && ymd(d) === today ? Math.max(5, new Date().getHours()) : 5 })
  }

  const book = () => {
    if (!loggedIn) {
      navigate('/rail/login', { state: { next: 'pay' } satisfies LoginState })
      return
    }
    if (railActions.reserve()) navigate('/rail/pay')
  }

  return (
    <div className="relative flex h-full flex-col bg-canvas">
      <AppBar title={`${stationName(q.from)} → ${stationName(q.to)}`} />
      <div className="flex h-14 shrink-0 items-center justify-between bg-white px-2">
        <button aria-label="전날" disabled={q.date <= today} onClick={() => shiftDay(-1)} className="grid size-11 place-items-center rounded-full disabled:opacity-25">
          <ChevronLeft size={24} />
        </button>
        <p className="text-[17px] font-bold tabular-nums">{dateLabel(day)}</p>
        <button aria-label="다음날" onClick={() => shiftDay(1)} className="grid size-11 place-items-center rounded-full">
          <ChevronRight size={24} />
        </button>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto pt-2 pb-6">
        {trains.length === 0 ? (
          <div className="px-6 pt-20 text-center">
            <p className="text-[19px] font-bold">조회되는 열차가 없어요</p>
            <p className="mt-2 text-[16px] text-sub">다른 날짜나 시간, 역을 골라 보세요</p>
          </div>
        ) : (
          <ul className="grid gap-1.5">
            {trains.map((t) => (
              <li key={t.id} className="flex items-center gap-2 bg-white px-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-(--brand)">
                    {t.kind} {t.no}
                  </p>
                  <p className="text-[21px] font-bold tabular-nums">
                    {clock(t.dep)} → {clock(t.arr)}
                  </p>
                  <p className="text-[14px] text-sub">{minutesLabel(t.arr - t.dep)}</p>
                </div>
                <PriceButton train={t} cls="general" target={t.id === firstOpen ? 'train-first' : undefined} />
                <PriceButton train={t} cls="special" />
              </li>
            ))}
          </ul>
        )}
      </main>

      <BottomSheet open={pending != null} onClose={railActions.clearPending} title="이 열차로 할까요?">
        {pending && (
          <div className="px-5 pb-6">
            <div className="rounded-2xl bg-canvas p-4">
              <p className="text-[15px] font-bold text-(--brand)">
                {pending.train.kind} {pending.train.no} · {CLASS_LABEL[pending.cls]}
              </p>
              <p className="mt-1 text-[20px] font-bold tabular-nums">
                {stationName(pending.query.from)} {clock(pending.train.dep)} → {stationName(pending.query.to)} {clock(pending.train.arr)}
              </p>
              <p className="mt-1 text-[16px] text-sub tabular-nums">
                {pending.query.adults + pending.query.seniors}명 · {won(fare(pending.train.price[pending.cls] ?? 0, pending.query))}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <CTA variant="soft" onClick={() => navigate('/rail/seats')}>
                좌석 선택
              </CTA>
              <CTA target="rail-book-auto" onClick={book}>
                바로 예매
              </CTA>
            </div>
            <p className="mt-3 text-center text-[14px] text-faint">[바로 예매]를 누르면 빈자리를 자동으로 정해 줘요</p>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}

function PriceButton({ train, cls, target }: { train: Train; cls: SeatClass; target?: string }) {
  const price = train.price[cls]
  const soldOut = train.soldOut[cls]
  if (price == null) return <span className="w-[6.25rem] shrink-0" />
  return (
    <button
      data-target={target}
      disabled={soldOut}
      onClick={() => railActions.choose(train, cls)}
      className="flex h-16 w-[6.25rem] shrink-0 flex-col items-center justify-center rounded-xl bg-(--brand)/8 text-(--brand) disabled:bg-gray-100 disabled:text-gray-400"
    >
      <span className="text-[13px] font-semibold">{CLASS_LABEL[cls]}</span>
      <span className="text-[15px] font-bold tabular-nums">{soldOut ? '매진' : won(price)}</span>
    </button>
  )
}
