import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { MODULES } from '../modules/registry'

export default function HomePage() {
  return (
    <div className="h-full overflow-y-auto bg-hub">
      <header className="px-6 pt-12 pb-7">
        <span className="rounded-full bg-practice px-3 py-1 text-[14px] font-extrabold">연습용 앱</span>
        <h1 className="mt-4 text-[30px] leading-tight font-extrabold">
          무엇을
          <br />
          연습해 볼까요?
        </h1>
      </header>

      <ul className="grid gap-3 px-4">
        {MODULES.map((m) => (
          <li key={m.id}>
            <Link
              to={`/m/${m.id}`}
              className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(60,40,20,0.06)] transition-transform active:scale-[0.98]"
            >
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl text-[34px]" style={{ background: `${m.color}1F` }}>
                {m.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[22px] font-bold">{m.name}</span>
                <span className="block text-[15px] text-sub">{m.summary}</span>
              </span>
              <ChevronRight className="shrink-0 text-faint" size={26} />
            </Link>
          </li>
        ))}
      </ul>

      <p className="px-7 pt-8 pb-12 text-[16px] leading-relaxed text-sub">
        여기서는 <b className="text-ink">무엇을 눌러도 괜찮아요.</b>
        <br />
        진짜 돈이 나가거나, 진짜로 예매·주문되지 않아요.
      </p>
    </div>
  )
}
