import type { HintStep, PracticeModule } from '../../core/mission/types'
import { onScreen as has } from '../../core/mission/dom'
import { musicActions } from './store'

const FIND_LIM: HintStep[] = [
  { path: '/music', text: '오른쪽 위 돋보기(검색)를 누르세요', target: 'music-search' },
  { path: '/music/search', when: () => !has('result-0'), text: "'임영웅'이라고 쓰고 키보드의 [검색]이나 [이동]을 누르세요", target: ['popular-임영웅', 'search-box'] },
  { path: '/music/search', text: '듣고 싶은 노래를 누르세요', target: 'result-0' },
]

export const musicModule: PracticeModule = {
  id: 'music',
  name: '노래 모아듣기',
  brand: 'KW뮤직',
  emoji: '🎵',
  color: '#E5484D',
  ink: '#FFFFFF',
  summary: '노래 찾기 · 재생목록에 모아두기',
  modeledOn: '유튜브의 순서(검색 → 영상 → [저장] → 새 재생목록 → 내 페이지에서 모두 재생)를 그대로 따라 만들었어요. 실제 소리는 나오지 않아요.',
  basePath: '/music',
  freePath: '/music',
  reset: (missionId) => musicActions.reset(missionId),
  missions: [
    {
      id: 'find',
      title: '임영웅 노래 찾아서 듣기',
      detail: '검색해서 틀어 보기',
      startPath: '/music',
      completeOn: 'music.watch',
      check: (p) => (p.artist === '임영웅' ? null : '임영웅 노래를 찾아 틀어야 해요'),
      steps: FIND_LIM,
    },
    {
      id: 'save',
      title: "노래를 '내가 좋아하는 노래'에 모아두기",
      detail: '새 재생목록 만들기',
      startPath: '/music',
      completeOn: 'music.playlist.save',
      check: (p) => (p.created ? null : "[+ 새 재생목록]을 눌러 '내가 좋아하는 노래' 목록을 새로 만들어 보세요"),
      steps: [
        ...FIND_LIM,
        { path: '/music/watch/:id', when: () => has('new-playlist-name'), text: "제목 칸에 '내가 좋아하는 노래'라고 쓰고 [만들기]를 누르세요", target: ['playlist-create-ready', 'new-playlist-name'] },
        { path: '/music/watch/:id', when: () => has('new-playlist'), text: '[+ 새 재생목록]을 누르세요', target: 'new-playlist' },
        { path: '/music/watch/:id', text: '영상 아래 [저장] 버튼을 누르세요', target: 'music-save' },
      ],
    },
    {
      id: 'play-all',
      title: '모아둔 노래 한 번에 듣기',
      detail: '내 페이지 → 재생목록 → 모두 재생',
      startPath: '/music',
      completeOn: 'music.playlist.playall',
      steps: [
        { path: '/music', text: '오른쪽 아래 [내 페이지]를 누르세요', target: 'tab-library' },
        { path: '/music/library', text: "[내가 좋아하는 노래]를 누르세요", target: 'playlist-fav' },
        { path: '/music/playlist/:id', text: '[모두 재생]을 누르세요', target: 'play-all' },
      ],
    },
  ],
}
