import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Camera, Gift, Image, Menu, MapPin, Paperclip, Phone, Plus, Search, Send, Wallet, X } from 'lucide-react'
import { emit } from '../../../core/mission/missionStore'
import { ampm } from '../../../core/format'
import { AppBar, IconButton } from '../../../core/ui/AppBar'
import { notReady } from '../../../core/ui/toast'
import { FRIENDS, findPhoto, findRoom, type Msg } from '../data'
import { talkActions, useTalk } from '../store'
import { Avatar } from '../ui'

const CHAT_BG = '#C3D3E2'

export default function TalkChat() {
  const { id } = useParams()
  const navigate = useNavigate()
  const msgs = useTalk((s) => (id ? s.chats[id] : undefined))
  const [text, setText] = useState('')
  const [plus, setPlus] = useState(false)
  const bottom = useRef<HTMLDivElement>(null)
  const room = findRoom(id)

  useEffect(() => {
    if (room) talkActions.markRead(room.id)
  }, [room])

  // 새 메시지가 오면 맨 아래로
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'end' })
  }, [msgs?.length])

  if (!room) return <Navigate to="/talk/chats" replace />

  const send = () => {
    const t = text.trim()
    if (!t) return
    talkActions.sendText(room.id, t)
    setText('')
    emit('talk.text.sent', { to: room.id })
  }

  return (
    <div className="flex h-full flex-col" style={{ background: CHAT_BG }}>
      <AppBar
        tone="clear"
        title={room.name}
        right={
          <>
            <IconButton label="검색" onClick={notReady}>
              <Search size={22} />
            </IconButton>
            <IconButton label="메뉴" onClick={notReady}>
              <Menu size={22} />
            </IconButton>
          </>
        }
      />
      <main className="min-h-0 flex-1 overflow-y-auto px-3 py-3" onClick={() => setPlus(false)}>
        <ul className="grid gap-2">
          {(msgs ?? []).map((m) => (
            <Bubble key={m.id} m={m} />
          ))}
        </ul>
        <div ref={bottom} />
      </main>

      <div className="flex shrink-0 items-end gap-1 bg-white px-2 py-2">
        <button
          data-target="chat-plus"
          aria-label={plus ? '메뉴 닫기' : '더보기'}
          onClick={() => setPlus((p) => !p)}
          className="grid size-11 shrink-0 place-items-center rounded-full active:bg-black/5"
        >
          {plus ? <X size={26} /> : <Plus size={28} />}
        </button>
        <textarea
          data-target="chat-input"
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setPlus(false)}
          placeholder="메시지 입력"
          className="max-h-28 min-h-11 min-w-0 flex-1 resize-none rounded-2xl bg-canvas px-4 py-2.5 text-[17px] outline-none"
        />
        <button
          data-target={text.trim() ? 'chat-send' : undefined}
          aria-label="전송"
          disabled={!text.trim()}
          onClick={send}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-(--brand) text-(--brand-ink) disabled:bg-transparent disabled:text-faint"
        >
          <Send size={20} />
        </button>
      </div>

      {plus && (
        <div className="grid shrink-0 grid-cols-4 gap-y-4 bg-white px-3 pt-2 pb-[max(16px,env(safe-area-inset-bottom))]">
          <PlusItem label="앨범" target="plus-album" color="#7ED957" onClick={() => navigate(`/talk/chat/${room.id}/album`)}>
            <Image size={26} />
          </PlusItem>
          <PlusItem label="카메라" color="#5DB0FF" onClick={notReady}>
            <Camera size={26} />
          </PlusItem>
          <PlusItem label="선물하기" color="#FF7A7A" onClick={notReady}>
            <Gift size={26} />
          </PlusItem>
          <PlusItem label="통화하기" color="#4FD1C5" onClick={notReady}>
            <Phone size={26} />
          </PlusItem>
          <PlusItem label="송금" color="#FFC83D" onClick={notReady}>
            <Wallet size={26} />
          </PlusItem>
          <PlusItem label="지도" color="#9F7AEA" onClick={notReady}>
            <MapPin size={26} />
          </PlusItem>
          <PlusItem label="파일" color="#A0AEC0" onClick={notReady}>
            <Paperclip size={26} />
          </PlusItem>
        </div>
      )}
    </div>
  )
}

function PlusItem({ label, color, target, onClick, children }: { label: string; color: string; target?: string; onClick: () => void; children: ReactNode }) {
  return (
    <button data-target={target} onClick={onClick} className="flex flex-col items-center gap-1.5">
      <span className="grid size-14 place-items-center rounded-[38%] text-white" style={{ background: color }}>
        {children}
      </span>
      <span className="text-[14px] font-semibold text-sub">{label}</span>
    </button>
  )
}

function Bubble({ m }: { m: Msg }) {
  const mine = m.from === 'me'
  const sender = FRIENDS.find((f) => f.id === m.from)
  const time = <span className="shrink-0 self-end text-[12px] text-ink/50">{ampm(new Date(m.at))}</span>
  const body = m.photos ? (
    <div className={`grid gap-0.5 overflow-hidden rounded-2xl ${m.photos.length > 1 ? 'grid-cols-2' : ''}`} style={{ width: m.photos.length > 1 ? 220 : 180 }}>
      {m.photos.map((pid) => {
        const p = findPhoto(pid)
        return (
          <span key={pid} className="grid aspect-square place-items-center text-[44px]" style={{ background: p?.bg ?? '#ddd' }}>
            {p?.emoji}
          </span>
        )
      })}
    </div>
  ) : (
    <p className={`max-w-[15rem] rounded-2xl px-3.5 py-2.5 text-[17px] leading-snug break-words whitespace-pre-wrap ${mine ? 'bg-(--brand) text-(--brand-ink)' : 'bg-white'}`}>{m.text}</p>
  )

  if (mine)
    return (
      <li className="flex justify-end gap-1.5">
        {time}
        {body}
      </li>
    )
  return (
    <li className="flex gap-2">
      {sender ? <Avatar f={sender} size={40} /> : <span className="w-10" />}
      <div className="min-w-0">
        <p className="mb-1 text-[14px] text-ink/70">{sender?.name}</p>
        <div className="flex gap-1.5">
          {body}
          {time}
        </div>
      </div>
    </li>
  )
}
