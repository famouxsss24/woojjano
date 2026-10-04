import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router'
import { Bookmark, ChevronDown, ListPlus, Pause, Play, Plus, Share2, SkipBack, SkipForward, ThumbsDown, ThumbsUp } from 'lucide-react'
import { emit } from '../../../core/mission/missionStore'
import { BottomSheet } from '../../../core/ui/Overlays'
import { notReady, toast } from '../../../core/ui/toast'
import { VIDEOS, duration, findVideo } from '../data'
import { musicActions, useMusic } from '../store'
import { Thumb } from '../ui'

export default function MusicWatch() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const listId = params.get('list')
  const navigate = useNavigate()
  const playlists = useMusic((s) => s.playlists)
  const video = findVideo(id)
  const queue = listId ? (playlists.find((p) => p.id === listId)?.videoIds ?? []) : []
  const qi = video ? queue.indexOf(video.id) : -1

  const [pos, setPos] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [liked, setLiked] = useState(false)
  const [sheet, setSheet] = useState<'closed' | 'list' | 'new'>('closed')
  const [newName, setNewName] = useState('')

  const goto = (vid: string | undefined) => {
    if (!vid) return
    navigate(`/music/watch/${vid}${listId ? `?list=${listId}` : ''}`, { replace: true })
  }

  // 영상이 바뀌면 처음부터 재생
  useEffect(() => {
    setPos(0)
    setPlaying(true)
    if (video) emit('music.watch', { id: video.id, artist: video.artist })
  }, [video])

  // 재생 흉내: 1초마다 앞으로. 끝나면 재생목록의 다음 곡
  useEffect(() => {
    if (!playing || !video) return
    const t = window.setInterval(() => setPos((p) => Math.min(p + 1, video.seconds)), 1000)
    return () => window.clearInterval(t)
  }, [playing, video])

  useEffect(() => {
    if (!video || pos < video.seconds) return
    if (qi >= 0 && qi < queue.length - 1) goto(queue[qi + 1])
    else setPlaying(false)
    // 끝에 닿은 순간(pos 변화)에만 판단한다. 그 렌더의 queue/qi를 그대로 쓰므로 오래된 값 문제는 없다
  }, [pos])

  if (!video) return <Navigate to="/music" replace />

  const togglePlay = () => {
    if (pos >= video.seconds) setPos(0)
    setPlaying(pos >= video.seconds ? true : !playing)
  }

  const create = () => {
    const name = newName.trim()
    if (!name) return
    musicActions.create(name, video.id)
    setSheet('closed')
    setNewName('')
    toast(`'${name}'에 저장했어요`)
    emit('music.playlist.save', { created: true, name })
  }

  const toggleIn = (pid: string, name: string) => {
    const added = musicActions.toggle(pid, video.id)
    toast(added ? `'${name}'에 저장했어요` : `'${name}'에서 뺐어요`)
    if (added) emit('music.playlist.save', { created: false, name })
  }

  const queueVideos = queue.map((v) => findVideo(v)).filter((v) => v != null)
  const next = VIDEOS.filter((v) => v.id !== video.id).slice(0, 6)

  return (
    <div className="relative flex h-full flex-col bg-white">
      {/* 플레이어: 조작 버튼은 가운데에 고정, 바뀌는 시간 글자는 폭을 예약해 버튼이 움직이지 않는다 */}
      <div className="relative aspect-video w-full shrink-0 bg-black">
        <div className="absolute inset-0 grid place-items-center text-[72px] opacity-90" style={{ background: video.bg }}>
          {video.emoji}
        </div>
        <div className="absolute inset-0 bg-black/30" />
        <button aria-label="닫기" onClick={() => navigate(-1)} className="absolute top-2 left-2 grid size-11 place-items-center rounded-full text-white">
          <ChevronDown size={28} />
        </button>
        <div className="absolute inset-0 flex items-center justify-center gap-8 text-white">
          <button aria-label="이전" disabled={qi <= 0} onClick={() => goto(queue[qi - 1])} className="grid size-12 place-items-center rounded-full bg-black/30 disabled:opacity-30">
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button aria-label={playing ? '일시정지' : '재생'} onClick={togglePlay}className="grid size-16 place-items-center rounded-full bg-black/40">
            {playing ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
          </button>
          <button aria-label="다음" disabled={qi < 0 || qi >= queue.length - 1} onClick={() => goto(queue[qi + 1])} className="grid size-12 place-items-center rounded-full bg-black/30 disabled:opacity-30">
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
        <p className="absolute bottom-3 left-3 min-w-[10ch] text-[14px] font-semibold text-white tabular-nums">
          {duration(pos)} / {duration(video.seconds)}
        </p>
        <button
          aria-label="재생 위치"
          className="absolute inset-x-0 -bottom-2 h-5"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            setPos(Math.round(((e.clientX - r.left) / r.width) * video.seconds))
          }}
        >
          <span className="absolute inset-x-0 top-1.5 h-1 bg-white/30" />
          <span className="absolute top-1.5 left-0 h-1 bg-(--brand)" style={{ width: `${(pos / video.seconds) * 100}%` }} />
        </button>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto pb-6">
        <section className="px-4 pt-4">
          <h1 className="text-[20px] leading-snug font-bold">
            {video.artist} - {video.title}
          </h1>
          <p className="mt-1 text-[14px] text-sub">
            {video.views} · {video.ago}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-canvas text-[20px]">🎵</span>
            <p className="flex-1 text-[16px] font-bold">{video.channel}</p>
            <button onClick={notReady} className="h-10 rounded-full bg-ink px-4 text-[15px] font-bold text-white">
              구독
            </button>
          </div>
          <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
            <Chip onClick={() => setLiked(!liked)} active={liked}>
              <ThumbsUp size={18} fill={liked ? 'currentColor' : 'none'} /> 좋아요
            </Chip>
            <Chip onClick={notReady}>
              <ThumbsDown size={18} />
            </Chip>
            <Chip onClick={notReady}>
              <Share2 size={18} /> 공유
            </Chip>
            <Chip target="music-save" onClick={() => setSheet('list')}>
              <Bookmark size={18} /> 저장
            </Chip>
          </div>
        </section>

        {qi >= 0 && (
          <section className="mx-4 mt-5 rounded-2xl bg-canvas p-4">
            <p className="text-[15px] font-bold">
              재생목록 · {playlists.find((p) => p.id === listId)?.name}{' '}
              <span className="text-sub tabular-nums">
                ({qi + 1}/{queue.length})
              </span>
            </p>
            <ul className="mt-2">
              {queueVideos.map((v) => (
                <li key={v.id}>
                  <button onClick={() => goto(v.id)} className={`w-full truncate py-1.5 text-left text-[15px] ${v.id === video.id ? 'font-bold text-(--brand)' : ''}`}>
                    {v.id === video.id ? '▶ ' : ''}
                    {v.artist} - {v.title}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="px-4 pt-6 pb-3 text-[16px] font-bold">다음 동영상</p>
        <ul className="grid gap-3 px-4">
          {next.map((v) => (
            <li key={v.id}>
              <button onClick={() => navigate(`/music/watch/${v.id}`, { replace: true })} className="flex w-full gap-3 text-left">
                <Thumb v={v} className="w-36 shrink-0 text-[32px]" />
                <span className="min-w-0">
                  <span className="line-clamp-2 block text-[16px] leading-snug font-bold">
                    {v.artist} - {v.title}
                  </span>
                  <span className="mt-1 block text-[13px] text-sub">{v.views}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </main>

      <BottomSheet open={sheet !== 'closed'} onClose={() => setSheet('closed')} title={sheet === 'new' ? '새 재생목록' : '재생목록에 저장'}>
        {sheet === 'list' ? (
          <div className="px-3 pb-4">
            <ul>
              {playlists.map((p) => {
                const on = p.videoIds.includes(video.id)
                return (
                  <li key={p.id}>
                    <button onClick={() => toggleIn(p.id, p.name)} className="flex h-14 w-full items-center gap-4 rounded-xl px-3 text-left active:bg-black/5">
                      <span className={`grid size-6 place-items-center rounded-md ${on ? 'bg-ink text-white' : 'shadow-[inset_0_0_0_2px_#9ca3af]'}`}>{on && '✓'}</span>
                      <span className="flex-1 text-[17px] font-semibold">{p.name}</span>
                      <span className="text-[14px] text-faint">비공개</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <button data-target="new-playlist" onClick={() => setSheet('new')} className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-canvas text-[17px] font-bold">
              <Plus size={20} /> 새 재생목록
            </button>
          </div>
        ) : (
          <div className="px-5 pb-6">
            <input
              data-target="new-playlist-name"
              autoFocus
              value={newName}
              maxLength={40}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="제목 (예: 내가 좋아하는 노래)"
              className="h-14 w-full rounded-xl bg-canvas px-4 text-[18px] outline-none focus:ring-2 focus:ring-(--brand)"
            />
            <p className="mt-3 flex items-center gap-2 text-[15px] text-sub">
              <ListPlus size={18} /> 공개 범위: 비공개 (나만 볼 수 있어요)
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={() => setSheet('list')} className="h-13 rounded-2xl bg-canvas text-[17px] font-bold">
                취소
              </button>
              <button
                data-target={newName.trim() ? 'playlist-create-ready' : undefined}
                disabled={!newName.trim()}
                onClick={create}
                className="h-13 rounded-2xl bg-ink text-[17px] font-bold text-white disabled:bg-gray-200 disabled:text-gray-400"
              >
                만들기
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}

function Chip({ children, onClick, active, target }: { children: ReactNode; onClick: () => void; active?: boolean; target?: string }) {
  return (
    <button data-target={target} onClick={onClick} className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-[15px] font-bold ${active ? 'bg-ink text-white' : 'bg-canvas'}`}>
      {children}
    </button>
  )
}
