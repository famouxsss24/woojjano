import { useEffect, type RefObject } from 'react'
import { useNavigate } from 'react-router'
import { MessageCircle } from 'lucide-react'
import { ampm } from '../format'
import { dismissBanner, setShade, usePhone, type Sms } from './phoneStore'

const PULL_ZONE = 40 // 화면 맨 위에서 이 높이 안에서 시작해야 '알림 내리기'로 본다
const PULL_DISTANCE = 60

/**
 * 실제 휴대폰처럼 '위에서 뜨는 문자 알림'과 '위에서 아래로 쓸어 여는 알림창'을 흉내 낸다.
 * 인증번호를 보러 다른 앱(문자)에 다녀오는 연습이 목적.
 */
export function PhoneLayer({ viewport }: { viewport: RefObject<HTMLDivElement | null> }) {
  const navigate = useNavigate()
  const { inbox, bannerId, shadeOpen } = usePhone()
  const banner = inbox.find((m) => m.id === bannerId)

  useEffect(() => {
    const el = viewport.current
    if (!el) return
    let startY: number | null = null
    const begin = (y: number) => {
      startY = y - el.getBoundingClientRect().top < PULL_ZONE ? y : null
    }
    const move = (y: number) => {
      if (startY != null && y - startY > PULL_DISTANCE) {
        startY = null
        setShade(true)
      }
    }
    const end = () => (startY = null)
    const onTouchStart = (e: TouchEvent) => begin(e.touches[0].clientY)
    const onTouchMove = (e: TouchEvent) => move(e.touches[0].clientY)
    const onMouseDown = (e: MouseEvent) => begin(e.clientY)
    const onMouseMove = (e: MouseEvent) => move(e.clientY)
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('mousedown', onMouseDown)
    el.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchend', end)
    window.addEventListener('mouseup', end)
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('mousedown', onMouseDown)
      el.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchend', end)
      window.removeEventListener('mouseup', end)
    }
  }, [viewport])

  const openMessages = () => {
    dismissBanner()
    setShade(false)
    navigate('/messages')
  }

  return (
    <>
      {banner && !shadeOpen && (
        <button
          data-target="sms-banner"
          onClick={openMessages}
          className="animate-slide-down absolute inset-x-2 top-2 z-40 rounded-2xl bg-white/95 p-4 text-left shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur"
        >
          <SmsPreview sms={banner} />
        </button>
      )}

      {shadeOpen && (
        <div className="absolute inset-0 z-40 flex flex-col">
          <div className="animate-slide-down bg-[#202124] px-4 pt-5 pb-4 text-white shadow-2xl">
            <p className="text-[34px] font-light tabular-nums">{ampm(new Date())}</p>
            <p className="mb-4 text-[14px] text-white/60">알림</p>
            {inbox.length === 0 ? (
              <p className="py-6 text-center text-[16px] text-white/60">새 알림이 없어요</p>
            ) : (
              <ul className="grid max-h-[50vh] gap-2 overflow-y-auto">
                {inbox.map((sms) => (
                  <li key={sms.id}>
                    <button data-target="sms-banner" onClick={openMessages} className="w-full rounded-2xl bg-white p-4 text-left text-ink">
                      <SmsPreview sms={sms} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button aria-label="알림창 닫기" className="flex-1 bg-black/40" onClick={() => setShade(false)} />
        </div>
      )}
    </>
  )
}

function SmsPreview({ sms }: { sms: Sms }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#34C759] text-white">
        <MessageCircle size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] text-sub">메시지 · {ampm(new Date(sms.at))}</p>
        <p className="text-[15px] font-semibold">{sms.from}</p>
        <p className="line-clamp-2 text-[15px] whitespace-pre-line">{sms.body}</p>
      </div>
    </div>
  )
}
