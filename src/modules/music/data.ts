/** 연습용 영상 목록. 노래 제목·가수만 쓰고 실제 영상·음원은 없다(재생은 흉내만). */
export type Video = { id: string; title: string; artist: string; channel: string; views: string; ago: string; seconds: number; emoji: string; bg: string }

export const VIDEOS: Video[] = [
  { id: 'v1', title: '사랑은 늘 도망가', artist: '임영웅', channel: 'KW뮤직 트로트', views: '조회수 1.2억회', ago: '4년 전', seconds: 247, emoji: '🎤', bg: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)' },
  { id: 'v2', title: '이제 나만 믿어요', artist: '임영웅', channel: 'KW뮤직 트로트', views: '조회수 9,800만회', ago: '5년 전', seconds: 236, emoji: '🎙️', bg: 'linear-gradient(135deg,#d4fc79,#96e6a1)' },
  { id: 'v3', title: '별빛 같은 나의 사랑아', artist: '임영웅', channel: 'KW뮤직 트로트', views: '조회수 7,100만회', ago: '5년 전', seconds: 221, emoji: '✨', bg: 'linear-gradient(135deg,#30cfd0,#330867)' },
  { id: 'v4', title: '테스형!', artist: '나훈아', channel: 'KW뮤직 가요', views: '조회수 4,300만회', ago: '6년 전', seconds: 212, emoji: '🎸', bg: 'linear-gradient(135deg,#f6d365,#fda085)' },
  { id: 'v5', title: '고향역', artist: '나훈아', channel: 'KW뮤직 가요', views: '조회수 1,200만회', ago: '8년 전', seconds: 198, emoji: '🚉', bg: 'linear-gradient(135deg,#fddb92,#d1fdff)' },
  { id: 'v6', title: '가인이어라', artist: '송가인', channel: 'KW뮤직 트로트', views: '조회수 2,600만회', ago: '6년 전', seconds: 205, emoji: '🌺', bg: 'linear-gradient(135deg,#ff9a9e,#fecfef)' },
  { id: 'v7', title: '동백 아가씨', artist: '이미자', channel: 'KW뮤직 가요', views: '조회수 900만회', ago: '9년 전', seconds: 189, emoji: '🌹', bg: 'linear-gradient(135deg,#f093fb,#f5576c)' },
  { id: 'v8', title: '바람의 노래', artist: '조용필', channel: 'KW뮤직 가요', views: '조회수 1,800만회', ago: '7년 전', seconds: 261, emoji: '🍃', bg: 'linear-gradient(135deg,#84fab0,#8fd3f4)' },
  { id: 'v9', title: '신사동 그 사람', artist: '주현미', channel: 'KW뮤직 가요', views: '조회수 1,100만회', ago: '8년 전', seconds: 203, emoji: '🌃', bg: 'linear-gradient(135deg,#667eea,#764ba2)' },
  { id: 'v10', title: '어머나', artist: '장윤정', channel: 'KW뮤직 트로트', views: '조회수 3,000만회', ago: '9년 전', seconds: 194, emoji: '💃', bg: 'linear-gradient(135deg,#ffecd2,#fcb69f)' },
  { id: 'v11', title: '님과 함께', artist: '남진', channel: 'KW뮤직 가요', views: '조회수 1,500만회', ago: '8년 전', seconds: 181, emoji: '🏡', bg: 'linear-gradient(135deg,#43e97b,#38f9d7)' },
  { id: 'v12', title: '아모르 파티', artist: '김연자', channel: 'KW뮤직 트로트', views: '조회수 5,200만회', ago: '7년 전', seconds: 216, emoji: '🎉', bg: 'linear-gradient(135deg,#fa709a,#fee140)' },
]

export const findVideo = (id: string | undefined) => VIDEOS.find((v) => v.id === id)

export const POPULAR_SEARCHES = ['임영웅', '나훈아', '송가인', '트로트 모음']

export function searchVideos(q: string): Video[] {
  const s = q.replace(/\s/g, '')
  if (!s) return []
  if (s.includes('트로트')) return VIDEOS.filter((v) => v.channel.includes('트로트'))
  return VIDEOS.filter((v) => `${v.artist}${v.title}`.replace(/\s/g, '').includes(s))
}

/** 3:05 형식 */
export const duration = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`
