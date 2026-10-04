import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sessionJSON } from '../persist'
import { findMission, findModule } from '../../modules/registry'
import type { EventPayload } from './types'

export type MissionResult = { ok: true } | { ok: false; reason: string }

type MissionState = {
  moduleId: string | null
  missionId: string | null
  hintOn: boolean
  result: MissionResult | null
  /** 연습을 시작한 화면(미션 목록)의 방문 기록 순번 — 나가기·다시하기 때 여기까지 되돌아간다 */
  entryIdx: number | null
}

export const useMission = create<MissionState>()(
  persist((): MissionState => ({ moduleId: null, missionId: null, hintOn: false, result: null, entryIdx: null }), {
    name: 'wz.mission',
    storage: sessionJSON,
  }),
)

export const missionActions = {
  start: (moduleId: string, missionId: string | null, entryIdx: number | null) => useMission.setState({ moduleId, missionId, hintOn: false, result: null, entryIdx }),
  toggleHint: () => useMission.setState((s) => ({ hintOn: !s.hintOn })),
  clearResult: () => useMission.setState({ result: null }),
}

/**
 * 화면이 '어떤 행동이 끝났다'를 알린다. 화면은 미션을 몰라도 되고,
 * 진행 중인 미션의 완료 조건과 맞을 때만 결과 창이 뜬다.
 */
export function emit(event: string, payload: EventPayload = {}) {
  const { moduleId, missionId, result } = useMission.getState()
  if (result) return
  const mission = findMission(moduleId, missionId)
  if (!mission || mission.completeOn !== event) return
  const reason = mission.check?.(payload) ?? null
  useMission.setState({ result: reason ? { ok: false, reason } : { ok: true } })
}

export function useActiveMission() {
  const moduleId = useMission((s) => s.moduleId)
  const missionId = useMission((s) => s.missionId)
  return { module: findModule(moduleId), mission: findMission(moduleId, missionId) }
}
