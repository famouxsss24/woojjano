import { useNavigate } from 'react-router'
import { CircleUserRound } from 'lucide-react'
import { PRACTICE } from '../../../core/config'
import { CTA } from '../../../core/ui/CTA'
import { railActions, useRail } from '../store'
import { RailHeader, RailTabs } from '../ui'

export default function RailMy() {
  const loggedIn = useRail((s) => s.loggedIn)
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col bg-canvas">
      <RailHeader title="마이" />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <section className="flex flex-col items-center rounded-3xl bg-white px-5 py-10 text-center">
          <CircleUserRound size={56} className="text-faint" strokeWidth={1.4} />
          {loggedIn ? (
            <>
              <p className="mt-4 text-[22px] font-bold">{PRACTICE.userName}님</p>
              <p className="mt-1 text-[16px] text-sub">KW레일 회원</p>
              <CTA variant="soft" className="mt-6" onClick={railActions.logout}>
                로그아웃
              </CTA>
            </>
          ) : (
            <>
              <p className="mt-4 text-[20px] font-bold">로그인이 필요해요</p>
              <p className="mt-1 text-[16px] text-sub">기차표를 사려면 로그인해야 해요</p>
              <CTA target="rail-login" className="mt-6" onClick={() => navigate('/rail/login')}>
                로그인
              </CTA>
            </>
          )}
        </section>
      </main>
      <RailTabs active="my" />
    </div>
  )
}
