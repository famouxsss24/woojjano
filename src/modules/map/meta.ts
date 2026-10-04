import type { HintStep, PracticeModule } from '../../core/mission/types'
import { mapActions, useMapStore } from './store'

const SEARCH: HintStep[] = [
  { path: '/map', text: '맨 위 검색칸을 누르세요', target: 'map-search' },
  { path: '/map/search', text: "'서울역'이라고 쓰고, 아래 나온 [서울역]을 누르세요", target: ['result-seoul-station', 'search-input'] },
]

export const mapModule: PracticeModule = {
  id: 'map',
  name: '길찾기',
  brand: 'KW지도',
  emoji: '🗺️',
  color: '#12A150',
  ink: '#FFFFFF',
  summary: '지도 크게 보기 · 장소 찾기 · 가는 길',
  modeledOn: '네이버 지도의 순서(검색 → 장소 → 도착 → 대중교통 경로 → 자세히 보기)를 그대로 따라 만들었어요. 지도는 실제 지도이고, 경로는 예시예요.',
  basePath: '/map',
  freePath: '/map',
  reset: () => mapActions.reset(),
  missions: [
    {
      id: 'pinch',
      title: '두 손가락으로 지도 크게·작게 하기',
      detail: '손가락을 벌리면 커지고, 오므리면 작아져요',
      startPath: '/map',
      completeOn: 'map.pinch',
      steps: [
        { path: '/map', when: () => !useMapStore.getState().zoomedIn, text: '두 손가락을 지도에 대고 쫙 벌려 보세요. 지도가 커져요' },
        { path: '/map', text: '잘하셨어요! 이번엔 두 손가락을 오므려 다시 작게 해 보세요' },
      ],
    },
    {
      id: 'find',
      title: '서울역 찾아보기',
      detail: '검색해서 지도에서 위치 보기',
      startPath: '/map',
      completeOn: 'map.place.view',
      check: (p) => (p.id === 'seoul-station' ? null : '서울역을 찾아야 해요'),
      steps: SEARCH,
    },
    {
      id: 'route',
      title: '서울역 가는 길 찾기',
      detail: '지하철로 가는 방법 보기',
      startPath: '/map',
      completeOn: 'map.route.detail',
      check: (p) => (p.id === 'seoul-station' ? null : '서울역 가는 길을 찾아야 해요'),
      steps: [
        ...SEARCH,
        { path: '/map/place/:id', text: '아래 초록 [도착] 버튼을 누르세요', target: 'place-arrive' },
        { path: '/map/route/:id', text: '맨 위 경로를 누르면 자세히 볼 수 있어요', target: 'route-0' },
      ],
    },
  ],
}
