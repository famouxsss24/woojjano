import { clock, dateLabel, fromYmd, minutesLabel, won } from '../../../core/format'
import { CLASS_LABEL, stationName } from '../data'
import type { Reservation } from '../store'

/** 예약·승차권 공통 요약 카드 */
export function TicketSummary({ t }: { t: Pick<Reservation, 'train' | 'cls' | 'query' | 'seats' | 'total'> }) {
  const { train, query } = t
  const pax = [query.adults && `어른 ${query.adults}`, query.seniors && `경로 ${query.seniors}`].filter(Boolean).join(' · ')
  return (
    <div className="rounded-3xl bg-canvas p-5">
      <p className="text-[15px] font-semibold text-sub">{dateLabel(fromYmd(query.date))}</p>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-[24px] font-extrabold">{stationName(query.from)}</p>
          <p className="text-[20px] font-bold tabular-nums">{clock(train.dep)}</p>
        </div>
        <div className="pb-1 text-center text-[13px] text-sub">
          <p className="font-bold text-(--brand)">
            {train.kind} {train.no}
          </p>
          <p>→ {minutesLabel(train.arr - train.dep)} →</p>
        </div>
        <div className="text-right">
          <p className="text-[24px] font-extrabold">{stationName(query.to)}</p>
          <p className="text-[20px] font-bold tabular-nums">{clock(train.arr)}</p>
        </div>
      </div>
      <dl className="mt-5 grid gap-2 text-[16px]">
        <div className="flex justify-between">
          <dt className="text-sub">좌석</dt>
          <dd className="text-right font-semibold">
            {CLASS_LABEL[t.cls]} · {t.seats.join(', ')}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sub">승객</dt>
          <dd className="font-semibold">{pax}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sub">금액</dt>
          <dd className="text-[18px] font-extrabold tabular-nums">{won(t.total)}</dd>
        </div>
      </dl>
    </div>
  )
}
