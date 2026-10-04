export type Friend = { id: string; name: string; emoji: string; status: string; color: string; group?: number }
export type Photo = { id: string; emoji: string; label: string; bg: string }
export type Msg = { id: string; from: 'me' | string; text?: string; photos?: string[]; at: number }

export const FRIENDS: Friend[] = [
  { id: 'daughter', name: '큰딸 미영', emoji: '👩', status: '항상 건강하세요 💕', color: '#F4A261' },
  { id: 'grandson', name: '손주 민준', emoji: '👦', status: '⚽ 축구왕', color: '#6FA8DC' },
  { id: 'son', name: '아들 철수', emoji: '👨', status: '', color: '#93C47D' },
  { id: 'friend', name: '박영자', emoji: '👵', status: '경로당 총무', color: '#C27BA0' },
]

/** 채팅방 목록에만 있는 단체방 */
export const GROUP: Friend = { id: 'group', name: '경로당 친구들', emoji: '👥', status: '', color: '#8E7CC3', group: 5 }

export const CHAT_ROOMS: Friend[] = [FRIENDS[0], FRIENDS[1], GROUP, FRIENDS[3], FRIENDS[2]]

export const findRoom = (id: string | undefined) => CHAT_ROOMS.find((r) => r.id === id)

/** 앨범 속 연습용 사진 (그림 대신 색 + 이모지) */
export const PHOTOS: Photo[] = [
  { id: 'p1', emoji: '🌸', label: '봄꽃 구경', bg: 'linear-gradient(135deg,#fbc2eb,#a6c1ee)' },
  { id: 'p2', emoji: '🎂', label: '손주 생일', bg: 'linear-gradient(135deg,#ffecd2,#fcb69f)' },
  { id: 'p3', emoji: '🥬', label: '김장하는 날', bg: 'linear-gradient(135deg,#d4fc79,#96e6a1)' },
  { id: 'p4', emoji: '🐶', label: '우리 강아지', bg: 'linear-gradient(135deg,#f6d365,#fda085)' },
  { id: 'p5', emoji: '⛰️', label: '등산', bg: 'linear-gradient(135deg,#84fab0,#8fd3f4)' },
  { id: 'p6', emoji: '🍲', label: '오늘 저녁', bg: 'linear-gradient(135deg,#fddb92,#d1fdff)' },
  { id: 'p7', emoji: '🌊', label: '바다 여행', bg: 'linear-gradient(135deg,#89f7fe,#66a6ff)' },
  { id: 'p8', emoji: '🍁', label: '단풍', bg: 'linear-gradient(135deg,#f093fb,#f5576c)' },
  { id: 'p9', emoji: '🌻', label: '해바라기', bg: 'linear-gradient(135deg,#fff1a8,#f9d423)' },
  { id: 'p10', emoji: '🎎', label: '설날', bg: 'linear-gradient(135deg,#ff9a9e,#fecfef)' },
  { id: 'p11', emoji: '🏞️', label: '공원 산책', bg: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)' },
  { id: 'p12', emoji: '🍉', label: '여름 수박', bg: 'linear-gradient(135deg,#43e97b,#38f9d7)' },
  { id: 'p13', emoji: '📸', label: '가족사진', bg: 'linear-gradient(135deg,#cfd9df,#e2ebf0)' },
  { id: 'p14', emoji: '🌙', label: '보름달', bg: 'linear-gradient(135deg,#30cfd0,#330867)' },
  { id: 'p15', emoji: '⛄', label: '첫눈', bg: 'linear-gradient(135deg,#e0eafc,#cfdef3)' },
]

export const findPhoto = (id: string) => PHOTOS.find((p) => p.id === id)

/** 상대가 보내는 답장 */
export const REPLIES: Record<string, string> = {
  daughter: '사진 잘 받았어요! 😊',
  grandson: '우와 고마워요 ❤️',
  son: '잘 받았습니다~',
  friend: '고마워~ 내일 경로당에서 봐!',
  group: '사진 좋네요 👍',
}

export function seedChats(now = Date.now()): Record<string, Msg[]> {
  const min = 60_000
  return {
    daughter: [
      { id: 'd1', from: 'daughter', text: '식사는 하셨어요?', at: now - 180 * min },
      { id: 'd2', from: 'me', text: '응 먹었다', at: now - 175 * min },
      { id: 'd3', from: 'daughter', text: '요즘 사진 찍으신 거 있으면 보내 주세요~', at: now - 30 * min },
    ],
    grandson: [{ id: 'g1', from: 'grandson', text: '할머니 할아버지 보고 싶어요!', at: now - 60 * 24 * min }],
    group: [{ id: 'r1', from: 'friend', text: '내일 10시 체조 있어요', at: now - 300 * min }],
    friend: [{ id: 'f1', from: 'friend', text: '오늘 날씨 좋네', at: now - 2 * 60 * 24 * min }],
    son: [],
  }
}
