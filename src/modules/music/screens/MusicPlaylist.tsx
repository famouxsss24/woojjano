import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Play, Shuffle, X } from 'lucide-react'
import { emit } from '../../../core/mission/missionStore'
import { AppBar } from '../../../core/ui/AppBar'
import { Dialog } from '../../../core/ui/Overlays'
import { notReady, toast } from '../../../core/ui/toast'
import { findVideo, type Video } from '../data'
import { musicActions, useMusic } from '../store'
import { Thumb } from '../ui'

export default function MusicPlaylist() {
  const { id } = useParams()
  const playlist = useMusic((s) => s.playlists.find((p) => p.id === id))
  const navigate = useNavigate()
  const [removing, setRemoving] = useState<Video | null>(null)
  if (!playlist) return <Navigate to="/music/library" replace />

  const videos = playlist.videoIds.map((v) => findVideo(v)).filter((v) => v != null)
  const cover = videos[0]

  const playAll = () => {
    if (!cover) return
    navigate(`/music/watch/${cover.id}?list=${playlist.id}`)
    emit('music.playlist.playall', { id: playlist.id })
  }

  return (
    <div className="relative flex h-full flex-col bg-white">
      <AppBar title={playlist.name} />
      <main className="min-h-0 flex-1 overflow-y-auto pb-6">
        <section className="mx-4 rounded-3xl p-5 text-white" style={{ background: cover ? cover.bg : '#4b5563' }}>
          <div className="rounded-2xl bg-black/25 p-4">
            <h2 className="text-[24px] font-extrabold">{playlist.name}</h2>
            <p className="mt-1 text-[15px] text-white/85">
              비공개 · 동영상 {videos.length}개
            </p>
            <div className="mt-4 grid grid-cols-[2fr_1fr] gap-2">
              <button data-target="play-all" disabled={!cover} onClick={playAll} className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-white text-[17px] font-bold text-ink disabled:opacity-50">
                <Play size={20} fill="currentColor" /> 모두 재생
              </button>
              <button onClick={notReady} className="flex h-13 items-center justify-center gap-1.5 rounded-2xl bg-white/20 text-[16px] font-bold">
                <Shuffle size={18} /> 셔플
              </button>
            </div>
          </div>
        </section>

        {videos.length === 0 ? (
          <p className="px-6 pt-10 text-center text-[16px] leading-relaxed text-sub">
            아직 담긴 노래가 없어요.
            <br />
            노래 화면에서 [저장]을 누르면 여기에 모여요.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 px-4">
            {videos.map((v) => (
              <li key={v.id} className="flex items-center gap-3">
                <button onClick={() => navigate(`/music/watch/${v.id}?list=${playlist.id}`)} className="flex min-w-0 flex-1 gap-3 text-left">
                  <Thumb v={v} className="w-32 shrink-0 text-[30px]" />
                  <span className="min-w-0">
                    <span className="line-clamp-2 block text-[16px] leading-snug font-bold">
                      {v.artist} - {v.title}
                    </span>
                    <span className="block text-[13px] text-sub">{v.channel}</span>
                  </span>
                </button>
                <button aria-label={`${v.title} 빼기`} onClick={() => setRemoving(v)} className="grid size-10 shrink-0 place-items-center rounded-full text-faint active:bg-black/5">
                  <X size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Dialog
        open={removing != null}
        title="재생목록에서 뺄까요?"
        actions={[
          { label: '취소', onClick: () => setRemoving(null) },
          {
            label: '빼기',
            primary: true,
            onClick: () => {
              if (removing) {
                musicActions.remove(playlist.id, removing.id)
                toast('뺐어요')
              }
              setRemoving(null)
            },
          },
        ]}
      >
        '{removing?.title}'을(를) 빼요. 다시 넣으려면 노래를 찾아 [저장]을 눌러야 해요.
      </Dialog>
    </div>
  )
}
