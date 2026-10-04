import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sessionJSON } from '../../core/persist'
import { uid } from '../../core/format'
import { RECENT_PAYEES, START_BALANCE, seedTxs, type Payee, type Tx } from './data'

type Draft = { payee: Payee | null; isNew: boolean; amount: number }
export type Transfer = { payee: Payee; amount: number; isNew: boolean; balance: number }

type BankState = {
  loggedIn: boolean
  balance: number
  txs: Tx[]
  /** 새 계좌 입력 칸 (도움말이 진행 상황을 볼 수 있게 스토어에 둔다) */
  form: { bank: string | null; account: string }
  draft: Draft
  last: Transfer | null
}

const EMPTY_DRAFT: Draft = { payee: null, isNew: false, amount: 0 }

const initial = (): BankState => ({
  loggedIn: false,
  balance: START_BALANCE,
  txs: seedTxs(),
  form: { bank: null, account: '' },
  draft: EMPTY_DRAFT,
  last: null,
})

export const useBank = create<BankState>()(persist(initial, { name: 'wz.bank', storage: sessionJSON }))

export const bankActions = {
  reset: () => useBank.setState(initial()),
  login: () => useBank.setState({ loggedIn: true }),
  setForm: (form: Partial<BankState['form']>) => useBank.setState((s) => ({ form: { ...s.form, ...form } })),
  pickPayee: (payee: Payee) => {
    const isNew = !RECENT_PAYEES.some((p) => p.bank === payee.bank && p.account === payee.account)
    useBank.setState({ draft: { payee, isNew, amount: 0 } })
  },
  setAmount: (amount: number) => useBank.setState((s) => ({ draft: { ...s.draft, amount } })),
  cancel: () => useBank.setState({ draft: EMPTY_DRAFT, form: { bank: null, account: '' } }),
  /** 이체 실행. 조건이 안 맞으면 null */
  send: (): Transfer | null => {
    const { draft, balance, txs } = useBank.getState()
    if (!draft.payee || draft.amount <= 0 || draft.amount > balance) return null
    const next = balance - draft.amount
    const transfer: Transfer = { payee: draft.payee, amount: draft.amount, isNew: draft.isNew, balance: next }
    useBank.setState({
      balance: next,
      txs: [{ id: uid(), at: Date.now(), label: draft.payee.name, amount: -draft.amount, balance: next }, ...txs],
      last: transfer,
      draft: EMPTY_DRAFT,
      form: { bank: null, account: '' },
    })
    return transfer
  },
}
