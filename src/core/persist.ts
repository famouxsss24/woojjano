import { createJSONStorage } from 'zustand/middleware'

/**
 * 새로고침해도 연습 상태는 남고, 탭을 닫으면 지워지도록 sessionStorage에 둔다.
 * 사생활 보호 모드 등으로 저장소를 못 쓰면 zustand가 메모리로만 동작한다.
 */
export const sessionJSON = createJSONStorage(() => sessionStorage)
