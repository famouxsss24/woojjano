import type { RouteObject } from 'react-router'
import RailHome from './screens/RailHome'
import RailStation from './screens/RailStation'
import RailTrains from './screens/RailTrains'
import RailSeats from './screens/RailSeats'
import RailLogin from './screens/RailLogin'
import RailSignup from './screens/RailSignup'
import RailSignupDone from './screens/RailSignupDone'
import RailPay from './screens/RailPay'
import RailTickets from './screens/RailTickets'
import RailTicket from './screens/RailTicket'
import RailMy from './screens/RailMy'

export const railRoutes: RouteObject[] = [
  { path: '/rail', element: <RailHome /> },
  { path: '/rail/station/:which', element: <RailStation /> },
  { path: '/rail/trains', element: <RailTrains /> },
  { path: '/rail/seats', element: <RailSeats /> },
  { path: '/rail/login', element: <RailLogin /> },
  { path: '/rail/signup', element: <RailSignup /> },
  { path: '/rail/signup/done', element: <RailSignupDone /> },
  { path: '/rail/pay', element: <RailPay /> },
  { path: '/rail/tickets', element: <RailTickets /> },
  { path: '/rail/ticket/:id', element: <RailTicket /> },
  { path: '/rail/my', element: <RailMy /> },
]
