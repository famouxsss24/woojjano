import { useToast } from './toast'

export function ToastHost() {
  const { msg, key } = useToast()
  if (!msg) return null
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-28 z-50 flex justify-center px-6">
      <p key={key} role="status" className="animate-pop rounded-2xl bg-ink/90 px-5 py-3 text-center text-[16px] text-white shadow-lg">
        {msg}
      </p>
    </div>
  )
}
