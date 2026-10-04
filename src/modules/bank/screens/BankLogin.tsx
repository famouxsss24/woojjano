import { Navigate, useNavigate } from 'react-router'
import { PRACTICE } from '../../../core/config'
import { SecureKeypad } from '../../../core/ui/SecureKeypad'
import { bankActions, useBank } from '../store'
import { BankLogo } from '../ui'

export default function BankLogin() {
  const loggedIn = useBank((s) => s.loggedIn)
  const navigate = useNavigate()
  if (loggedIn) return <Navigate to="/bank/home" replace />

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <BankLogo size="lg" />
        <p className="mt-8 text-[22px] font-bold">{PRACTICE.userName}님, 반가워요</p>
        <p className="mt-1 text-[17px] text-sub">간편비밀번호 6자리를 눌러 주세요</p>
      </div>
      <SecureKeypad
        length={6}
        answer={PRACTICE.simplePin}
        onSuccess={() => {
          bankActions.login()
          navigate('/bank/home', { replace: true })
        }}
      />
    </div>
  )
}
