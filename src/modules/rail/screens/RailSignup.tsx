import { useLocation, useNavigate } from 'react-router'
import { emit } from '../../../core/mission/missionStore'
import { PhoneVerification } from '../../../core/flows/PhoneVerification'
import { AppBar } from '../../../core/ui/AppBar'

export default function RailSignup() {
  const navigate = useNavigate()
  const { state } = useLocation()
  return (
    <div className="flex h-full flex-col bg-white">
      <AppBar title="회원가입" />
      <PhoneVerification
        sender="KW레일"
        onVerified={() => {
          navigate('/rail/signup/done', { replace: true, state })
          emit('rail.signup.done')
        }}
      />
    </div>
  )
}
