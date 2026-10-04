const pad2 = (n: number) => String(n).padStart(2, '0')
const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export const won = (n: number) => `${n.toLocaleString('ko-KR')}원`

/** 50000 → '5만원', 1234567 → '123만 4,567원' (0이 몇 개인지 헷갈리지 않게 읽어 주는 용도) */
export function koreanWon(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '0원'
  const eok = Math.floor(n / 1e8)
  const man = Math.floor((n % 1e8) / 1e4)
  const rest = n % 1e4
  const parts: string[] = []
  if (eok) parts.push(`${eok.toLocaleString('ko-KR')}억`)
  if (man) parts.push(`${man.toLocaleString('ko-KR')}만`)
  if (rest) parts.push(rest.toLocaleString('ko-KR'))
  return `${parts.join(' ')}원`
}

/** 초 → '02:59' */
export function mmss(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`
}

/** 하루 중 분(0~1439) → '07:05' */
export const clock = (minutes: number) => `${pad2(Math.floor(minutes / 60) % 24)}:${pad2(minutes % 60)}`

export const hhmm = (d: Date) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`

/** 오후 3:12 */
export function ampm(d: Date): string {
  const h = d.getHours()
  return `${h < 12 ? '오전' : '오후'} ${h % 12 === 0 ? 12 : h % 12}:${pad2(d.getMinutes())}`
}

export const dateLabel = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일 (${DAYS[d.getDay()]})`

export const ymd = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

/** 'YYYY-MM-DD' → Date (잘못된 값이면 오늘) */
export function fromYmd(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? new Date() : date
}

export const minutesLabel = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}시간 ${m % 60 ? `${m % 60}분` : ''}`.trim() : `${m}분`)

export const uid = () => Math.random().toString(36).slice(2, 10)

/** 숫자 문자열만 남긴다 */
export const digitsOnly = (s: string) => s.replace(/\D/g, '')
