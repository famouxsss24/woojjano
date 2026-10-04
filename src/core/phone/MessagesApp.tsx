import { AppBar } from '../ui/AppBar'
import { ampm } from '../format'
import { usePhone } from './phoneStore'

/** 가짜 '문자' 앱. 인증번호를 확인하고 ‹ 로 원래 앱에 돌아가는 연습용. */
export default function MessagesApp() {
  const inbox = usePhone((s) => s.inbox)
  return (
    <div className="flex h-full flex-col bg-white">
      <AppBar title="메시지" backTarget="messages-back" />
      <main className="min-h-0 flex-1 overflow-y-auto bg-canvas px-4 py-4">
        {inbox.length === 0 ? (
          <p className="pt-20 text-center text-[17px] text-sub">받은 문자가 없어요</p>
        ) : (
          <ul className="grid gap-3">
            {inbox.map((sms) => (
              <li key={sms.id} className="rounded-2xl bg-white p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-[16px] font-bold">{sms.from}</p>
                  <p className="text-[13px] text-faint">{ampm(new Date(sms.at))}</p>
                </div>
                <p className="mt-2 text-[18px] leading-relaxed whitespace-pre-line">{sms.body}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
