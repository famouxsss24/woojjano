import type { CSSProperties } from 'react'
import type { PracticeModule } from '../mission/types'

/** 연습 앱마다 브랜드 색을 CSS 변수로 내려 준다 → 공통 부품이 bg-(--brand)로 색을 따라간다 */
export const brandStyle = (m: Pick<PracticeModule, 'color' | 'ink'>) => ({ '--brand': m.color, '--brand-ink': m.ink }) as CSSProperties
