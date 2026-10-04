import type { HintStep, PracticeModule } from '../../core/mission/types'
import { onScreen } from '../../core/mission/dom'
import { talkActions } from './store'

/** 채팅방 안에서 사진 보내기까지 */
const IN_CHAT: HintStep[] = [
  { path: '/talk/chat/:id', when: () => onScreen('plus-album'), text: '[앨범]을 누르세요', target: 'plus-album' },
  { path: '/talk/chat/:id', text: '글 쓰는 칸 왼쪽의 [+] 버튼을 누르세요', target: 'chat-plus' },
]
const ALBUM = (many: boolean): HintStep => ({
  path: '/talk/chat/:id/album',
  text: many ? '보낼 사진을 2장 이상 눌러 고른 뒤, 아래 [전송]을 누르세요' : '보낼 사진을 눌러 고른 뒤, 아래 [전송]을 누르세요',
  target: ['album-send-ready', 'album-grid'],
})

export const talkModule: PracticeModule = {
  id: 'talk',
  name: '사진 보내기',
  brand: 'KW톡',
  emoji: '📷',
  color: '#FFC83D',
  ink: '#1F2328',
  summary: '자녀·손주에게 사진 보내기',
  modeledOn: '카카오톡의 순서(채팅방 → [+] → 앨범 → 사진 고르기 → 전송)를 그대로 따라 만들었어요.',
  basePath: '/talk',
  freePath: '/talk/chats',
  reset: () => talkActions.reset(),
  missions: [
    {
      id: 'one-photo',
      title: '큰딸에게 사진 한 장 보내기',
      detail: '채팅방 → [+] → 앨범',
      startPath: '/talk/chats',
      completeOn: 'talk.photo.sent',
      check: (p) => (p.to === 'daughter' ? null : '큰딸 미영이에게 보내야 해요'),
      steps: [{ path: '/talk/chats', text: '[큰딸 미영] 채팅방을 누르세요', target: 'room-daughter' }, ...IN_CHAT, ALBUM(false)],
    },
    {
      id: 'many-photos',
      title: '손주에게 사진 여러 장 한 번에 보내기',
      detail: '사진을 여러 장 골라서 한 번에',
      startPath: '/talk/chats',
      completeOn: 'talk.photo.sent',
      check: (p) => (p.to !== 'grandson' ? '손주 민준이에게 보내야 해요' : Number(p.count) < 2 ? '사진을 2장 이상 골라서 보내 보세요' : null),
      steps: [{ path: '/talk/chats', text: '[손주 민준] 채팅방을 누르세요', target: 'room-grandson' }, ...IN_CHAT, ALBUM(true)],
    },
    {
      id: 'text-friend',
      title: '친구 목록에서 찾아 안부 보내기',
      detail: '박영자 친구에게 "잘 지내?"',
      startPath: '/talk',
      completeOn: 'talk.text.sent',
      check: (p) => (p.to === 'friend' ? null : '박영자 친구에게 보내야 해요'),
      steps: [
        { path: '/talk', text: '친구 목록에서 [박영자]를 누르세요', target: 'friend-friend' },
        { path: '/talk/profile/:id', text: '[1:1 채팅]을 누르세요', target: 'profile-chat' },
        { path: '/talk/chat/:id', text: '아래 칸을 눌러 "잘 지내?"라고 쓰고, 오른쪽 [전송]을 누르세요', target: ['chat-send', 'chat-input'] },
      ],
    },
  ],
}
