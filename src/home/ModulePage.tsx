import { Navigate, useParams } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { findModule } from '../modules/registry'
import { usePracticeStart } from '../core/mission/usePracticeStart'
import { historyIdx, useJumpBack } from '../core/nav'
import { brandStyle } from '../core/ui/brand'

/** 한 연습 앱의 미션 고르기 */
export default function ModulePage() {
  const { moduleId } = useParams()
  const jumpBack = useJumpBack()
  const start = usePracticeStart()
  const module = findModule(moduleId)
  if (!module) return <Navigate to="/" replace />

  return (
    <div className="h-full overflow-y-auto bg-hub" style={brandStyle(module)}>
      <div className="flex h-14 items-center px-1">
        {/* 바로 앞 칸(첫 화면)으로 되돌아간다 — 기록이 '첫 화면, 첫 화면'으로 겹쳐 쌓이지 않게 */}
        <button aria-label="처음 화면" onClick={() => jumpBack(Math.max(0, (historyIdx() ?? 0) - 1), '/')} className="flex h-11 items-center gap-0.5 rounded-full pr-4 text-[17px] font-semibold active:bg-black/5">
          <ChevronLeft size={28} /> 처음으로
        </button>
      </div>

      <header className="px-6 pt-2 pb-8">
        <div className="flex items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl text-[34px]" style={{ background: `${module.color}1F` }}>
            {module.emoji}
          </span>
          <div>
            <p className="text-[15px] font-bold" style={{ color: module.color }}>
              {module.brand}
            </p>
            <h1 className="text-[28px] font-extrabold">{module.name} 연습</h1>
          </div>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-sub">{module.modeledOn}</p>
      </header>

      <h2 className="px-6 pb-3 text-[18px] font-bold">어떤 걸 해볼까요?</h2>
      <ol className="grid gap-3 px-4">
        {module.missions.map((mission, i) => (
          <li key={mission.id}>
            <button
              onClick={() => start(module, mission.id)}
              className="flex w-full items-center gap-4 rounded-3xl bg-white p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(60,40,20,0.06)] active:scale-[0.98]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-(--brand) text-[18px] font-extrabold text-(--brand-ink)">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[19px] leading-snug font-bold">{mission.title}</span>
                {mission.detail && <span className="mt-0.5 block text-[15px] text-sub">{mission.detail}</span>}
              </span>
              <ChevronRight className="shrink-0 text-faint" size={24} />
            </button>
          </li>
        ))}
      </ol>

      <div className="px-4 pt-3 pb-12">
        <button onClick={() => start(module, null)} className="h-14 w-full rounded-2xl text-[17px] font-bold text-sub active:bg-black/5">
          미션 없이 자유롭게 둘러보기
        </button>
      </div>
    </div>
  )
}
