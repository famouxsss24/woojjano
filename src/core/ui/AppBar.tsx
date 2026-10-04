import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, X } from 'lucide-react'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { label: string; target?: string }

export function IconButton({ label, target, className = '', children, ...rest }: IconButtonProps) {
  return (
    <button aria-label={label} data-target={target} className={`grid size-11 shrink-0 place-items-center rounded-full active:bg-black/5 ${className}`} {...rest}>
      {children}
    </button>
  )
}

type AppBarProps = {
  title?: ReactNode
  /** false면 뒤로 버튼을 숨긴다 */
  back?: boolean
  /** 'close'면 ✕ 아이콘 */
  backIcon?: 'back' | 'close'
  onBack?: () => void
  backTarget?: string
  right?: ReactNode
  tone?: 'plain' | 'brand' | 'canvas' | 'clear'
}

const TONE = {
  plain: 'bg-white text-ink',
  canvas: 'bg-canvas text-ink',
  brand: 'bg-(--brand) text-(--brand-ink)',
  clear: 'bg-transparent text-ink',
}

export function AppBar({ title, back = true, backIcon = 'back', onBack, backTarget, right, tone = 'plain' }: AppBarProps) {
  const navigate = useNavigate()
  return (
    <div className={`relative flex h-14 shrink-0 items-center px-1 ${TONE[tone]}`}>
      {back && (
        <IconButton label={backIcon === 'close' ? '닫기' : '뒤로'} target={backTarget} onClick={onBack ?? (() => navigate(-1))}>
          {backIcon === 'close' ? <X size={26} /> : <ChevronLeft size={30} />}
        </IconButton>
      )}
      {title != null && <h1 className="pointer-events-none absolute inset-x-14 truncate text-center text-[18px] font-bold">{title}</h1>}
      <div className="ml-auto flex items-center">{right}</div>
    </div>
  )
}
