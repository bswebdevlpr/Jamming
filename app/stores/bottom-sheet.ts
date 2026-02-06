"use client";

import { create } from "zustand";
import { ReactNode } from "react";
import { BottomSheetHeight } from "@/app/ui/templates/bottom-sheet/body";

interface BottomSheetState {
  children: ReactNode;
  location: BottomSheetHeight;
  header: boolean;
}

interface BottomSheetActions {
  set: (input: Partial<BottomSheetState>) => void;
  setHeader: (input: boolean) => void;
  close: () => void;
}

export const useBottomSheetStore = create<BottomSheetState & BottomSheetActions>(
  (zustandSet) => ({
    children: null,
    location: null,
    header: false,

    set: (input) => zustandSet((state) => ({ ...state, ...input })),
    setHeader: (header) => zustandSet({ header }),
    close: () => zustandSet({ children: null, location: null, header: false }),
  })
);
