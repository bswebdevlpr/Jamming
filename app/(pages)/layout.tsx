"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import BottomSheet, {
  BottomSheetHeight,
} from "../ui/templates/bottom-sheet/body";
import PopupTemplate from "../ui/templates/popup";

// INTERFACES
interface BottomSheetContext {
  children: ReactNode;
  location: BottomSheetHeight;
  setter: (input: Partial<BottomSheetContext>) => void;
  header?: boolean;
  setHeader: null | ((input: boolean) => void);
}

export interface GlobalContext {
  bottomSheet: BottomSheetContext;
}
//

// CONTEXTS
const defaultContext: GlobalContext = {
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
    setWidth(document.body.offsetWidth);
    setHeight(document.body.offsetHeight);
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
