import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sessionJSON } from '../../core/persist'

export const START_ZOOM = 16
const PINCH_STEP = 2

type MapState = {
  recent: string[]
  /** 두 손가락 연습 진행: 크게 했는지 → 다시 작게 했는지 */
  zoomedIn: boolean
  pinchDone: boolean
}

const initial = (): MapState => ({ recent: [], zoomedIn: false, pinchDone: false })

export const useMapStore = create<MapState>()(persist(initial, { name: 'wz.map', storage: sessionJSON }))

export const mapActions = {
  reset: () => useMapStore.setState(initial()),
  addRecent: (id: string) => useMapStore.setState(({ recent }) => ({ recent: [id, ...recent.filter((r) => r !== id)].slice(0, 5) })),
  /** 확대 수준이 바뀔 때마다 호출. 크게 했다가 다시 작게 하면 true를 한 번 돌려준다 */
  trackZoom: (zoom: number): boolean => {
    const { zoomedIn, pinchDone } = useMapStore.getState()
    if (pinchDone) return false
    if (!zoomedIn && zoom >= START_ZOOM + PINCH_STEP) {
      useMapStore.setState({ zoomedIn: true })
      return false
    }
    if (zoomedIn && zoom <= START_ZOOM) {
      useMapStore.setState({ pinchDone: true })
      return true
    }
    return false
  },
}
