import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '../../core/format'
import { sessionJSON } from '../../core/persist'
import { REPLIES, seedChats, type Msg } from './data'

type TalkState = { chats: Record<string, Msg[]>; unread: Record<string, number> }

const initial = (): TalkState => ({ chats: seedChats(), unread: { daughter: 1, grandson: 1 } })

export const useTalk = create<TalkState>()(persist(initial, { name: 'wz.talk', storage: sessionJSON }))

const REPLY_DELAY_MS = 2000
/** 연습을 다시 시작하면 그 전에 걸어 둔 답장은 버린다 */
let generation = 0

function push(chatId: string, msg: Msg) {
  useTalk.setState(({ chats }) => ({ chats: { ...chats, [chatId]: [...(chats[chatId] ?? []), msg] } }))
}

function scheduleReply(chatId: string) {
  const gen = generation
  window.setTimeout(() => {
    if (gen !== generation) return
    push(chatId, { id: uid(), from: chatId === 'group' ? 'friend' : chatId, text: REPLIES[chatId] ?? '👍', at: Date.now() })
  }, REPLY_DELAY_MS)
}

export const talkActions = {
  reset: () => {
    generation++
    useTalk.setState(initial())
  },
  markRead: (chatId: string) => useTalk.setState(({ unread }) => ({ unread: { ...unread, [chatId]: 0 } })),
  sendText: (chatId: string, text: string) => {
    push(chatId, { id: uid(), from: 'me', text, at: Date.now() })
    scheduleReply(chatId)
  },
  sendPhotos: (chatId: string, photos: string[]) => {
    if (photos.length === 0) return
    push(chatId, { id: uid(), from: 'me', photos, at: Date.now() })
    scheduleReply(chatId)
  },
}
