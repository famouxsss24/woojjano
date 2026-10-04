import { useRef, useState, type ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { MODULES } from '../../modules/registry'
import { missionActions, useActiveMission, useMission } from '../mission/missionStore'
import { useHint, type HintState } from '../mission/useHint'
import { useLeavePractice, usePracticeStart } from '../mission/usePracticeStart'
import type { Mission, PracticeModule } from '../mission/types'
import { PhoneLayer } from '../phone/PhoneLayer'
import { brandStyle } from '../ui/brand'
import { ToastHost } from '../ui/ToastHost'

/**
 * 모든 연습 화면의 틀: 맨 위 '연습용' 띠(앱 밖) + 아래 가짜 앱 화면(앱 안).
 * 띠는 어떤 화면에서도 사라지지 않아 진짜 앱과 헷갈리지 않게 한다.
 */
export default function PracticeShell() {
  const { pathname } = useLocation()
  const viewport = useRef<HTMLDivElement>(null)
  const [leaving, setLeaving] = useState(false)
  const active = useActiveMission()
  const hintOn = useMission((s) => s.hintOn)
  const hasResult = useMission((s) => s.result != null)
  const module = MODULES.find((m) => pathname.startsWith(m.basePath)) ?? active.module
  const mission = module && module.id === active.module?.id ? active.mission : undefined
  const hint = useHint(mission, hintOn)

  if (!module) return <Navigate to="/" replace />

  return (
    <div className="flex h-full flex-col" style={brandStyle(module)}>
      <PracticeBar module={module} mission={mission} hintOn={hintOn} hint={hint} onLeave={() => setLeaving(true)} />
      <div ref={viewport} className="relative min-h-0 flex-1 overflow-hidden bg-white">
        <Outlet />
        <PhoneLayer viewport={viewport} />
        <ToastHost />
        <ResultDialog module={module} mission={mission} />
        {leaving && <LeaveDialog module={module} onClose={() => setLeaving(false)} />}
      </div>
      {/* 창이 떠 있을 때는 도움말 테두리를 숨긴다 (창 위로 비치지 않게) */}
      {hint.rect && !leaving && !hasResult && (
        <div
          aria-hidden
          className="animate-hint pointer-events-none fixed z-[60] rounded-2xl"
          style={{ left: hint.rect.left - 6, top: hint.rect.top - 6, width: hint.rect.width + 12, height: hint.rect.height + 12 }}
        />
      )}
    </div>
  )
}

type BarProps = { module: PracticeModule; mission?: Mission; hintOn: boolean; hint: HintState; onLeave: () => void }

function PracticeBar({ module, mission, hintOn, hint, onLeave }: BarProps) {
  return (
    <header className="shrink-0 bg-ink text-white">
      <div className="flex h-12 items-center gap-2 pr-2 pl-3">
        <span className="shrink-0 rounded-full bg-practice px-2.5 py-0.5 text-[13px] font-extrabold text-ink">연습용</span>
        <p className="min-w-0 flex-1 truncate text-[15px] font-semibold">{mission?.title ?? `${module.brand} 자유 연습`}</p>
        {mission && (
          <button onClick={missionActions.toggleHint} aria-pressed={hintOn} className={`h-9 w-[5.5rem] shrink-0 rounded-lg text-[15px] font-bold ${hintOn ? 'bg-practice text-ink' : 'bg-white/15'}`}>
            {hintOn ? '도움 끄기' : '도움'}
          </button>
        )}
        <button onClick={onLeave} className="h-9 w-[4.5rem] shrink-0 rounded-lg bg-white/15 text-[15px] font-bold">
          나가기
        </button>
      </div>
      {mission && hintOn && (
        <p className="bg-practice px-4 py-3 text-[17px] leading-snug font-bold text-ink">
          {hint.step ? `👉 ${hint.step.text}` : '이 화면은 연습 순서에서 벗어났어요. 왼쪽 위 ‹ 를 눌러 돌아가 보세요.'}
        </p>
      )}
    </header>
  )
}

/** 연습 위에 뜨는 가운데 창 틀 */
function Modal({ children }: { children: ReactNode }) {
  return (
    <div className="animate-fade-in absolute inset-0 z-50 grid place-items-center bg-black/50 px-6">
      <div role="dialog" aria-modal="true" className="animate-pop w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        {children}
      </div>
    </div>
  )
}

/** 다른 미션 / 다른 연습으로 가는 두 갈래 (나가기 창·완료 창 공통) */
function LeaveOptions({ module, onPick }: { module: PracticeModule; onPick?: () => void }) {
  const leave = useLeavePractice()
  const go = (to: 'missions' | 'home') => {
    onPick?.()
    leave(module, to)
  }
  return (
    <div className="grid gap-2">
      <OptionButton title="다른 미션 고르기" sub={`${module.name} 연습 목록으로`} onClick={() => go('missions')} />
      <OptionButton title="다른 연습 고르기" sub="처음 화면으로 (은행·기차표·음식…)" onClick={() => go('home')} />
    </div>
  )
}

function OptionButton({ title, sub, onClick }: { title: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 rounded-2xl bg-canvas px-5 py-3.5 text-left active:bg-black/5">
      <span className="min-w-0 flex-1">
        <span className="block text-[18px] font-bold">{title}</span>
        <span className="block text-[14px] text-sub">{sub}</span>
      </span>
      <ChevronRight size={22} className="shrink-0 text-faint" />
    </button>
  )
}

function LeaveDialog({ module, onClose }: { module: PracticeModule; onClose: () => void }) {
  return (
    <Modal>
      <h2 className="text-[24px] font-extrabold">어디로 갈까요?</h2>
      <p className="mt-1 mb-5 text-[16px] text-sub">하던 연습은 여기서 그만해요</p>
      <LeaveOptions module={module} onPick={onClose} />
      <button onClick={onClose} className="mt-2 h-13 w-full rounded-2xl bg-ink text-[18px] font-bold text-white">
        계속 연습하기
      </button>
    </Modal>
  )
}

function ResultDialog({ module, mission }: { module: PracticeModule; mission?: Mission }) {
  const result = useMission((s) => s.result)
  const start = usePracticeStart()
  if (!result || !mission) return null

  return (
    <Modal>
      <div className="text-center">
        <p className="text-[56px] leading-none">{result.ok ? '🎉' : '🙂'}</p>
        <h2 className="mt-4 text-[26px] font-extrabold">{result.ok ? '잘하셨어요!' : '거의 다 됐어요'}</h2>
        <p className="mt-2 text-[17px] leading-relaxed text-sub">{result.ok ? `「${mission.title}」 성공` : result.reason}</p>
      </div>
      <button onClick={() => start(module, mission.id, true)} className="mt-6 mb-2 h-14 w-full rounded-2xl bg-ink text-[18px] font-bold text-white">
        {result.ok ? '한 번 더 하기' : '처음부터 다시 하기'}
      </button>
      <LeaveOptions module={module} />
      <button onClick={missionActions.clearResult} className="mt-1 h-12 w-full text-[16px] font-semibold text-sub">
        {result.ok ? '이 화면 계속 보기' : '이어서 해보기'}
      </button>
    </Modal>
  )
}
