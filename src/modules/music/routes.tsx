import type { RouteObject } from 'react-router'
import MusicHome from './screens/MusicHome'
import MusicSearch from './screens/MusicSearch'
import MusicWatch from './screens/MusicWatch'
import MusicLibrary from './screens/MusicLibrary'
import MusicPlaylist from './screens/MusicPlaylist'

export const musicRoutes: RouteObject[] = [
  { path: '/music', element: <MusicHome /> },
  { path: '/music/search', element: <MusicSearch /> },
  { path: '/music/watch/:id', element: <MusicWatch /> },
  { path: '/music/library', element: <MusicLibrary /> },
  { path: '/music/playlist/:id', element: <MusicPlaylist /> },
]
