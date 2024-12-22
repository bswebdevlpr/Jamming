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

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(document.body.offsetWidth);
    setHeight(document.body.offsetHeight);

    // BOTTOM SHEET
    const handleBottomSheet = (input: Partial<BottomSheetContext>) => {
      globalState.bottomSheet = { ...globalState.bottomSheet, ...input };
      setGlobalState({ ...globalState });
    };
    globalState.bottomSheet.setter = handleBottomSheet;
    //
  }, []);
  //

  return (
    <globalContext.Provider value={globalState}>
      {children}
      <BottomSheet
        width={width}
        height={height}
        pullUp={globalState.bottomSheet.location}
      >
        {globalState.bottomSheet.children}
      </BottomSheet>
    </globalContext.Provider>
  );
}
export default GlobalLayout;
