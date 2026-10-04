import { Navigate, createHashRouter } from 'react-router'
import HomePage from './home/HomePage'
import ModulePage from './home/ModulePage'
import PracticeShell from './core/shell/PracticeShell'
import MessagesApp from './core/phone/MessagesApp'
import { RootLayout } from './core/nav'
import { bankRoutes } from './modules/bank/routes'
import { railRoutes } from './modules/rail/routes'
import { foodRoutes } from './modules/food/routes'
import { mapRoutes } from './modules/map/routes'
import { talkRoutes } from './modules/talk/routes'
import { musicRoutes } from './modules/music/routes'

// HashRouter: 정적 호스팅(GitHub Pages 등)에서 새로고침해도 404가 나지 않는다
export const router = createHashRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/m/:moduleId', element: <ModulePage /> },
      {
        element: <PracticeShell />,
        children: [...bankRoutes, ...railRoutes, ...foodRoutes, ...mapRoutes, ...talkRoutes, ...musicRoutes, { path: '/messages', element: <MessagesApp /> }],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
