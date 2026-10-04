import { useState, type ReactNode } from 'react'
import { Delete, Lock, X } from 'lucide-react'

const MAX_FAILS = 5

/** 숫자 0~9와 빈칸 2개를 섞는다 — 실제 은행·결제 앱의 '보안 키패드'처럼 누를 때마다 위치가 바뀐다 */
function shuffledKeys(): string[] {
  const keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '', '']
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[keys[i], keys[j]] = [keys[j], keys[i]]
  }
  return keys
}

type KeypadProps = {
  length: number
  answer: string
  onSuccess: () => void
  /** 연습용 비밀번호 안내 */
  practiceHint?: boolean
}

export function SecureKeypad({ length, answer, onSuccess, practiceHint = true }: KeypadProps) {
  const [pin, setPin] = useState('')
  const [keys, setKeys] = useState(shuffledKeys)
  const [fails, setFails] = useState(0)
  const done = pin.length >= length

  const press = (d: string) => {
    if (done) return
    const next = pin + d
    setPin(next)
    if (next.length < length) return
    if (next === answer) {
      // 마지막 칸이 채워진 것을 잠깐 보여 준 뒤 넘어간다
      window.setTimeout(onSuccess, 180)
      return
    }
    // 틀리면 바로 비운다 (지연을 두면 그사이 누른 숫자가 씹힌다). 흔들림·안내 문구로 알려 준다
    setFails((f) => f + 1)
    setKeys(shuffledKeys())
    setPin('')
  }

  const failText =
    fails === 0 ? null : fails % MAX_FAILS === 0 ? `실제 앱에서는 ${MAX_FAILS}번 틀리면 잠겨요. 연습이니 다시 해볼게요` : `비밀번호가 맞지 않아요 (${fails % MAX_FAILS}/${MAX_FAILS})`

  return (
    <div className="shrink-0 bg-white">
      <div key={fails} className={`flex justify-center gap-3.5 py-5 ${fails ? 'animate-shake' : ''}`}>
        {Array.from({ length }, (_, i) => (
          <span key={i} className={`size-4 rounded-full transition-colors ${i < pin.length ? 'bg-ink' : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="flex h-9 items-center justify-center px-4 text-center text-[15px]">
        {failText ? (
          <span className="font-semibold text-red-500">{failText}</span>
        ) : (
          practiceHint && (
            <span className="rounded-full bg-practice/30 px-3 py-1 font-semibold">
              연습용 비밀번호 <span className="tabular-nums">{answer}</span>
            </span>
          )
        )}
      </div>
      <div data-target="keypad" className="mt-2 grid grid-cols-3 bg-canvas pb-[env(safe-area-inset-bottom)]">
        {keys.map((k, i) =>
          k ? (
            <button key={i} onClick={() => press(k)} className="h-16 text-[26px] font-semibold tabular-nums active:bg-black/5">
              {k}
            </button>
          ) : (
            <span key={i} className="h-16" />
          ),
        )}
        <button onClick={() => setKeys(shuffledKeys())} className="h-16 text-[16px] font-semibold text-sub active:bg-black/5">
          재배열
        </button>
        <button onClick={() => setPin('')} className="h-16 text-[16px] font-semibold text-sub active:bg-black/5">
          전체삭제
        </button>
        <button aria-label="지우기" onClick={() => setPin((p) => (done ? p : p.slice(0, -1)))} className="grid h-16 place-items-center text-sub active:bg-black/5">
          <Delete size={28} />
        </button>
      </div>
    </div>
  )
}

type SheetProps = KeypadProps & { open: boolean; title: string; subtitle?: ReactNode; onClose: () => void }

/** 화면 위로 올라오는 비밀번호 입력 창 */
export function KeypadSheet({ open, title, subtitle, onClose, ...keypad }: SheetProps) {
  if (!open) return null
  return (
    <div className="animate-slide-up absolute inset-0 z-30 flex flex-col bg-white">
      <div className="flex h-14 shrink-0 items-center justify-end px-1">
        <button aria-label="닫기" onClick={onClose} className="grid size-11 place-items-center rounded-full active:bg-black/5">
          <X size={26} />
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-canvas text-(--brand)">
          <Lock size={26} />
        </span>
        <p className="mt-4 text-[22px] font-bold">{title}</p>
        {subtitle && <div className="mt-1 text-[16px] text-sub">{subtitle}</div>}
      </div>
      <SecureKeypad {...keypad} />
    </div>
  )
}
