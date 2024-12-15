"use client";

import { createContext, ReactNode, useState } from "react";
import BottomSheet, { BottomSheetLocation } from "../ui/bottom-sheet/body";

export interface BottomSheetContext {
  location: BottomSheetLocation;
  content: ReactNode;
  handler: null | ((input: Omit<BottomSheetContext, "handler">) => void);
}

export interface GlobalContext {
  bottomSheet: BottomSheetContext;
}
const defaultContext: GlobalContext = {
  bottomSheet: {
    location: null,
    content: null,
    handler: null,
  },
};

export const globalContext = createContext<GlobalContext>(defaultContext);

function GlobalLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [globalState, setGlobalState] = useState<GlobalContext>(defaultContext);

  const handleBottomSheet = (input: Omit<BottomSheetContext, "handler">) => {
    globalState.bottomSheet = { ...globalState.bottomSheet, ...input };
    setGlobalState({ ...globalState });
  };
  globalState.bottomSheet.handler = handleBottomSheet;

  return (
    <globalContext.Provider value={globalState}>
      {children}
      <BottomSheet pullUp={globalState.bottomSheet.location}>
        {globalState.bottomSheet.content}
      </BottomSheet>
    </globalContext.Provider>
  );
}
export default GlobalLayout;
