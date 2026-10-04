import { create } from 'zustand'

export const useToast = create<{ msg: string | null; key: number }>(() => ({ msg: null, key: 0 }))

let timer: number | undefined

export function toast(msg: string) {
  useToast.setState((s) => ({ msg, key: s.key + 1 }))
  window.clearTimeout(timer)
  timer = window.setTimeout(() => useToast.setState({ msg: null }), 2400)
}

export const notReady = () => toast('연습 앱에서는 아직 안 되는 기능이에요')
