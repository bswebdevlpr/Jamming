"use client";

import { ReactNode, useEffect, useState } from "react";
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
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
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

      return () => window.removeEventListener("resize", setVh);
    }
  }, []);
  //

  return (
    <globalContext.Provider value={globalState}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </globalContext.Provider>
  );
}
export default GlobalLayout;
