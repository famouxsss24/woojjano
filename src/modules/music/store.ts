import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '../../core/format'
import { sessionJSON } from '../../core/persist'

export type Playlist = { id: string; name: string; videoIds: string[] }

export const WATCH_LATER = 'watch-later'
export const FAVORITE_NAME = '내가 좋아하는 노래'

type MusicState = { playlists: Playlist[]; recent: string[] }

const initial = (): MusicState => ({ playlists: [{ id: WATCH_LATER, name: '나중에 볼 동영상', videoIds: [] }], recent: [] })

export const useMusic = create<MusicState>()(persist(initial, { name: 'wz.music', storage: sessionJSON }))

export const musicActions = {
  reset: (missionId: string | null) => {
    const s = initial()
    // '모아둔 노래 한 번에 듣기' 연습은 재생목록을 미리 만들어 둔다
    if (missionId === 'play-all') s.playlists.push({ id: 'fav', name: FAVORITE_NAME, videoIds: ['v1', 'v4', 'v6'] })
    useMusic.setState(s)
  },
  addRecent: (q: string) => useMusic.setState(({ recent }) => ({ recent: [q, ...recent.filter((r) => r !== q)].slice(0, 5) })),
  create: (name: string, videoId: string): Playlist => {
    const p: Playlist = { id: uid(), name, videoIds: [videoId] }
    useMusic.setState(({ playlists }) => ({ playlists: [...playlists, p] }))
    return p
  },
  /** 재생목록에 넣거나 뺀다. 넣었으면 true */
  toggle: (playlistId: string, videoId: string): boolean => {
    const p = useMusic.getState().playlists.find((x) => x.id === playlistId)
    if (!p) return false
    const has = p.videoIds.includes(videoId)
    useMusic.setState(({ playlists }) => ({
      playlists: playlists.map((x) => (x.id === playlistId ? { ...x, videoIds: has ? x.videoIds.filter((v) => v !== videoId) : [...x.videoIds, videoId] } : x)),
    }))
    return !has
  },
  remove: (playlistId: string, videoId: string) =>
    useMusic.setState(({ playlists }) => ({ playlists: playlists.map((x) => (x.id === playlistId ? { ...x, videoIds: x.videoIds.filter((v) => v !== videoId) } : x)) })),
}
