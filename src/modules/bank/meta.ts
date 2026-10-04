import type { HintStep, PracticeModule } from '../../core/mission/types'
import { onScreen } from '../../core/mission/dom'
import { PRACTICE } from '../../core/config'
import { koreanWon } from '../../core/format'
import { NEW_PAYEE, formatAccount } from './data'
import { bankActions, useBank } from './store'

const LOGIN: HintStep = { path: '/bank', text: `간편비밀번호 ${PRACTICE.simplePin} 을 차례로 누르세요. 숫자 위치가 섞여 있어요`, target: 'keypad' }
const HOME_TO_TRANSFER: HintStep = { path: '/bank/home', text: '통장 아래 파란 [이체] 버튼을 누르세요', target: 'bank-transfer' }
const CONFIRM: HintStep[] = [
  { path: '/bank/transfer/confirm', when: () => onScreen('phishing-no'), text: '내가 직접 보내는 거라면 [아니요]를 누르세요', target: 'phishing-no' },
  { path: '/bank/transfer/confirm', when: () => onScreen('keypad'), text: `계좌 비밀번호 ${PRACTICE.accountPin} 을 누르세요`, target: 'keypad' },
  { path: '/bank/transfer/confirm', text: '받는 분 이름과 금액을 확인하고 [보내기]를 누르세요', target: 'bank-send' },
]
const NEW_ACCOUNT = formatAccount(NEW_PAYEE.account)

export const bankModule: PracticeModule = {
  id: 'bank',
  name: '은행',
  brand: 'KW뱅킹',
  emoji: '🏦',
  color: '#2F6BFF',
  ink: '#FFFFFF',
  summary: '잔액 보기 · 거래내역 · 돈 보내기',
  modeledOn: '여러 은행 앱에 공통인 순서(간편비밀번호 로그인 → 이체 → 금액 → 확인 → 계좌 비밀번호)를 그대로 따라 만들었어요.',
  basePath: '/bank',
  freePath: '/bank',
  reset: () => bankActions.reset(),
  missions: [
    {
      id: 'history',
      title: '거래내역 보기',
      detail: '이번 달에 들어오고 나간 돈을 확인해요',
      startPath: '/bank',
      completeOn: 'bank.history.open',
      steps: [LOGIN, { path: '/bank/home', text: '통장 아래 [조회] 버튼을 누르세요', target: 'bank-history' }],
    },
    {
      id: 'send-grandson',
      title: '손주에게 5만원 보내기',
      detail: '최근 보낸 분 목록에서 김민준(손주)을 골라요',
      startPath: '/bank',
      completeOn: 'bank.transfer.done',
      check: (p) => (p.name !== '김민준' ? '손주 김민준에게 보내야 해요' : p.amount !== 50_000 ? `5만원을 보내야 해요. 이번엔 ${koreanWon(Number(p.amount))}을 보냈어요` : null),
      steps: [
        LOGIN,
        HOME_TO_TRANSFER,
        { path: '/bank/transfer', text: "'최근 보낸 분'에서 김민준(손주)을 누르세요", target: 'recent-김민준' },
        { path: '/bank/transfer/amount', when: () => useBank.getState().draft.amount === 50_000, text: '5만원이 맞으면 [다음]을 누르세요', target: 'amount-next' },
        { path: '/bank/transfer/amount', text: '[+5만] 버튼을 한 번 누르세요. 숫자를 직접 눌러도 돼요', target: 'quick-50000' },
        ...CONFIRM,
      ],
    },
    {
      id: 'send-new',
      title: '처음 보내는 계좌로 3만원 보내기',
      detail: `${NEW_PAYEE.bank} ${NEW_ACCOUNT} (${NEW_PAYEE.name})`,
      startPath: '/bank',
      completeOn: 'bank.transfer.done',
      check: (p) =>
        !p.isNew
          ? '은행을 고르고 계좌번호를 직접 입력해 보세요'
          : p.bank !== NEW_PAYEE.bank || p.account !== NEW_PAYEE.account
            ? `계좌를 다시 확인해 주세요: ${NEW_PAYEE.bank} ${NEW_ACCOUNT}`
            : p.amount !== 30_000
              ? `3만원을 보내야 해요. 이번엔 ${koreanWon(Number(p.amount))}을 보냈어요`
              : null,
      steps: [
        LOGIN,
        HOME_TO_TRANSFER,
        { path: '/bank/transfer', when: () => useBank.getState().form.bank !== NEW_PAYEE.bank, text: `[은행 선택]을 누르고 ${NEW_PAYEE.bank}을 고르세요`, target: [`bank-opt-${NEW_PAYEE.bank}`, 'bank-select'] },
        { path: '/bank/transfer', when: () => useBank.getState().form.account !== NEW_PAYEE.account, text: `계좌번호 칸에 ${NEW_PAYEE.account} 를 입력하세요`, target: 'account-input' },
        { path: '/bank/transfer', text: '[다음]을 누르세요', target: 'transfer-next' },
        { path: '/bank/transfer/amount', when: () => useBank.getState().draft.amount === 30_000, text: '3만원이 맞으면 [다음]을 누르세요', target: 'amount-next' },
        { path: '/bank/transfer/amount', text: '숫자 3, 0, 0, 0, 0 을 누르세요', target: 'numpad' },
        ...CONFIRM,
      ],
    },
  ],
}
