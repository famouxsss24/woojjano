import { Fragment, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { AppBar } from '../../../core/ui/AppBar'
import { BottomBar, CTA } from '../../../core/ui/CTA'
import { toast } from '../../../core/ui/toast'
import { CARS, CLASS_LABEL, SEAT_COLS, SEAT_ROWS, seatLabel, takenSeats } from '../data'
import { railActions, useRail } from '../store'
import type { LoginState } from '../flow'

export default function RailSeats() {
  const pending = useRail((s) => s.pending)
  const loggedIn = useRail((s) => s.loggedIn)
  const navigate = useNavigate()
  const cars = pending ? CARS[pending.cls] : []
  const [car, setCar] = useState(cars[0] ?? 1)
  const [picked, setPicked] = useState<string[]>([])
  const taken = useMemo(() => (pending ? takenSeats(pending.train.id, car) : new Set<string>()), [pending, car])
  if (!pending) return <Navigate to="/rail/trains" replace />

  const need = pending.query.adults + pending.query.seniors

  const toggle = (seat: string) => {
    const label = seatLabel(car, seat)
    if (picked.includes(label)) return setPicked(picked.filter((p) => p !== label))
    if (picked.length >= need) return toast(`${need}명이라 ${need}자리까지 고를 수 있어요`)
    setPicked([...picked, label])
  }

  const done = () => {
    railActions.setSeats(picked)
    if (!loggedIn) return navigate('/rail/login', { state: { next: 'pay' } satisfies LoginState })
    if (railActions.reserve()) navigate('/rail/pay')
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <AppBar title={`좌석 선택 · ${CLASS_LABEL[pending.cls]}`} />
      <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-4 pb-3">
        {cars.map((c) => (
          <button key={c} onClick={() => setCar(c)} className={`h-11 shrink-0 rounded-full px-5 text-[16px] font-bold ${c === car ? 'bg-ink text-white' : 'bg-canvas'}`}>
            {c}호차
          </button>
        ))}
      </div>
      <div className="flex shrink-0 justify-center gap-5 pb-2 text-[14px] text-sub">
        <Legend className="bg-white shadow-[inset_0_0_0_1.5px_#d1d5db]" label="빈 좌석" />
        <Legend className="bg-(--brand)" label="고른 좌석" />
        <Legend className="bg-gray-200" label="이미 팔림" />
      </div>
      <main className="min-h-0 flex-1 overflow-y-auto bg-canvas px-8 py-5">
        <p className="pb-3 text-center text-[13px] font-semibold text-faint">▲ 열차 앞쪽</p>
        <div className="mx-auto grid max-w-xs grid-cols-[1fr_1fr_1.2rem_1fr_1fr] gap-2">
          {Array.from({ length: SEAT_ROWS }, (_, i) => i + 1).map((row) =>
            SEAT_COLS.map((col, ci) => {
              const seat = `${row}${col}`
              const isTaken = taken.has(seat)
              const isPicked = picked.includes(seatLabel(car, seat))
              return (
                <Fragment key={seat}>
                  {ci === 2 && <span className="grid place-items-center text-[12px] text-faint tabular-nums">{row}</span>}
                  <button
                    disabled={isTaken}
                    onClick={() => toggle(seat)}
                    className={`h-11 rounded-lg text-[14px] font-bold tabular-nums ${
                      isPicked ? 'bg-(--brand) text-white' : isTaken ? 'bg-gray-200 text-gray-400' : 'bg-white shadow-[inset_0_0_0_1.5px_#d1d5db]'
                    }`}
                  >
                    {seat}
                  </button>
                </Fragment>
              )
            }),
          )}
        </div>
      </main>
      <BottomBar>
        <p className="mb-2 truncate text-center text-[15px] text-sub">{picked.length ? picked.join(', ') : `${need}자리를 골라 주세요`}</p>
        <CTA target="seat-done" disabled={picked.length !== need} onClick={done}>
          선택 완료 ({picked.length}/{need})
        </CTA>
      </BottomBar>
    </div>
  )
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-4 rounded ${className}`} />
      {label}
    </span>
  )
}
