import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { ShieldAlert } from 'lucide-react'
import { PRACTICE } from '../../../core/config'
import { emit } from '../../../core/mission/missionStore'
import { won } from '../../../core/format'
import { AppBar } from '../../../core/ui/AppBar'
import { BottomBar } from '../../../core/ui/CTA'
import { Dialog } from '../../../core/ui/Overlays'
import { KeypadSheet } from '../../../core/ui/SecureKeypad'
import { toast } from '../../../core/ui/toast'
import { MY_ACCOUNT, formatAccount } from '../data'
import { bankActions, useBank } from '../store'

type Step = 'review' | 'phishing' | 'stopped' | 'pin'

export default function BankConfirm() {
  const draft = useBank((s) => s.draft)
  const hasLast = useBank((s) => s.last != null)
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('review')
  // 보내기 직후엔 draft가 비므로, 방금 끝난 이체가 있으면 완료 화면으로 보낸다 (홈으로 튕기는 경합 방지)
  if (!draft.payee || draft.amount <= 0) return <Navigate to={hasLast ? '/bank/transfer/done' : '/bank/home'} replace />

  const payee = draft.payee
  const goHome = () => navigate('/bank/home', { replace: true })

  const onPin = () => {
    const done = bankActions.send()
    if (!done) {
      toast('이체할 수 없어요. 처음부터 다시 해 주세요')
      goHome()
      return
    }
    navigate('/bank/transfer/done', { replace: true })
    emit('bank.transfer.done', { name: done.payee.name, bank: done.payee.bank, account: done.payee.account, amount: done.amount, isNew: done.isNew })
  }

  const rows: [string, string][] = [
    ['받는 분 계좌', `${payee.bank} ${formatAccount(payee.account)}`],
    ['받는 분에게 표시', PRACTICE.userName],
    ['내 통장에 표시', payee.name],
    ['출금 계좌', `${MY_ACCOUNT.bank} ${formatAccount(MY_ACCOUNT.account)}`],
    ['수수료', '면제'],
  ]

  return (
    <div className="relative flex h-full flex-col bg-white">
      <AppBar title="이체 확인" />
      <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        <h2 className="pt-4 text-[26px] leading-snug font-bold">
          <span className="text-(--brand)">{payee.name}</span>님에게
          <br />
          <span className="tabular-nums">{won(draft.amount)}</span>을
          <br />
          보낼까요?
        </h2>

        <dl className="mt-8 grid gap-4">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 text-[17px]">
              <dt className="shrink-0 text-sub">{k}</dt>
              <dd className="text-right font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex gap-3 rounded-2xl bg-amber-50 p-4">
          <ShieldAlert className="mt-0.5 shrink-0 text-amber-600" size={22} />
          <p className="text-[16px] leading-relaxed">
            <b>받는 분 이름이 맞는지 꼭 확인하세요.</b>
            <br />
            보낸 돈은 되돌리기 어려워요.
          </p>
        </div>
      </main>

      <BottomBar>
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <button onClick={goHome} className="h-14 rounded-2xl bg-canvas text-[18px] font-bold">
            취소
          </button>
          <button data-target="bank-send" onClick={() => setStep(draft.isNew ? 'phishing' : 'pin')} className="h-14 rounded-2xl bg-(--brand) text-[18px] font-bold text-white">
            보내기
          </button>
        </div>
      </BottomBar>

      {/* 처음 보내는 계좌면 실제 은행 앱처럼 금융사기 확인을 한 번 더 묻는다 */}
      <Dialog
        open={step === 'phishing'}
        title="처음 보내는 계좌예요"
        actions={[
          { label: '예', onClick: () => setStep('stopped') },
          { label: '아니요', onClick: () => setStep('pin'), primary: true, target: 'phishing-no' },
        ]}
      >
        혹시 누군가 <b className="text-ink">전화나 문자로 돈을 보내라고</b> 했나요?
      </Dialog>

      <Dialog
        open={step === 'stopped'}
        title="잠깐! 금융사기일 수 있어요"
        actions={[
          {
            label: '이체 그만두기',
            primary: true,
            onClick: () => {
              bankActions.cancel()
              goHome()
            },
          },
        ]}
      >
        가족·검찰·은행이라며 돈을 보내라고 하면 대부분 사기예요. 전화를 끊고 <b className="text-ink">112</b>에 신고하세요.
      </Dialog>

      <KeypadSheet open={step === 'pin'} title="계좌 비밀번호" subtitle="통장 비밀번호 4자리" length={4} answer={PRACTICE.accountPin} onClose={() => setStep('review')} onSuccess={onPin} />
    </div>
  )
}
