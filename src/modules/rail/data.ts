/**
 * 연습용 열차 데이터. 소요 시간은 실제 KTX와 비슷하게 맞췄지만 시각표·요금은 연습용이다.
 * pos = 서울에서부터 걸리는 분(노선별). 같은 노선에 있는 두 역만 열차가 다닌다.
 */
type Line = 'gb' | 'hn' | 'jl' | 'gn'

export type Station = { id: string; name: string; pos: Partial<Record<Line, number>> }

export const STATIONS: Station[] = [
  { id: 'seoul', name: '서울', pos: { gb: 0, hn: 0, jl: 0, gn: 0 } },
  { id: 'yongsan', name: '용산', pos: { hn: 5, jl: 5 } },
  { id: 'cheongnyangni', name: '청량리', pos: { gn: 14 } },
  { id: 'gwangmyeong', name: '광명', pos: { gb: 18, hn: 18, jl: 18 } },
  { id: 'cheonanasan', name: '천안아산', pos: { gb: 40, hn: 40, jl: 40 } },
  { id: 'osong', name: '오송', pos: { gb: 52, hn: 52, jl: 52 } },
  { id: 'daejeon', name: '대전', pos: { gb: 63 } },
  { id: 'gimcheon', name: '김천구미', pos: { gb: 96 } },
  { id: 'dongdaegu', name: '동대구', pos: { gb: 112 } },
  { id: 'gyeongju', name: '신경주', pos: { gb: 133 } },
  { id: 'ulsan', name: '울산', pos: { gb: 145 } },
  { id: 'busan', name: '부산', pos: { gb: 160 } },
  { id: 'iksan', name: '익산', pos: { hn: 88, jl: 88 } },
  { id: 'gwangju', name: '광주송정', pos: { hn: 110 } },
  { id: 'mokpo', name: '목포', pos: { hn: 140 } },
  { id: 'jeonju', name: '전주', pos: { jl: 106 } },
  { id: 'suncheon', name: '순천', pos: { jl: 160 } },
  { id: 'yeosu', name: '여수EXPO', pos: { jl: 178 } },
  { id: 'pyeongchang', name: '평창', pos: { gn: 80 } },
  { id: 'gangneung', name: '강릉', pos: { gn: 112 } },
]

export const stationName = (id: string) => STATIONS.find((s) => s.id === id)?.name ?? '선택'

export type SeatClass = 'general' | 'special'
export const CLASS_LABEL: Record<SeatClass, string> = { general: '일반실', special: '특실' }

export type Train = {
  id: string
  kind: 'KTX' | 'ITX-새마을'
  no: number
  /** 하루 중 분 */
  dep: number
  arr: number
  price: Record<SeatClass, number | null>
  soldOut: Record<SeatClass, boolean>
}

/** 문자열 → 32비트 시드 */
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

/** 같은 시드면 항상 같은 난수열 (날짜·구간마다 매진 좌석이 바뀌지 않게) */
function rng(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const round100 = (n: number) => Math.round(n / 100) * 100
const LINE_NO: Record<Line, number> = { gb: 101, hn: 401, jl: 501, gn: 801 }
const FIRST_DEP = 5 * 60 + 10
const LAST_DEP = 22 * 60

export function findTrains(fromId: string, toId: string, date: string): Train[] {
  const a = STATIONS.find((s) => s.id === fromId)
  const b = STATIONS.find((s) => s.id === toId)
  if (!a || !b || a.id === b.id) return []
  const line = (Object.keys(a.pos) as Line[]).find((l) => b.pos[l] !== undefined)
  if (!line) return []

  const ktxMin = Math.abs(a.pos[line]! - b.pos[line]!)
  const base = round100(ktxMin * 340 + 4700)
  const rand = rng(hash(`${date}|${fromId}|${toId}`))
  const trains: Train[] = []
  let dep = FIRST_DEP + Math.floor(rand() * 20)
  for (let i = 0; dep <= LAST_DEP; i++) {
    const itx = line !== 'gn' && i % 4 === 3
    const minutes = itx ? Math.round(ktxMin * 1.6) : ktxMin
    const arr = dep + minutes
    if (arr < 24 * 60) {
      trains.push({
        id: `${date}-${fromId}-${toId}-${i}`,
        kind: itx ? 'ITX-새마을' : 'KTX',
        no: itx ? 1001 + i * 2 : LINE_NO[line] + i * 2,
        dep,
        arr,
        price: { general: itx ? round100(base * 0.6) : base, special: itx ? null : round100(base * 1.4) },
        soldOut: { general: rand() < 0.18, special: rand() < 0.3 },
      })
    }
    dep += 30 + Math.floor(rand() * 4) * 10
  }
  return trains
}

/** 경로 할인 (연습용 예시 — 실제 할인율은 요일·열차마다 다르다) */
export const SENIOR_RATE = 0.7

export const fare = (unit: number, pax: { adults: number; seniors: number }) => pax.adults * unit + pax.seniors * round100(unit * SENIOR_RATE)

export const CARS: Record<SeatClass, number[]> = { general: [1, 2, 5, 6, 7, 8], special: [3, 4] }
export const SEAT_ROWS = 14
export const SEAT_COLS = ['A', 'B', 'C', 'D'] as const

/** 호차마다 이미 팔린 좌석 */
export function takenSeats(trainId: string, car: number): Set<string> {
  const rand = rng(hash(`${trainId}#${car}`))
  const set = new Set<string>()
  for (let r = 1; r <= SEAT_ROWS; r++) for (const c of SEAT_COLS) if (rand() < 0.45) set.add(`${r}${c}`)
  return set
}

export const seatLabel = (car: number, seat: string) => `${car}호차 ${seat}`

/** 자동 배정: 앞쪽 호차부터 빈자리 */
export function autoSeats(train: Train, cls: SeatClass, count: number): string[] {
  const out: string[] = []
  for (const car of CARS[cls]) {
    const taken = takenSeats(train.id, car)
    for (let r = 1; r <= SEAT_ROWS && out.length < count; r++)
      for (const c of SEAT_COLS) {
        if (out.length >= count) break
        if (!taken.has(`${r}${c}`)) out.push(seatLabel(car, `${r}${c}`))
      }
    if (out.length >= count) break
  }
  return out
}
