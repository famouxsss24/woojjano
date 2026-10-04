import { Navigate, useNavigate } from 'react-router'
import { Check } from 'lucide-react'
import { ampm, won } from '../../../core/format'
import { useNow } from '../../../core/useNow'
import { AppBar } from '../../../core/ui/AppBar'
import { BottomBar, CTA } from '../../../core/ui/CTA'
import { useFood } from '../store'

/** 연습이라 실제보다 빠르게 진행된다 (단계별 시작 시각, 초) */
const STAGES = [
  { at: 0, label: '주문 접수', desc: '가게에서 주문을 확인했어요' },
  { at: 6, label: '조리 중', desc: '맛있게 만들고 있어요' },
  { at: 14, label: '배달 중', desc: '배달 기사님이 출발했어요' },
  { at: 24, label: '배달 완료', desc: '맛있게 드세요!' },
]
const ETA_MIN = 35

export default function FoodStatus() {
  const order = useFood((s) => s.order)
  const navigate = useNavigate()
  const now = useNow(1000, order != null)
  if (!order) return <Navigate to="/food" replace />

  const elapsed = (now - order.placedAt) / 1000
  const stage = STAGES.reduce((cur, s, i) => (elapsed >= s.at ? i : cur), 0)
  const done = stage === STAGES.length - 1

  return (
    <div className="flex h-full flex-col bg-white">
      <AppBar title="주문 현황" onBack={() => navigate('/food', { replace: true })} />
      <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        <div className="rounded-3xl bg-(--brand)/8 p-6 text-center">
          <p className="text-[56px] leading-none">{done ? '😋' : stage >= 2 ? '🛵' : '🍳'}</p>
          <p className="mt-3 text-[24px] font-extrabold">{STAGES[stage].label}</p>
          <p className="mt-1 text-[16px] text-sub">{STAGES[stage].desc}</p>
          {!done && <p className="mt-3 text-[16px] font-semibold tabular-nums">도착 예정 {ampm(new Date(order.placedAt + ETA_MIN * 60_000))}</p>}
        </div>

        <ol className="mt-6 grid gap-4 px-1">
          {STAGES.map((s, i) => (
            <li key={s.label} className="flex items-center gap-3">
              <span className={`grid size-8 shrink-0 place-items-center rounded-full ${i <= stage ? 'bg-(--brand) text-white' : 'bg-canvas text-faint'}`}>
                {i < stage ? <Check size={18} strokeWidth={3} /> : <span className="text-[14px] font-bold">{i + 1}</span>}
              </span>
              <span className={`text-[18px] ${i === stage ? 'font-extrabold' : i < stage ? 'font-semibold' : 'text-faint'}`}>{s.label}</span>
            </li>
          ))}
        </ol>

        <section className="mt-8 rounded-2xl bg-canvas p-4 text-[16px]">
          <p className="font-bold">{order.shopName}</p>
          <p className="mt-1 text-sub">{order.address}</p>
          <p className="mt-1 font-semibold tabular-nums">결제 {won(order.total)} (연습용 — 실제로 나가지 않았어요)</p>
        </section>
      </main>
      <BottomBar>
        <CTA variant="soft" onClick={() => navigate('/food', { replace: true })}>
          홈으로
        </CTA>
      </BottomBar>
    </div>
  )
}
