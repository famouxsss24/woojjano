import { useEffect, useState } from 'react'
import { matchPath, useLocation } from 'react-router'
import type { HintStep, Mission } from './types'

export type HintState = { step: HintStep | null; rect: DOMRect | null }

const EMPTY: HintState = { step: null, rect: null }

const sameRect = (a: DOMRect | null, b: DOMRect | null) =>
  a === b ||
  (!!a && !!b && Math.round(a.x) === Math.round(b.x) && Math.round(a.y) === Math.round(b.y) && Math.round(a.width) === Math.round(b.width) && Math.round(a.height) === Math.round(b.height))

function findTarget(target: HintStep['target']): Element | null {
  if (!target) return null
  for (const t of Array.isArray(target) ? target : [target]) {
    const el = document.querySelector(`[data-target="${CSS.escape(t)}"]`)
    if (el) return el
  }
  return null
}

/**
 * 도움말이 켜져 있으면 매 프레임 '지금 할 일'과 '눌러야 할 곳의 위치'를 계산한다.
 * 화면 상태(시트 열림, 입력값)가 바뀌어도 따로 알리지 않아도 따라간다.
 */
export function useHint(mission: Mission | undefined, enabled: boolean): HintState {
  const { pathname } = useLocation()
  const [state, setState] = useState<HintState>(EMPTY)

  useEffect(() => {
    if (!mission || !enabled) {
      setState(EMPTY)
      return
    }
    let raf = 0
    let scrolledTo: Element | null = null
    const tick = () => {
      const step = mission.steps.find((s) => matchPath({ path: s.path, end: true }, pathname) && (!s.when || s.when())) ?? null
      const el = findTarget(step?.target)
      if (el && el !== scrolledTo) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        scrolledTo = el
      }
      const rect = el ? el.getBoundingClientRect() : null
      setState((prev) => (prev.step === step && sameRect(prev.rect, rect) ? prev : { step, rect }))
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [mission, enabled, pathname])

  return state
}
