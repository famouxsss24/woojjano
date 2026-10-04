import { Navigate, useNavigate, useParams } from 'react-router'
import { MessageCircle, Phone, Video, X } from 'lucide-react'
import { notReady } from '../../../core/ui/toast'
import { FRIENDS } from '../data'
import { Avatar } from '../ui'

export default function TalkProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const friend = FRIENDS.find((f) => f.id === id)
  if (!friend) return <Navigate to="/talk" replace />

  return (
    <div className="flex h-full flex-col text-white" style={{ background: `linear-gradient(180deg, ${friend.color}, #3b3f46)` }}>
      <div className="flex h-14 shrink-0 items-center px-1">
        <button aria-label="닫기" onClick={() => navigate(-1)} className="grid size-11 place-items-center rounded-full active:bg-white/10">
          <X size={28} />
        </button>
      </div>
      <main className="flex flex-1 flex-col items-center justify-end pb-10">
        <Avatar f={{ ...friend, color: '#ffffff' }} size={110} />
        <p className="mt-4 text-[26px] font-bold">{friend.name}</p>
        {friend.status && <p className="mt-1 text-[16px] text-white/80">{friend.status}</p>}
      </main>
      <div className="grid shrink-0 grid-cols-3 pb-[max(24px,env(safe-area-inset-bottom))]">
        <button data-target="profile-chat" onClick={() => navigate(`/talk/chat/${friend.id}`, { replace: true })} className="flex flex-col items-center gap-2 py-3">
          <MessageCircle size={28} />
          <span className="text-[15px] font-semibold">1:1 채팅</span>
        </button>
        <button onClick={notReady} className="flex flex-col items-center gap-2 py-3">
          <Phone size={28} />
          <span className="text-[15px] font-semibold">통화하기</span>
        </button>
        <button onClick={notReady} className="flex flex-col items-center gap-2 py-3">
          <Video size={28} />
          <span className="text-[15px] font-semibold">페이스톡</span>
        </button>
      </div>
    </div>
  )
}
