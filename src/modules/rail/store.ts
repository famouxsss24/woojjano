import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PRACTICE } from '../../core/config'
import { uid, ymd } from '../../core/format'
import { sessionJSON } from '../../core/persist'
import { autoSeats, fare, findTrains, type SeatClass, type Train } from './data'

export type Query = { from: string; to: string; date: string; hour: number; adults: number; seniors: number }
export type Pending = { train: Train; cls: SeatClass; query: Query; seats: string[] | null }
export type Reservation = { train: Train; cls: SeatClass; query: Query; seats: string[]; total: number; deadline: number }
export type Ticket = Reservation & { id: string; paidAt: number }

type RailState = {
  loggedIn: boolean
  query: Query
  pending: Pending | null
  reservation: Reservation | null
  tickets: Ticket[]
}

const defaultQuery = (): Query => ({ from: 'seoul', to: 'busan', date: ymd(new Date()), hour: Math.min(22, Math.max(5, new Date().getHours())), adults: 1, seniors: 0 })

const initial = (): RailState => ({ loggedIn: false, query: defaultQuery(), pending: null, reservation: null, tickets: [] })

export const useRail = create<RailState>()(persist(initial, { name: 'wz.rail', storage: sessionJSON }))

/** '승차권 확인' 연습용으로 오늘 저녁 서울→부산 표 한 장을 미리 만들어 둔다 */
function seededTicket(): Ticket {
  const q = { ...defaultQuery(), hour: 0 }
  const trains = findTrains(q.from, q.to, q.date)
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes()
  const train = trains.find((t) => t.dep > nowMin + 60 && !t.soldOut.general) ?? trains[trains.length - 1]
  const unit = train.price.general ?? 0
  return { id: uid(), train, cls: 'general', query: q, seats: autoSeats(train, 'general', 1), total: fare(unit, q), deadline: 0, paidAt: Date.now() }
}

export const railActions = {
  reset: (missionId: string | null) => {
    const s = initial()
    if (missionId === 'book') s.loggedIn = true
    if (missionId === 'ticket') Object.assign(s, { loggedIn: true, tickets: [seededTicket()] })
    useRail.setState(s)
  },
  setQuery: (q: Partial<Query>) => useRail.setState((s) => ({ query: { ...s.query, ...q } })),
  setStation: (which: 'from' | 'to', id: string) =>
    useRail.setState(({ query }) => {
      const other = which === 'from' ? query.to : query.from
      // 반대편과 같은 역을 고르면 실제 앱처럼 서로 바꿔 준다
      if (other === id) return { query: { ...query, from: query.to, to: query.from } }
      return { query: { ...query, [which]: id } }
    }),
  swap: () => useRail.setState(({ query }) => ({ query: { ...query, from: query.to, to: query.from } })),
  choose: (train: Train, cls: SeatClass) => useRail.setState((s) => ({ pending: { train, cls, query: s.query, seats: null } })),
  clearPending: () => useRail.setState({ pending: null }),
  setSeats: (seats: string[]) => useRail.setState((s) => (s.pending ? { pending: { ...s.pending, seats } } : {})),
  login: () => useRail.setState({ loggedIn: true }),
  logout: () => useRail.setState({ loggedIn: false }),
  /** 고른 열차를 예약하고 결제 기한을 건다. 고른 게 없으면 false */
  reserve: (): boolean => {
    const { pending } = useRail.getState()
    if (!pending) return false
    const { train, cls, query } = pending
    const unit = train.price[cls]
    if (unit == null) return false
    const count = query.adults + query.seniors
    const seats = pending.seats ?? autoSeats(train, cls, count)
    useRail.setState({
      pending: null,
      reservation: { train, cls, query, seats, total: fare(unit, query), deadline: Date.now() + PRACTICE.railPaySeconds * 1000 },
    })
    return true
  },
  cancelReservation: () => useRail.setState({ reservation: null }),
  /** 결제 기한 안이면 승차권 발권 */
  pay: (): Ticket | null => {
    const { reservation, tickets } = useRail.getState()
    if (!reservation || Date.now() > reservation.deadline) return null
    const ticket: Ticket = { ...reservation, id: uid(), paidAt: Date.now() }
    useRail.setState({ reservation: null, tickets: [ticket, ...tickets] })
    return ticket
  },
}
