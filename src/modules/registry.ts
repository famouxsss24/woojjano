import type { Mission, PracticeModule } from '../core/mission/types'
import { bankModule } from './bank/meta'
import { railModule } from './rail/meta'
import { foodModule } from './food/meta'
import { mapModule } from './map/meta'
import { talkModule } from './talk/meta'
import { musicModule } from './music/meta'

/** 홈 화면에 보이는 순서 그대로. 새 연습 앱은 meta를 만들어 여기에 한 줄 추가하면 된다. */
export const MODULES: PracticeModule[] = [bankModule, railModule, foodModule, mapModule, talkModule, musicModule]

export const findModule = (id: string | null | undefined): PracticeModule | undefined => MODULES.find((m) => m.id === id)

export const findMission = (moduleId: string | null | undefined, missionId: string | null | undefined): Mission | undefined =>
  findModule(moduleId)?.missions.find((m) => m.id === missionId)
