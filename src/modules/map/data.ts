import { PRACTICE } from '../../core/config'

/** 좌표는 OpenStreetMap 기준. 경로는 실제 노선을 바탕으로 한 '예시'이며 시간은 대략값이다. */
export type LatLng = [number, number]
export type Place = { id: string; name: string; category: string; area: string; ll: LatLng }

export const HERE: LatLng = [PRACTICE.here.lat, PRACTICE.here.lng]

const ST = {
  gwangwoon: { name: '광운대역', ll: [37.6236987, 127.0618193] as LatLng },
  seokgye: { name: '석계역', ll: [37.6148083, 127.0658393] as LatLng },
  wolgye: { name: '월계역', ll: [37.6341068, 127.0589231] as LatLng },
  changdong: { name: '창동역', ll: [37.6531817, 127.0476987] as LatLng },
  nowon: { name: '노원역', ll: [37.6563651, 127.0634799] as LatLng },
  seoul: { name: '서울역', ll: [37.5554175, 126.9725862] as LatLng },
}

export const PLACES: Place[] = [
  { id: 'seoul-station', name: '서울역', category: '기차역', area: '서울 용산구', ll: ST.seoul.ll },
  { id: 'nowon-station', name: '노원역', category: '지하철역 · 4·7호선', area: '서울 노원구 상계동', ll: ST.nowon.ll },
  { id: 'sanggye-paik', name: '상계백병원', category: '종합병원', area: '서울 노원구 상계동', ll: [37.6489644, 127.062064] },
  { id: 'nowon-gu-office', name: '노원구청', category: '구청', area: '서울 노원구 상계동', ll: [37.6544412, 127.0573232] },
  { id: 'lotte-nowon', name: '롯데백화점 노원점', category: '백화점', area: '서울 노원구 상계동', ll: [37.655019, 127.0611778] },
  { id: 'seokgye-station', name: '석계역', category: '지하철역 · 1·6호선', area: '서울 성북구 석관동', ll: ST.seokgye.ll },
  { id: 'wolgye-station', name: '월계역', category: '지하철역 · 1호선', area: '서울 노원구 월계동', ll: ST.wolgye.ll },
  { id: 'gwangwoon-station', name: '광운대역', category: '지하철역 · 1호선·경춘선', area: '서울 노원구 월계동', ll: ST.gwangwoon.ll },
]

export const findPlace = (id: string | undefined) => PLACES.find((p) => p.id === id)

export type Leg =
  | { kind: 'walk'; minutes: number; to: string; ll: LatLng }
  | { kind: 'subway'; line: string; color: string; from: string; to: string; toward: string; stops: number; minutes: number; ll: LatLng }

export const LINE_COLOR: Record<string, string> = { '1호선': '#0052A4', '4호선': '#00A5DE' }

const walk = (minutes: number, to: { name: string; ll: LatLng }): Leg => ({ kind: 'walk', minutes, to: to.name, ll: to.ll })
const ride = (line: string, from: { name: string }, to: { name: string; ll: LatLng }, stops: number, minutes: number, toward: string): Leg => ({
  kind: 'subway',
  line,
  color: LINE_COLOR[line],
  from: from.name,
  to: to.name,
  toward,
  stops,
  minutes,
  ll: to.ll,
})

/** 광운대(내 위치)에서 노원역까지: 1호선 창동 환승 → 4호선 */
const toNowon = [walk(8, ST.gwangwoon), ride('1호선', ST.gwangwoon, ST.changdong, 3, 7, '의정부 방면'), ride('4호선', ST.changdong, ST.nowon, 1, 2, '진접 방면')]

export const ROUTES: Record<string, Leg[][]> = {
  'seoul-station': [
    [walk(8, ST.gwangwoon), ride('1호선', ST.gwangwoon, ST.seoul, 14, 35, '청량리·서울역 방면'), walk(3, { name: '서울역', ll: ST.seoul.ll })],
    [walk(15, ST.seokgye), ride('1호선', ST.seokgye, ST.seoul, 13, 33, '청량리·서울역 방면'), walk(3, { name: '서울역', ll: ST.seoul.ll })],
  ],
  'nowon-station': [[...toNowon, walk(1, { name: '노원역', ll: ST.nowon.ll })]],
  'sanggye-paik': [[...toNowon, walk(12, { name: '상계백병원', ll: [37.6489644, 127.062064] })]],
  'nowon-gu-office': [[...toNowon, walk(8, { name: '노원구청', ll: [37.6544412, 127.0573232] })]],
  'lotte-nowon': [[...toNowon, walk(4, { name: '롯데백화점 노원점', ll: [37.655019, 127.0611778] })]],
  'seokgye-station': [[walk(8, ST.gwangwoon), ride('1호선', ST.gwangwoon, ST.seokgye, 1, 2, '청량리·서울역 방면'), walk(1, { name: '석계역', ll: ST.seokgye.ll })], [walk(15, ST.seokgye)]],
  'wolgye-station': [[walk(8, ST.gwangwoon), ride('1호선', ST.gwangwoon, ST.wolgye, 1, 2, '의정부 방면'), walk(1, { name: '월계역', ll: ST.wolgye.ll })], [walk(22, ST.wolgye)]],
  'gwangwoon-station': [[walk(8, ST.gwangwoon)]],
}

const TRANSFER_WAIT = 3

export function routeSummary(legs: Leg[]) {
  const rides = legs.filter((l) => l.kind === 'subway')
  const total = legs.reduce((a, l) => a + l.minutes, 0) + rides.length * TRANSFER_WAIT
  return { total, transfers: Math.max(0, rides.length - 1), walkOnly: rides.length === 0 }
}

/** 두 지점 사이 직선거리(m) */
export function distanceM([lat1, lng1]: LatLng, [lat2, lng2]: LatLng): number {
  const R = 6_371_000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export const distanceLabel = (m: number) => (m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${Math.round(m / 10) * 10}m`)
