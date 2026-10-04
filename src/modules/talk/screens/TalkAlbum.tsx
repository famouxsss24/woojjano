import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { ChevronDown } from 'lucide-react'
import { emit } from '../../../core/mission/missionStore'
import { AppBar } from '../../../core/ui/AppBar'
import { notReady } from '../../../core/ui/toast'
import { PHOTOS, findRoom } from '../data'
import { talkActions } from '../store'

const MAX_PICK = 30

export default function TalkAlbum() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [picked, setPicked] = useState<string[]>([])
  const [original, setOriginal] = useState(false)
  const room = findRoom(id)
  if (!room) return <Navigate to="/talk/chats" replace />

  const toggle = (pid: string) => setPicked((p) => (p.includes(pid) ? p.filter((x) => x !== pid) : p.length >= MAX_PICK ? p : [...p, pid]))

  const send = () => {
    if (picked.length === 0) return
    talkActions.sendPhotos(room.id, picked)
    navigate(-1)
    emit('talk.photo.sent', { to: room.id, count: picked.length })
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <AppBar
        backIcon="close"
        title={
          <span className="pointer-events-auto inline-flex items-center gap-1" onClick={notReady}>
            최근 항목 <ChevronDown size={20} />
          </span>
        }
      />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div data-target="album-grid" className="grid grid-cols-3 gap-0.5">
          {PHOTOS.map((p) => {
            const n = picked.indexOf(p.id) + 1
            return (
              <button key={p.id} aria-label={`${p.label} 사진 ${n ? '선택됨' : ''}`} onClick={() => toggle(p.id)} className="relative aspect-square">
                <span className={`grid h-full place-items-center text-[44px] transition-transform ${n ? 'scale-[0.92]' : ''}`} style={{ background: p.bg }}>
                  {p.emoji}
                </span>
                <span
                  className={`absolute top-2 right-2 grid size-7 place-items-center rounded-full text-[14px] font-extrabold ${n ? 'bg-(--brand) text-(--brand-ink)' : 'bg-black/20 shadow-[inset_0_0_0_2px_#fff]'}`}
                >
                  {n || ''}
                </span>
                <span className="absolute bottom-1.5 left-2 text-[12px] font-semibold text-white drop-shadow">{p.label}</span>
              </button>
            )
          })}
        </div>
      </main>
      <div className="flex shrink-0 items-center justify-between bg-white px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.05)]">
        <label className="flex items-center gap-2 text-[16px] font-semibold">
          <input type="checkbox" checked={original} onChange={(e) => setOriginal(e.target.checked)} className="size-5 accent-(--brand)" />
          원본
        </label>
        <button
          data-target={picked.length ? 'album-send-ready' : undefined}
          disabled={picked.length === 0}
          onClick={send}
          className="h-13 min-w-32 rounded-2xl bg-(--brand) px-6 text-[18px] font-bold text-(--brand-ink) disabled:bg-gray-200 disabled:text-gray-400"
        >
          전송 <span className="inline-block min-w-[2ch] tabular-nums">{picked.length || ''}</span>
        </button>
      </div>
    </div>
  )
}
