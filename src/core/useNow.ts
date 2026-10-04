import { useEffect, useState } from 'react'

/** 현재 시각(ms)을 interval마다 갱신한다. enabled=false면 멈춘다. */
export function useNow(intervalMs = 1000, enabled = true): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!enabled) return
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, enabled])
  return now
}

/** 마감 시각까지 남은 초. deadline이 없으면 0, 지나면 expired. */
export function useCountdown(deadline: number | null) {
  const now = useNow(250, deadline != null)
  const left = deadline == null ? 0 : Math.max(0, Math.ceil((deadline - now) / 1000))
  return { left, expired: deadline != null && left === 0 }
}
