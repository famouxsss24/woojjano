/** 도움말 조건용: 지금 화면에 이 data-target 요소가 있는지 (시트·창이 열렸는지 판단) */
export const onScreen = (target: string) => !!document.querySelector(`[data-target="${CSS.escape(target)}"]`)
