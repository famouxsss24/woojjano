import type { RouteObject } from 'react-router'
import TalkFriends from './screens/TalkFriends'
import TalkChats from './screens/TalkChats'
import TalkProfile from './screens/TalkProfile'
import TalkChat from './screens/TalkChat'
import TalkAlbum from './screens/TalkAlbum'

export const talkRoutes: RouteObject[] = [
  { path: '/talk', element: <TalkFriends /> },
  { path: '/talk/chats', element: <TalkChats /> },
  { path: '/talk/profile/:id', element: <TalkProfile /> },
  { path: '/talk/chat/:id', element: <TalkChat /> },
  { path: '/talk/chat/:id/album', element: <TalkAlbum /> },
]
