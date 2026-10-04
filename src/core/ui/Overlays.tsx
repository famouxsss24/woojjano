import type { ReactNode } from 'react'

/** 아래에서 올라오는 시트. 부모(화면 루트)를 기준으로 덮는다. */
export function BottomSheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      <button aria-label="닫기" className="animate-fade-in absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="animate-slide-up relative flex max-h-[88%] flex-col rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl">
        <div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-gray-200" />
        {title != null && <h2 className="shrink-0 px-6 pt-4 pb-2 text-[20px] font-bold">{title}</h2>}
        <div className="min-h-0 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

type DialogAction = { label: string; onClick: () => void; primary?: boolean; target?: string }

/** 가운데 확인 창 */
export function Dialog({ open, title, children, actions }: { open: boolean; title: ReactNode; children?: ReactNode; actions: DialogAction[] }) {
  if (!open) return null
  return (
    <div className="animate-fade-in absolute inset-0 z-40 grid place-items-center bg-black/45 px-6">
      <div role="dialog" aria-modal="true" className="animate-pop w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-[20px] leading-snug font-bold">{title}</h2>
        {children && <div className="mt-3 text-[16px] leading-relaxed text-sub">{children}</div>}
        <div className={`mt-6 grid gap-2 ${actions.length === 2 ? 'grid-cols-2' : ''}`}>
          {actions.map((a) => (
            <button
              key={a.label}
              data-target={a.target}
              onClick={a.onClick}
              className={`h-13 rounded-2xl text-[17px] font-bold ${a.primary ? 'bg-(--brand) text-(--brand-ink)' : 'bg-canvas text-ink'}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
