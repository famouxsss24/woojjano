export type EventPayload = Record<string, unknown>

/**
 * 도움말 한 단계. 현재 주소가 path와 맞고 when()이 참인 첫 단계가 화면에 뜬다.
 * target은 data-target 값이며, 배열이면 화면에 먼저 있는 것을 가리킨다
 * (예: 바텀시트가 열렸으면 시트 안 버튼, 아니면 시트를 여는 버튼).
 */
export type HintStep = {
  path: string
  when?: () => boolean
  text: string
  target?: string | string[]
}

export type Mission = {
  id: string
  title: string
  detail?: string
  startPath: string
  /** 화면이 emit(event)하면 완료로 본다 */
  completeOn: string
  /** null이면 성공, 문자열이면 '아쉬운 이유' */
  check?: (payload: EventPayload) => string | null
  steps: HintStep[]
}

export type PracticeModule = {
  id: string
  /** 홈 화면에 보이는 연습 이름 (예: 은행) */
  name: string
  /** 앱 안 가상 브랜드 (예: KW뱅킹) */
  brand: string
  emoji: string
  /** 브랜드 색과 그 위 글자색 */
  color: string
  ink: string
  summary: string
  /** 실제 어떤 앱의 흐름을 따랐는지 */
  modeledOn: string
  basePath: string
  freePath: string
  missions: Mission[]
  /** 연습 시작 전 상태 초기화 (미션별 준비 상태 포함) */
  reset: (missionId: string | null) => void
}
