import { Suspense, lazy, type ReactNode } from 'react'
import type { RouteObject } from 'react-router'

// 지도 라이브러리(Leaflet)는 무거워서 길찾기 연습에 들어갈 때만 내려받는다
const MapHome = lazy(() => import('./screens/MapHome'))
const MapSearch = lazy(() => import('./screens/MapSearch'))
const MapPlace = lazy(() => import('./screens/MapPlace'))
const MapRoute = lazy(() => import('./screens/MapRoute'))
const MapRouteDetail = lazy(() => import('./screens/MapRouteDetail'))

const withFallback = (node: ReactNode) => <Suspense fallback={<p className="grid h-full place-items-center text-[17px] text-sub">지도를 불러오는 중…</p>}>{node}</Suspense>

export const mapRoutes: RouteObject[] = [
  { path: '/map', element: withFallback(<MapHome />) },
  { path: '/map/search', element: withFallback(<MapSearch />) },
  { path: '/map/place/:id', element: withFallback(<MapPlace />) },
  { path: '/map/route/:id', element: withFallback(<MapRoute />) },
  { path: '/map/route/:id/:idx', element: withFallback(<MapRouteDetail />) },
]
