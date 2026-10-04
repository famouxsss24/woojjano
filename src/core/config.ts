/**
 * 연습용 고정값. 교육 현장에 맞게 바꿀 값은 여기서만 고친다.
 * 실제 개인정보·비밀번호는 절대 넣지 않는다.
 */
export const PRACTICE = {
  userName: '홍길동',
  /** 간편비밀번호·결제 비밀번호 (6자리) */
  simplePin: '123456',
  /** 계좌 비밀번호 (4자리) */
  accountPin: '1234',
  /** 인증번호 입력 제한 시간(초) */
  verifySeconds: 180,
  /** 기차표 결제 기한(초) */
  railPaySeconds: 600,
  /**
   * 지도의 '내 위치'. 교육 장소(경로당)로 바꾸려면 이 좌표와 함께
   * modules/map/data.ts 의 ROUTES(광운대 출발 기준 예시 경로)도 같이 고쳐야 한다.
   */
  here: { name: '광운대학교', lat: 37.6197648, lng: 127.0597566 },
} as const
