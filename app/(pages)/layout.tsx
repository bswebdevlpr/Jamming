"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import BottomSheet, {
  BottomSheetHeight,
} from "../ui/templates/bottom-sheet/body";

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
  bottomSheet: BottomSheetContext;
}
//

// CONTEXTS
const defaultContext: GlobalContext = {
  bodyWidth: 0,
  bodyHeight: 0,
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
    <globalContext.Provider value={globalState}>
      {children}
      <BottomSheet
        width={width}
        height={height}
        pullUp={globalState.bottomSheet.location}
        header={globalState.bottomSheet.header}
      >
        {globalState.bottomSheet.children}
      </BottomSheet>
    </globalContext.Provider>
  );
}
export default GlobalLayout;
