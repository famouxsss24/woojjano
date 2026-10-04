import { Delete } from 'lucide-react'

export function BankLogo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const lg = size === 'lg'
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`grid place-items-center rounded-xl bg-(--brand) font-black text-white ${lg ? 'size-14 text-[22px]' : 'size-8 text-[14px]'}`}>KW</span>
      <span className={`font-extrabold tracking-tight ${lg ? 'text-[26px]' : 'text-[19px]'}`}>KW뱅킹</span>
    </span>
  )
}

const PAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0']

/** 금액 입력용 숫자판 (보안 키패드와 달리 위치가 고정) */
export function NumberPad({ onDigit, onBackspace }: { onDigit: (d: string) => void; onBackspace: () => void }) {
  return (
    <div data-target="numpad" className="grid grid-cols-3">
      {PAD.map((k) => (
        <button key={k} onClick={() => onDigit(k)} className="h-15 text-[26px] font-semibold tabular-nums active:bg-black/5">
          {k}
        </button>
      ))}
      <button aria-label="지우기" onClick={onBackspace} className="grid h-15 place-items-center text-sub active:bg-black/5">
        <Delete size={28} />
      </button>
    </div>
  )
}
