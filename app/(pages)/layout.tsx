"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import BottomSheet, {
  BottomSheetHeight,
} from "../ui/templates/bottom-sheet/body";

import { SessionProvider } from "next-auth/react";
import SmallLoading from "../ui/loading/small";

// INTERFACES
interface BottomSheetContext {
  children: ReactNode;
  location: BottomSheetHeight;
  setter: (input: Partial<BottomSheetContext>) => void;
  header?: boolean;
  setHeader: null | ((input: boolean) => void);
}

export interface GlobalContext {
  bodyWidth: number;
  bodyHeight: number;

  isSmallLoadingOn: boolean;
  setSmallLoading: () => void;

  bottomSheet: BottomSheetContext;
}
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
    setter: () => {},
    header: true,
    setHeader: null,
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
  globalState.bottomSheet.setter = (input: Partial<BottomSheetContext>) => {
    globalState.bottomSheet = { ...globalState.bottomSheet, ...input };
    setGlobalState({ ...globalState });
  };
  globalState.bottomSheet.setHeader = (input: boolean) => {
    globalState.bottomSheet.header = input;
    globalState.bottomSheet = { ...globalState.bottomSheet };
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
    <SessionProvider>
      <globalContext.Provider value={globalState}>
        {children}
        <SmallLoading isTurnedOn={globalState.isSmallLoadingOn} />
        <BottomSheet
          width={width}
          height={height}
          pullUp={globalState.bottomSheet.location}
          header={globalState.bottomSheet.header}
        >
          {globalState.bottomSheet.children}
        </BottomSheet>
      </globalContext.Provider>
    </SessionProvider>
  );
}
export default GlobalLayout;
