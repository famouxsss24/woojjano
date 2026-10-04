/** 연습용 가게·메뉴·주소. 가게 이름은 모두 지어낸 것이다. */
export type Choice = { id: string; name: string; price: number }
export type OptionGroup = { id: string; name: string; required: boolean; multi?: boolean; choices: Choice[] }
export type Menu = { id: string; name: string; price: number; emoji: string; desc: string; popular?: boolean; options?: OptionGroup[] }
export type Shop = { id: string; cat: string; name: string; emoji: string; rating: number; reviews: number; minOrder: number; tip: number; eta: string; menus: Menu[] }
export type Address = { road: string; jibun: string; building: string }

export const CATEGORIES = [
  { id: 'korean', name: '한식', emoji: '🍚' },
  { id: 'chinese', name: '중식', emoji: '🥟' },
  { id: 'chicken', name: '치킨', emoji: '🍗' },
  { id: 'pizza', name: '피자', emoji: '🍕' },
  { id: 'snack', name: '분식', emoji: '🍢' },
  { id: 'soup', name: '국밥', emoji: '🍲' },
  { id: 'jokbal', name: '족발·보쌈', emoji: '🥩' },
  { id: 'cafe', name: '카페·디저트', emoji: '☕' },
]

export const categoryName = (id: string) => CATEGORIES.find((c) => c.id === id)?.name ?? ''

const size = (extra: number): OptionGroup => ({ id: 'size', name: '양 선택', required: true, choices: [{ id: 'reg', name: '보통', price: 0 }, { id: 'big', name: '곱빼기', price: extra }] })
const spicy: OptionGroup = { id: 'spicy', name: '맵기 선택', required: true, choices: [{ id: 'mild', name: '순한맛', price: 0 }, { id: 'mid', name: '보통맛', price: 0 }, { id: 'hot', name: '매운맛', price: 0 }] }
const rice: OptionGroup = { id: 'rice', name: '추가 선택', required: false, multi: true, choices: [{ id: 'rice', name: '공기밥 추가', price: 1000 }, { id: 'egg', name: '계란 추가', price: 500 }] }
const chickenPart: OptionGroup = { id: 'part', name: '부위 선택', required: true, choices: [{ id: 'whole', name: '한 마리', price: 0 }, { id: 'boneless', name: '순살', price: 2000 }, { id: 'leg', name: '다리만', price: 3000 }] }
const chickenAdd: OptionGroup = { id: 'add', name: '추가 선택', required: false, multi: true, choices: [{ id: 'cola', name: '콜라 1.25L', price: 2500 }, { id: 'radish', name: '치킨무 추가', price: 500 }, { id: 'cheese', name: '치즈볼 5개', price: 4000 }] }
const sauce: OptionGroup = { id: 'sauce', name: '소스 선택', required: true, choices: [{ id: 'pour', name: '부먹 (소스 부어서)', price: 0 }, { id: 'dip', name: '찍먹 (소스 따로)', price: 0 }] }
const pizzaSize: OptionGroup = { id: 'psize', name: '크기 선택', required: true, choices: [{ id: 'm', name: 'M (2~3인)', price: 0 }, { id: 'l', name: 'L (3~4인)', price: 5000 }] }
const drink: OptionGroup = { id: 'temp', name: '온도 선택', required: true, choices: [{ id: 'ice', name: '아이스', price: 0 }, { id: 'hot', name: '따뜻하게', price: 0 }] }

