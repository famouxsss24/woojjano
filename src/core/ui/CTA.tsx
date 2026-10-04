import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { target?: string; variant?: 'brand' | 'soft' }

/** 화면의 주 행동 버튼 */
export function CTA({ target, variant = 'brand', className = '', children, ...rest }: Props) {
  const tone = variant === 'brand' ? 'bg-(--brand) text-(--brand-ink)' : 'bg-canvas text-ink'
  return (
    <button
      data-target={target}
      className={`h-14 w-full rounded-2xl text-[18px] font-bold transition-[filter] active:brightness-95 disabled:bg-gray-200 disabled:text-gray-400 ${tone} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

/** 화면 맨 아래에 붙는 버튼 영역 */
export function BottomBar({ children }: { children: ReactNode }) {
  return <div className="shrink-0 bg-white px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.05)]">{children}</div>
}
