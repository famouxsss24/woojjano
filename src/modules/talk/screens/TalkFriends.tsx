import { useNavigate } from 'react-router'
import { PRACTICE } from '../../../core/config'
import { FRIENDS } from '../data'
import { Avatar, TalkHeader, TalkTabs } from '../ui'

export default function TalkFriends() {
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col bg-white">
      <TalkHeader title="친구" />
      <main className="min-h-0 flex-1 overflow-y-auto pb-4">
        <div className="flex items-center gap-4 px-5 py-3">
          <Avatar f={{ emoji: '🙂', color: '#FFC83D' }} size={60} />
          <div>
            <p className="text-[19px] font-bold">{PRACTICE.userName}</p>
            <p className="text-[15px] text-sub">오늘도 좋은 하루</p>
          </div>
        </div>
        <p className="px-5 pt-5 pb-1 text-[14px] font-semibold text-faint">친구 {FRIENDS.length}</p>
        <ul>
          {FRIENDS.map((f) => (
            <li key={f.id}>
              <button data-target={`friend-${f.id}`} onClick={() => navigate(`/talk/profile/${f.id}`)} className="flex w-full items-center gap-4 px-5 py-2.5 text-left active:bg-black/5">
                <Avatar f={f} />
                <span className="min-w-0">
                  <span className="block text-[18px] font-semibold">{f.name}</span>
                  {f.status && <span className="block truncate text-[14px] text-sub">{f.status}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </main>
      <TalkTabs active="friends" />
    </div>
  )
}
