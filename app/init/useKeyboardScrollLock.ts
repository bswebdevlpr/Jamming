import { useEffect } from "react";

/**
 * 모바일 환경에서 가상 키보드가 나타났다가 사라진 후,
 * 의도치 않은 스크롤이 발생하는 것을 방지하는 훅입니다.
 *
 * input 또는 textarea 요소에서 포커스가 해제되면(focusout),
 * 화면 스크롤을 최상단(0, 0)으로 강제 이동시킵니다.
 */
export function useKeyboardScrollLock() {
  useEffect(() => {
    const handleFocusOut = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      // input 또는 textarea에서 포커스가 벗어날 때만 동작
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        // 키보드가 완전히 사라진 후 스크롤을 조절하기 위해 짧은 지연 시간을 줍니다.
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      }
    };

    // focusout 이벤트는 버블링되므로 window에 리스너를 추가합니다.
    window.addEventListener("focusout", handleFocusOut);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다.
    return () => {
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []); // 이 effect는 컴포넌트 마운트 시 한 번만 실행됩니다.
}
