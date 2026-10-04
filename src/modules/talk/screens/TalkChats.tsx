import { useNavigate } from 'react-router'
import { ampm } from '../../../core/format'
import { CHAT_ROOMS, type Msg } from '../data'
import { useTalk } from '../store'
import { Avatar, TalkHeader, TalkTabs } from '../ui'

const preview = (m?: Msg) => (!m ? '' : m.photos ? `사진 ${m.photos.length}장` : (m.text ?? ''))

function timeLabel(at: number) {
  const d = new Date(at)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return ampm(d)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

export default function TalkChats() {
  const chats = useTalk((s) => s.chats)
  const unread = useTalk((s) => s.unread)
  const navigate = useNavigate()

  const rooms = [...CHAT_ROOMS]
    .map((r) => ({ room: r, last: chats[r.id]?.at(-1) }))
    .sort((a, b) => (b.last?.at ?? 0) - (a.last?.at ?? 0))

  return (
    <div className="flex h-full flex-col bg-white">
      <TalkHeader title="채팅" />
      <main className="min-h-0 flex-1 overflow-y-auto pb-4">
        <ul>
          {rooms.map(({ room, last }) => (
            <li key={room.id}>
              <button data-target={`room-${room.id}`} onClick={() => navigate(`/talk/chat/${room.id}`)} className="flex w-full items-center gap-4 px-5 py-3 text-left active:bg-black/5">
                <Avatar f={room} size={52} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[18px] font-semibold">
                    {room.name} {room.group && <span className="text-[15px] text-faint">{room.group}</span>}
                  </span>
                  <span className="block truncate text-[15px] text-sub">{preview(last)}</span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[13px] text-faint">{last ? timeLabel(last.at) : ''}</span>
                  {(unread[room.id] ?? 0) > 0 && <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#FF5A3C] px-1.5 text-[13px] font-bold text-white">{unread[room.id]}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </main>
      <TalkTabs active="chats" />
    </div>
  )
}
