import type { HintStep, PracticeModule } from '../../core/mission/types'
import { PRACTICE } from '../../core/config'
import { useVerify } from '../../core/flows/verifyStore'
import { usePhone } from '../../core/phone/phoneStore'
import { stationName } from './data'
import { railActions, useRail } from './store'

/** 본인인증 단계별 도움말 (회원가입 화면 + 문자 앱) */
const VERIFY: HintStep[] = [
  { path: '/rail/signup', when: () => useVerify.getState().code == null, text: '빛나는 곳을 차례로 누르세요: 약관 전체 동의 → 통신사 → 전화번호 → [인증번호 받기]', target: 'verify-next' },
  { path: '/rail/signup', when: () => usePhone.getState().bannerId != null, text: '위에 온 문자 알림을 눌러 인증번호를 보세요', target: 'sms-banner' },
  { path: '/rail/signup', when: () => usePhone.getState().shadeOpen, text: '문자 알림을 누르세요', target: 'sms-banner' },
  { path: '/rail/signup', text: '문자로 받은 6자리 숫자를 넣고 [확인]을 누르세요. 숫자를 잊었으면 화면 맨 위를 아래로 쓸어내리세요', target: 'verify-next' },
  { path: '/messages', text: '[ ] 안의 6자리 숫자를 기억하고, 왼쪽 위 ‹ 를 눌러 돌아가세요', target: 'messages-back' },
]

const PAY: HintStep = { path: '/rail/pay', text: `결제 기한 안에 [결제하기]를 누르고, 결제 비밀번호 ${PRACTICE.simplePin} 을 누르세요`, target: ['keypad', 'pay-submit'] }

export const railModule: PracticeModule = {
  id: 'rail',
  name: '기차표',
  brand: 'KW레일',
  emoji: '🚆',
  color: '#0E7C86',
  ink: '#FFFFFF',
  summary: '기차표 예매 · 인증번호 받기 · 승차권 확인',
  modeledOn: '코레일톡의 순서(출발·도착역 → 날짜 → 열차 조회 → 좌석 → 결제 기한 안에 결제)를 그대로 따라 만들었어요. 시각표와 요금은 연습용이에요.',
  basePath: '/rail',
  freePath: '/rail',
  reset: (missionId) => railActions.reset(missionId),
  missions: [
    {
      id: 'book',
      title: '서울 → 대전 기차표 예매하기',
      detail: '어른 1명, 일반실, 결제까지',
      startPath: '/rail',
      completeOn: 'rail.paid',
      check: (p) => (p.from === 'seoul' && p.to === 'daejeon' ? null : `서울에서 대전 가는 표를 예매해야 해요. 이번엔 ${stationName(String(p.from))} → ${stationName(String(p.to))}였어요`),
      steps: [
        { path: '/rail', when: () => useRail.getState().query.from !== 'seoul', text: '출발역을 눌러 [서울]로 바꾸세요', target: 'rail-from' },
        { path: '/rail', when: () => useRail.getState().query.to !== 'daejeon', text: '도착역 [부산]을 눌러 대전으로 바꾸세요', target: 'rail-to' },
        { path: '/rail/station/:which', text: '[대전]을 찾아 누르세요', target: 'station-daejeon' },
        { path: '/rail', text: '[열차 조회하기]를 누르세요', target: 'rail-search' },
        { path: '/rail/trains', when: () => useRail.getState().pending != null, text: '[바로 예매]를 누르세요', target: 'rail-book-auto' },
        { path: '/rail/trains', text: '타고 싶은 시간의 [일반실] 가격을 누르세요', target: 'train-first' },
        { path: '/rail/seats', text: '빈 좌석(흰색)을 하나 누르고 [선택 완료]를 누르세요', target: 'seat-done' },
        PAY,
      ],
    },
    {
      id: 'signup',
      title: '회원가입하기 (인증번호 받기)',
      detail: '문자로 온 인증번호를 3분 안에 넣어요',
      startPath: '/rail',
      completeOn: 'rail.signup.done',
      steps: [
        { path: '/rail', text: '맨 아래 [마이]를 누르세요', target: 'rail-tab-my' },
        { path: '/rail/my', text: '[로그인]을 누르세요', target: 'rail-login' },
        { path: '/rail/login', text: '아래쪽 [회원가입]을 누르세요', target: 'rail-signup' },
        ...VERIFY,
      ],
    },
    {
      id: 'ticket',
      title: '예매한 승차권 확인하기',
      detail: '기차 타기 전에 표를 꺼내 봐요',
      startPath: '/rail',
      completeOn: 'rail.ticket.view',
      steps: [
        { path: '/rail', text: '맨 아래 [승차권 확인]을 누르세요', target: 'rail-tab-tickets' },
        { path: '/rail/tickets', text: '승차권을 누르세요', target: 'rail-ticket-0' },
      ],
    },
  ],
}
