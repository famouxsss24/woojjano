import type { RouteObject } from 'react-router'
import BankLogin from './screens/BankLogin'
import BankHome from './screens/BankHome'
import BankHistory from './screens/BankHistory'
import BankTransfer from './screens/BankTransfer'
import BankAmount from './screens/BankAmount'
import BankConfirm from './screens/BankConfirm'
import BankDone from './screens/BankDone'

export const bankRoutes: RouteObject[] = [
  { path: '/bank', element: <BankLogin /> },
  { path: '/bank/home', element: <BankHome /> },
  { path: '/bank/history', element: <BankHistory /> },
  { path: '/bank/transfer', element: <BankTransfer /> },
  { path: '/bank/transfer/amount', element: <BankAmount /> },
  { path: '/bank/transfer/confirm', element: <BankConfirm /> },
  { path: '/bank/transfer/done', element: <BankDone /> },
]
