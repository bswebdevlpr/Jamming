"use client";

import { ReactNode, useEffect, useState, Suspense } from "react";
import BottomSheet from "../ui/templates/bottom-sheet/body";

import SmallLoading from "../ui/loading/small";
import {
  BottomSheetContext,
  GlobalContext,
  UserProfile,
} from "../lib/interfaces/global.interface";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import moment from "moment";
import { globalContext, initialContext } from "./context";
import _ from "lodash";
import FullScreenLoading from "../ui/loading/fullscreen";

// EXTERNAL PACKAGES
const queryClient = new QueryClient();
//

function GlobalLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // INIT
  const [globalState, setGlobalState] = useState<GlobalContext>(
    _.cloneDeep(initialContext)
  );

  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s 전",
      s: "방금",
      ss: "%d초",
      m: "1분",
      mm: "%d분",
      h: "1시간",
      hh: "%d시간",
      d: "1일",
      dd: "%d일",
      w: "한주",
      ww: "%d주",
      M: "한달",
      MM: "%d달",
      y: "1년",
      yy: "%d년",
    },
  });
  //

  // SMALL LOADING
  globalState.setSmallLoading = () => {
    globalState.isSmallLoadingOn = !globalState.isSmallLoadingOn;
    setGlobalState({ ...globalState });
  };
  //

  // BOTTOM SHEET
  globalState.bottomSheet.set = (input: Partial<BottomSheetContext>) => {
    globalState.bottomSheet = { ...globalState.bottomSheet, ...input };
    setGlobalState({ ...globalState });
  };
  globalState.bottomSheet.setHeader = (input: boolean) => {
    globalState.bottomSheet.header = input;
    globalState.bottomSheet = { ...globalState.bottomSheet };
  };
  //

  // USER PROFILE
  globalState.session.setUserProfile = (input: Partial<UserProfile>) => {
    globalState.session.userProfile = {
      ...globalState.session.userProfile,
      ...input,
    };
    globalState.session = { ...globalState.session };
  };
  //

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    // 브라우저 환경에서 뷰포트 높이(특히 모바일 환경에서 주소창 등으로 인해 변동되는 경우)를 정확하게 계산하여
    // CSS 변수(--vh)에 반영하고, body의 현재 너비와 높이를 상태 및 전역 상태로 저장한다.
    // 이로써 레이아웃이 다양한 디바이스와 화면 크기 변화(리사이즈)에 유연하게 대응할 수 있도록 한다.
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      };
      setVh();

      window.addEventListener("resize", setVh);

      const width = document.body.offsetWidth;
      const height = document.body.offsetHeight;

      setWidth(width);
      setHeight(height);

      setGlobalState({
        ...globalState,
        ...{
          bodyWidth: width,
          bodyHeight: height,
        },
      });

      // javascript 더블클릭 방지
      const preventDblClick = (e: MouseEvent) => {
        e.preventDefault();
      };
      document.addEventListener("dblclick", preventDblClick, {
        passive: false,
      });

      return () => {
        window.removeEventListener("resize", setVh);
        document.removeEventListener("dblclick", preventDblClick);
      };
    }
  }, []);
  //

  return (
    <globalContext.Provider value={globalState}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<FullScreenLoading />}>
          {children}
          <SmallLoading isTurnedOn={globalState.isSmallLoadingOn} />
          <BottomSheet
            width={width}
            height={height}
            pullUp={globalState.bottomSheet.location}
            setPullUp={globalState.bottomSheet.set}
            header={globalState.bottomSheet.header}
          >
            {globalState.bottomSheet.children}
          </BottomSheet>
        </Suspense>
      </QueryClientProvider>
    </globalContext.Provider>
  );
}
export default GlobalLayout;