export const SHOPS: Shop[] = [
  { id: 'mom', cat: 'korean', name: '엄마손 백반', emoji: '🍚', rating: 4.9, reviews: 1284, minOrder: 10000, tip: 2000, eta: '25~40분', menus: [
    { id: 'kimchi-jjigae', name: '김치찌개 정식', price: 9000, emoji: '🥘', desc: '돼지고기 듬뿍, 반찬 4가지', popular: true, options: [spicy, rice] },
    { id: 'doenjang', name: '된장찌개 정식', price: 8500, emoji: '🍲', desc: '구수한 집된장', options: [rice] },
    { id: 'jeyuk', name: '제육볶음 정식', price: 10000, emoji: '🍖', desc: '불맛 나는 제육', options: [spicy, rice] },
    { id: 'gyeranmari', name: '계란말이', price: 6000, emoji: '🍳', desc: '반찬으로 좋아요' },
  ] },
  { id: 'kalguksu', cat: 'korean', name: '할매 손칼국수', emoji: '🍜', rating: 4.8, reviews: 652, minOrder: 12000, tip: 1500, eta: '30~45분', menus: [
    { id: 'kalguksu', name: '바지락 칼국수', price: 8000, emoji: '🍜', desc: '직접 민 면', popular: true, options: [size(1000)] },
    { id: 'sujebi', name: '수제비', price: 8000, emoji: '🥣', desc: '쫄깃한 손수제비', options: [size(1000)] },
    { id: 'mandu', name: '왕만두 (5개)', price: 6000, emoji: '🥟', desc: '고기·김치 반반' },
  ] },
  { id: 'wolgye', cat: 'chinese', name: '월계반점', emoji: '🥢', rating: 4.8, reviews: 2210, minOrder: 12000, tip: 2000, eta: '20~35분', menus: [
    { id: 'jjajang', name: '짜장면', price: 7000, emoji: '🍝', desc: '옛날 짜장', popular: true, options: [size(1000)] },
    { id: 'jjamppong', name: '짬뽕', price: 9000, emoji: '🍜', desc: '해물 가득', popular: true, options: [size(1000), spicy] },
    { id: 'tangsuyuk', name: '탕수육 (소)', price: 16000, emoji: '🍤', desc: '바삭한 찹쌀 탕수육', options: [sauce] },
    { id: 'fried-rice', name: '볶음밥', price: 8000, emoji: '🍛', desc: '짜장 소스 같이 드려요' },
  ] },
  { id: 'great-wall', cat: 'chinese', name: '만리장성', emoji: '🏯', rating: 4.6, reviews: 873, minOrder: 15000, tip: 1000, eta: '30~45분', menus: [
    { id: 'gan-jjajang', name: '간짜장', price: 8000, emoji: '🍝', desc: '즉석에서 볶은 짜장', options: [size(1000)] },
    { id: 'jjamppong-bap', name: '짬뽕밥', price: 9500, emoji: '🍲', desc: '밥 말아 먹는 짬뽕', options: [spicy] },
    { id: 'mapa', name: '마파두부밥', price: 9000, emoji: '🍛', desc: '부드러운 두부' },
  ] },
  { id: 'crispy', cat: 'chicken', name: '바삭치킨 월계점', emoji: '🍗', rating: 4.9, reviews: 3105, minOrder: 18000, tip: 3000, eta: '35~50분', menus: [
    { id: 'fried', name: '후라이드 치킨', price: 19000, emoji: '🍗', desc: '겉바속촉', popular: true, options: [chickenPart, chickenAdd] },
    { id: 'yangnyeom', name: '양념 치킨', price: 20000, emoji: '🍗', desc: '달콤 매콤', popular: true, options: [chickenPart, chickenAdd] },
    { id: 'half', name: '반반 치킨', price: 20000, emoji: '🍗', desc: '후라이드 반 + 양념 반', options: [chickenPart, chickenAdd] },
  ] },
  { id: 'old-chicken', cat: 'chicken', name: '옛날통닭', emoji: '🐔', rating: 4.7, reviews: 1022, minOrder: 15000, tip: 2000, eta: '30~45분', menus: [
    { id: 'tongdak', name: '옛날 통닭 (한 마리)', price: 15000, emoji: '🐔', desc: '시장 통닭 그 맛', popular: true, options: [chickenAdd] },
    { id: 'tongdak2', name: '옛날 통닭 (두 마리)', price: 27000, emoji: '🐔', desc: '넉넉하게', options: [chickenAdd] },
  ] },
  { id: 'dough', cat: 'pizza', name: '도우피자', emoji: '🍕', rating: 4.7, reviews: 784, minOrder: 15000, tip: 2000, eta: '35~50분', menus: [
    { id: 'combi', name: '콤비네이션 피자', price: 17000, emoji: '🍕', desc: '이것저것 다 들어간', popular: true, options: [pizzaSize] },
    { id: 'bulgogi', name: '불고기 피자', price: 18000, emoji: '🍕', desc: '달달한 불고기', options: [pizzaSize] },
    { id: 'potato', name: '포테이토 피자', price: 18000, emoji: '🥔', desc: '감자가 듬뿍', options: [pizzaSize] },
  ] },
  { id: 'school', cat: 'snack', name: '학교앞 분식', emoji: '🍢', rating: 4.8, reviews: 1530, minOrder: 10000, tip: 2000, eta: '20~35분', menus: [
    { id: 'tteokbokki', name: '떡볶이', price: 5000, emoji: '🌶️', desc: '쌀떡 떡볶이', popular: true, options: [spicy] },
    { id: 'gimbap', name: '야채 김밥', price: 3500, emoji: '🍙', desc: '한 줄' },
    { id: 'sundae', name: '순대', price: 5000, emoji: '🌭', desc: '간·허파 같이 드려요' },
    { id: 'eomuk', name: '어묵탕', price: 4500, emoji: '🍢', desc: '뜨끈한 국물' },
  ] },
  { id: 'gukbap', cat: 'soup', name: '순대국밥 한그릇', emoji: '🍲', rating: 4.9, reviews: 942, minOrder: 9000, tip: 1500, eta: '25~40분', menus: [
    { id: 'sundaeguk', name: '순대국밥', price: 9000, emoji: '🍲', desc: '진한 사골 국물', popular: true, options: [size(2000)] },
    { id: 'dwaeji', name: '돼지국밥', price: 9500, emoji: '🍲', desc: '부산식', options: [size(2000)] },
    { id: 'haejang', name: '뼈해장국', price: 10000, emoji: '🍖', desc: '푸짐한 뼈', options: [spicy] },
  ] },
  { id: 'jokbal', cat: 'jokbal', name: '옛날 족발집', emoji: '🥩', rating: 4.8, reviews: 611, minOrder: 25000, tip: 3000, eta: '40~55분', menus: [
    { id: 'jokbal-m', name: '족발 (중)', price: 33000, emoji: '🥩', desc: '2~3인분', popular: true },
    { id: 'bossam-m', name: '보쌈 (중)', price: 31000, emoji: '🥬', desc: '김치 같이 드려요' },
  ] },
  { id: 'woojjano', cat: 'cafe', name: '카페 우짜노', emoji: '☕', rating: 4.9, reviews: 388, minOrder: 8000, tip: 2000, eta: '20~30분', menus: [
    { id: 'americano', name: '아메리카노', price: 3500, emoji: '☕', desc: '고소한 원두', popular: true, options: [drink] },
    { id: 'yuja', name: '유자차', price: 4500, emoji: '🍋', desc: '달콤한 유자', options: [drink] },
    { id: 'misutgaru', name: '미숫가루', price: 4500, emoji: '🥛', desc: '든든한 한 잔' },
    { id: 'castella', name: '카스테라', price: 5000, emoji: '🍰', desc: '부드러운 빵' },
  ] },
]

export const findShop = (id: string | undefined) => SHOPS.find((s) => s.id === id)

/** 주소 검색 연습용 (가상 건물 이름) */
export const ADDRESSES: Address[] = [
  { road: '서울 노원구 광운로 20', jibun: '월계동 447-1', building: '광운대학교' },
  { road: '서울 노원구 광운로 12', jibun: '월계동 440-3', building: '광운 햇살빌라' },
  { road: '서울 노원구 석계로 98', jibun: '월계동 410', building: '월계 행복아파트' },
  { road: '서울 노원구 석계로 104', jibun: '월계동 412-5', building: '월계동 경로당' },
  { road: '서울 노원구 월계로 372', jibun: '월계동 52', building: '월계 푸른마을' },
  { road: '서울 노원구 동일로 1390', jibun: '상계동 700', building: '노원 새솔빌딩' },
]

export const DEFAULT_ADDRESS = { ...ADDRESSES[3], detail: '1층', label: '우리집' }
