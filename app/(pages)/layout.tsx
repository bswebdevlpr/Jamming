"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import BottomSheet from "../ui/templates/bottom-sheet/body";

import SmallLoading from "../ui/loading/small";
import {
  BottomSheetContext,
  GlobalContext,
  UserProfile,
} from "../lib/interfaces/global.interface";

// INTERFACES
//

// CONTEXTS
const defaultContext: GlobalContext = {
  bodyWidth: 0,
  bodyHeight: 0,

  isSmallLoadingOn: false,
  setSmallLoading: () => {},

  bottomSheet: {
    children: null,
    location: null,
    set: () => {},
    header: true,
    setHeader: null,
  },

  session: {
    userProfile: {
      isLoaded: undefined,
      acceptMarketing: undefined,
      profileImage: undefined,
      nickname: undefined,
      tags: undefined,
      position: undefined,
      genre: undefined,
      level: undefined,
      location: undefined,
    },
    setUserProfile: () => {},
  },
};
export const globalContext = createContext<GlobalContext>(defaultContext);
// CONTEXTS

function GlobalLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // INIT
  const [globalState, setGlobalState] = useState<GlobalContext>(defaultContext);

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
  }, []);
  //

  return (
    <globalContext.Provider value={globalState}>
      {children}
      <SmallLoading isTurnedOn={globalState.isSmallLoadingOn} />
      <BottomSheet
        width={width}
        height={height}
        pullUp={globalState.bottomSheet.location}
        header={globalState.bottomSheet.header}>
        {globalState.bottomSheet.children}
      </BottomSheet>
    </globalContext.Provider>
  );
}
export default GlobalLayout;
