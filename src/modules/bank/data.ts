import { uid } from '../../core/format'

export type Payee = { name: string; relation?: string; bank: string; account: string }
export type Tx = { id: string; at: number; label: string; amount: number; balance: number }

export const MY_ACCOUNT = { name: 'KW 자유입출금통장', bank: 'KW뱅킹', account: '110482375910' }
export const START_BALANCE = 1_250_000

export const RECENT_PAYEES: Payee[] = [
  { name: '김민준', relation: '손주', bank: 'KW뱅킹', account: '110234567890' },
  { name: '김미영', relation: '큰딸', bank: '신한', account: '110512889034' },
  { name: '이순자', relation: '친구', bank: 'NH농협', account: '3020981223141' },
]

export const BANKS = ['KW뱅킹', 'KB국민', '신한', '우리', '하나', 'NH농협', 'IBK기업', '카카오뱅크', '토스뱅크', '우체국', '새마을금고', 'SC제일']

/** 미션 3에서 직접 입력해 보는 연습용 계좌 */
export const NEW_PAYEE: Payee = { name: '박영수', bank: 'NH농협', account: '3511234567891' }

const FAKE_NAMES = ['최정희', '정민호', '강수진', '윤재석', '한미숙']

/** 계좌번호로 받는 분 이름 조회 (연습용 — 계좌번호 숫자에 따라 고정된 가짜 이름) */
export function lookupName(bank: string, account: string): string {
  if (bank === NEW_PAYEE.bank && account === NEW_PAYEE.account) return NEW_PAYEE.name
  const known = RECENT_PAYEES.find((p) => p.bank === bank && p.account === account)
  if (known) return known.name
  const sum = [...account].reduce((a, c) => a + Number(c), 0)
  return FAKE_NAMES[sum % FAKE_NAMES.length]
}

/** 숫자만 있는 계좌번호를 읽기 쉽게 나눈다 */
export function formatAccount(digits: string): string {
  const groups = digits.length === 13 ? [3, 4, 4, 2] : digits.length === 12 ? [3, 3, 6] : digits.length === 14 ? [3, 6, 2, 3] : [4, 4, 4, 4]
  const out: string[] = []
  let i = 0
  for (const g of groups) {
    if (i >= digits.length) break
    out.push(digits.slice(i, i + g))
    i += g
  }
  if (i < digits.length) out.push(digits.slice(i))
  return out.join('-')
}

/** 최근 한 달 거래내역 (오늘 기준으로 날짜를 만든다) */
export function seedTxs(now = Date.now()): Tx[] {
  const DAY = 86_400_000
  const raw: [daysAgo: number, hour: number, label: string, amount: number][] = [
    [0, 9, 'GS25 월계점', -4_800],
    [1, 18, '김미영', 300_000],
    [2, 10, 'KT 통신요금', -33_000],
    [4, 11, '한국전력 전기요금', -41_200],
    [6, 15, '이마트 월계점', -58_700],
    [9, 9, '기초연금', 334_810],
    [12, 10, '아파트 관리비', -152_300],
    [15, 9, '국민연금', 620_000],
  ]
  let balance = START_BALANCE
  return raw.map(([daysAgo, hour, label, amount]) => {
    const d = new Date(now - daysAgo * DAY)
    d.setHours(hour, (daysAgo * 17) % 60, 0, 0)
    const tx = { id: uid(), at: d.getTime(), label, amount, balance }
    balance -= amount
    return tx
  })
}
