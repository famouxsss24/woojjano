import { useNavigate } from 'react-router'
import { historyIdx, useJumpBack } from '../nav'
import { resetPhone } from '../phone/phoneStore'
import { resetVerify } from '../flows/verifyStore'
import { missionActions, useMission } from './missionStore'
import type { PracticeModule } from './types'

/**
 * 연습 시작 / 다시 하기: 상태를 비우고 시작 화면으로 보낸다.
 * 다시 하기(restart)는 그동안 쌓인 연습 화면 기록을 걷어내고 시작 화면 자리로 돌아간다.
 */
export function usePracticeStart() {
  const navigate = useNavigate()
  const jumpBack = useJumpBack()
  return (module: PracticeModule, missionId: string | null, restart = false) => {
    const mission = module.missions.find((m) => m.id === missionId)
    const startPath = mission?.startPath ?? module.freePath
    const entryIdx = restart ? useMission.getState().entryIdx : historyIdx()

    module.reset(mission ? mission.id : null)
    resetPhone()
    resetVerify()
    missionActions.start(module.id, mission ? mission.id : null, entryIdx)

    if (restart) jumpBack(entryIdx == null ? null : entryIdx + 1, startPath)
    else navigate(startPath)
  }
}

/** 연습에서 나가기: 이 앱의 미션 목록 또는 첫 화면으로 (연습 화면 기록은 걷어낸다) */
export function useLeavePractice() {
  const jumpBack = useJumpBack()
  return (module: PracticeModule, to: 'missions' | 'home') => {
    const { entryIdx } = useMission.getState()
    missionActions.clearResult()
    if (to === 'missions') jumpBack(entryIdx, `/m/${module.id}`)
    // 미션 목록 바로 앞 칸이 첫 화면이다
    else jumpBack(entryIdx == null ? null : Math.max(0, entryIdx - 1), '/')
  }
}
