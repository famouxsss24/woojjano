import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeftRight, ChevronRight, Minus, Plus } from 'lucide-react'
import { dateLabel, fromYmd, ymd } from '../../../core/format'
import { CTA } from '../../../core/ui/CTA'
import { BottomSheet } from '../../../core/ui/Overlays'
import { notReady } from '../../../core/ui/toast'
import { stationName } from '../data'
import { railActions, useRail } from '../store'
import { RailHeader, RailTabs } from '../ui'

const DAYS_AHEAD = 14
const HOURS = Array.from({ length: 18 }, (_, i) => i + 5) // 05~22시
const MAX_PAX = 9

export default function RailHome() {
  const q = useRail((s) => s.query)
  const navigate = useNavigate()
  const [sheet, setSheet] = useState<'date' | 'pax' | null>(null)

  const pax = q.adults + q.seniors
  const paxLabel = [q.adults && `어른 ${q.adults}명`, q.seniors && `경로 ${q.seniors}명`].filter(Boolean).join(', ')
  const today = new Date()
  const dates = Array.from({ length: DAYS_AHEAD }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i))

  return (
    <div className="relative flex h-full flex-col bg-canvas">
      <RailHeader />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="h-16 bg-(--brand)" />
        <section className="-mt-14 mx-4 rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-2 rounded-xl bg-canvas p-1 text-[16px] font-bold">
            <span className="rounded-lg bg-white py-2 text-center shadow-sm">편도</span>
            <button onClick={notReady} className="py-2 text-faint">
              왕복
            </button>
          </div>

          <div className="mt-5 flex items-center">
            <button data-target="rail-from" onClick={() => navigate('/rail/station/from')} className="flex-1 rounded-2xl py-2 active:bg-black/5">
              <p className="text-[14px] font-semibold text-sub">출발</p>
              <p className="text-[32px] font-extrabold">{stationName(q.from)}</p>
            </button>
            <button aria-label="출발역 도착역 바꾸기" onClick={railActions.swap} className="grid size-11 shrink-0 place-items-center rounded-full bg-canvas text-(--brand)">
              <ArrowLeftRight size={20} />
            </button>
            <button data-target="rail-to" onClick={() => navigate('/rail/station/to')} className="flex-1 rounded-2xl py-2 active:bg-black/5">
              <p className="text-[14px] font-semibold text-sub">도착</p>
              <p className="text-[32px] font-extrabold">{stationName(q.to)}</p>
            </button>
          </div>

          <div className="mt-4 grid gap-1">
            <Row target="rail-date" label="출발일" value={`${dateLabel(fromYmd(q.date))} ${q.hour}시 이후`} onClick={() => setSheet('date')} />
            <Row target="rail-pax" label="승객" value={paxLabel} onClick={() => setSheet('pax')} />
          </div>

          <CTA target="rail-search" className="mt-5" onClick={() => navigate('/rail/trains')}>
            열차 조회하기
          </CTA>
        </section>
        <p className="px-6 py-6 text-[15px] leading-relaxed text-sub">시각표와 요금은 연습용이에요. 실제 열차는 코레일톡에서 확인하세요.</p>
      </main>
      <RailTabs active="book" />

      <BottomSheet open={sheet === 'date'} onClose={() => setSheet(null)} title="언제 출발하세요?">
        <div className="px-5 pb-6">
          <div className="grid grid-cols-7 gap-1.5">
            {dates.map((d) => {
              const v = ymd(d)
              const on = v === q.date
              return (
                <button
                  key={v}
                  onClick={() => railActions.setQuery({ date: v })}
                  className={`flex h-16 flex-col items-center justify-center rounded-xl ${on ? 'bg-(--brand) text-white' : 'bg-canvas'} ${d.getDay() === 0 && !on ? 'text-red-500' : ''}`}
                >
                  <span className="text-[12px] font-semibold opacity-70">{'일월화수목금토'[d.getDay()]}</span>
                  <span className="text-[18px] font-bold tabular-nums">{d.getDate()}</span>
                </button>
              )
            })}
          </div>
          <p className="mt-6 mb-2 text-[15px] font-semibold text-sub">몇 시 이후 열차를 볼까요?</p>
          <div className="grid grid-cols-6 gap-1.5">
            {HOURS.map((h) => (
              <button key={h} onClick={() => railActions.setQuery({ hour: h })} className={`h-12 rounded-xl text-[16px] font-bold tabular-nums ${h === q.hour ? 'bg-(--brand) text-white' : 'bg-canvas'}`}>
                {h}시
              </button>
            ))}
          </div>
          <CTA className="mt-6" onClick={() => setSheet(null)}>
            선택 완료
          </CTA>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === 'pax'} onClose={() => setSheet(null)} title="몇 분이 타세요?">
        <div className="px-5 pb-6">
          <Stepper label="어른" sub="만 13세 이상" value={q.adults} min={q.seniors > 0 ? 0 : 1} max={MAX_PAX - q.seniors} onChange={(adults) => railActions.setQuery({ adults })} />
          <Stepper label="경로" sub="만 65세 이상 · 할인" value={q.seniors} min={q.adults > 0 ? 0 : 1} max={MAX_PAX - q.adults} onChange={(seniors) => railActions.setQuery({ seniors })} />
          <p className="mt-2 text-[14px] text-faint">총 {pax}명 · 할인율은 연습용 예시예요</p>
          <CTA className="mt-6" onClick={() => setSheet(null)}>
            선택 완료
          </CTA>
        </div>
      </BottomSheet>
    </div>
  )
}

function Row({ label, value, onClick, target }: { label: string; value: string; onClick: () => void; target: string }) {
  return (
    <button data-target={target} onClick={onClick} className="flex h-14 items-center gap-3 rounded-xl px-1 text-left active:bg-black/5">
      <span className="w-14 shrink-0 text-[15px] font-semibold text-sub">{label}</span>
      <span className="min-w-0 flex-1 truncate text-[18px] font-bold">{value}</span>
      <ChevronRight className="shrink-0 text-faint" size={22} />
    </button>
  )
}

function Stepper({ label, sub, value, min, max, onChange }: { label: string; sub: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center py-3">
      <div className="flex-1">
        <p className="text-[18px] font-bold">{label}</p>
        <p className="text-[14px] text-sub">{sub}</p>
      </div>
      <button aria-label={`${label} 빼기`} disabled={value <= min} onClick={() => onChange(value - 1)} className="grid size-11 place-items-center rounded-full bg-canvas disabled:opacity-30">
        <Minus size={20} />
      </button>
      <span className="w-10 text-center text-[20px] font-bold tabular-nums">{value}</span>
      <button aria-label={`${label} 더하기`} disabled={value >= max} onClick={() => onChange(value + 1)} className="grid size-11 place-items-center rounded-full bg-canvas disabled:opacity-30">
        <Plus size={20} />
      </button>
    </div>
  )
}
