"use client";

import { createContext, ReactNode, useState } from "react";
import BottomSheet, { BottomSheetHeight } from "../ui/bottom-sheet/body";

export interface BottomSheetContext {
  location: BottomSheetHeight;
  children: ReactNode;
  setter: (input: Partial<BottomSheetContext>) => void;
}

export interface GlobalContext {
  bottomSheet: BottomSheetContext;
}
const defaultContext: GlobalContext = {
  bottomSheet: {
    location: null,
    children: null,
    setter: () => {},
  },
};

export const globalContext = createContext<GlobalContext>(defaultContext);

function GlobalLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [globalState, setGlobalState] = useState<GlobalContext>(defaultContext);

  const handleBottomSheet = (input: Partial<BottomSheetContext>) => {
    globalState.bottomSheet = { ...globalState.bottomSheet, ...input };
    setGlobalState({ ...globalState });
  };
  globalState.bottomSheet.setter = handleBottomSheet;

  return (
    <globalContext.Provider value={globalState}>
      {children}
      <BottomSheet pullUp={globalState.bottomSheet.location}>
        {globalState.bottomSheet.children}
      </BottomSheet>
    </globalContext.Provider>
  );
}
export default GlobalLayout;
