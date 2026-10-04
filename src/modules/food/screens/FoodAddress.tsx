import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { LocateFixed, MapPin, Search } from 'lucide-react'
import { emit } from '../../../core/mission/missionStore'
import { AppBar } from '../../../core/ui/AppBar'
import { BottomBar, CTA } from '../../../core/ui/CTA'
import { toast } from '../../../core/ui/toast'
import { ADDRESSES, DEFAULT_ADDRESS } from '../data'
import { foodActions, useFood } from '../store'

const LABELS = ['우리집', '회사', '기타']

export default function FoodAddress() {
  const draft = useFood((s) => s.addressDraft)
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [detail, setDetail] = useState('')
  const [label, setLabel] = useState(LABELS[0])

  // 화면을 떠나면 고르던 주소를 비운다
  useEffect(
    () => () => {
      foodActions.pickAddress(null)
    },
    [],
  )

  const q = text.trim()
  const results = q ? ADDRESSES.filter((a) => a.road.includes(q) || a.jibun.includes(q) || a.building.includes(q)) : []

  const save = () => {
    if (!draft || !detail.trim()) return
    foodActions.saveAddress({ ...draft, detail: detail.trim(), label })
    toast('주소를 설정했어요')
    navigate(-1)
    emit('food.address.set')
  }

  if (draft) {
    return (
      <div className="flex h-full flex-col bg-white">
        <AppBar title="상세 주소 입력" onBack={() => foodActions.pickAddress(null)} />
        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
          <div className="flex gap-3 rounded-2xl bg-canvas p-4">
            <MapPin className="mt-0.5 shrink-0 text-(--brand)" size={22} />
            <div>
              <p className="text-[18px] font-bold">{draft.building}</p>
              <p className="text-[15px] text-sub">{draft.road}</p>
              <p className="text-[14px] text-faint">지번 {draft.jibun}</p>
            </div>
          </div>
          <input
            data-target={detail.trim() ? undefined : 'addr-next'}
            autoFocus
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="상세주소 (예: 101동 202호, 1층)"
            className="mt-4 h-14 w-full rounded-xl bg-canvas px-4 text-[18px] outline-none focus:ring-2 focus:ring-(--brand)"
          />
          <p className="mt-2 text-[14px] text-faint">동·호수를 정확히 써야 음식이 제대로 와요</p>
          <p className="mt-6 mb-2 text-[15px] font-semibold text-sub">이 주소의 이름</p>
          <div className="flex gap-2">
            {LABELS.map((l) => (
              <button key={l} onClick={() => setLabel(l)} className={`h-11 rounded-full px-5 text-[16px] font-semibold ${l === label ? 'bg-ink text-white' : 'bg-canvas'}`}>
                {l}
              </button>
            ))}
          </div>
        </main>
        <BottomBar>
          <CTA target={detail.trim() ? 'addr-next' : undefined} disabled={!detail.trim()} onClick={save}>
            이 주소로 설정
          </CTA>
        </BottomBar>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <AppBar title="주소 설정" />
      <div className="shrink-0 px-5">
        <label className="flex h-14 items-center gap-2 rounded-2xl bg-canvas px-4">
          <Search size={20} className="text-faint" />
          <input
            data-target="addr-search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="길 이름이나 건물 이름 (예: 석계로)"
            className="min-w-0 flex-1 bg-transparent text-[17px] outline-none"
          />
        </label>
        <button onClick={() => foodActions.pickAddress(DEFAULT_ADDRESS)} className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-semibold active:bg-black/5">
          <LocateFixed size={20} /> 현재 위치로 찾기
        </button>
      </div>
      <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        {!q ? (
          <p className="pt-10 text-center text-[16px] leading-relaxed text-sub">
            도로명, 건물 이름, 동 이름으로 찾아보세요
            <br />
            예: 광운로, 석계로, 월계동
          </p>
        ) : results.length === 0 ? (
          <p className="pt-10 text-center text-[16px] text-sub">'{q}'(으)로 찾은 주소가 없어요</p>
        ) : (
          <ul className="grid gap-1 pt-2">
            {results.map((a, i) => (
              <li key={a.road}>
                <button data-target={`addr-result-${i}`} onClick={() => foodActions.pickAddress(a)} className="w-full rounded-2xl px-2 py-3 text-left active:bg-black/5">
                  <p className="text-[17px] font-bold">{a.building}</p>
                  <p className="text-[15px]">{a.road}</p>
                  <p className="text-[14px] text-faint">지번 {a.jibun}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
