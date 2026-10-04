import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

/** react-router가 window.history.state에 넣어 두는 방문 순번(idx). 모르면 null */
export function historyIdx(): number | null {
  const idx = (window.history.state as { idx?: unknown } | null)?.idx
  return typeof idx === 'number' ? idx : null
}

/** 되돌아간 뒤 바꿔 넣을 주소 (도착한 칸의 순번까지 같이 기억해, 엉뚱한 칸을 바꾸지 않게 한다) */
let pending: { idx: number; path: string } | null = null

/**
 * 방문 기록의 targetIdx 칸으로 되돌아간 뒤, 그 칸을 path로 바꾼다.
 * 연습하며 쌓인 화면 기록을 걷어내서, 나간 뒤 휴대폰 ◁(뒤로)를 눌러도 하던 연습으로 돌아가지 않게 한다.
 * 순번을 모르면 지금 칸을 path로 바꾸기만 한다.
 */
export function useJumpBack() {
  const navigate = useNavigate()
  return (targetIdx: number | null, path: string) => {
    const cur = historyIdx()
    if (targetIdx == null || cur == null || targetIdx < 0 || targetIdx >= cur) {
      navigate(path, { replace: true })
      return
    }
    pending = { idx: targetIdx, path }
    navigate(targetIdx - cur)
  }
}

/** 모든 화면의 최상단 틀. 되돌아가기가 끝나면 예약한 주소로 바꿔 넣는다. */
export function RootLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (!pending || historyIdx() !== pending.idx) return
    const { path } = pending
    pending = null
    if (location.pathname !== path) navigate(path, { replace: true })
  }, [location.key, location.pathname, navigate])
  return <Outlet />
}
