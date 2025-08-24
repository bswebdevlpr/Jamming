"use client";

import { ReactNode } from "react";
import { useKeyboardScrollLock } from "./init/useKeyboardScrollLock";

export default function KeyboardScrollLockWrapper({
  children,
}: {
  children: ReactNode;
}) {
  useKeyboardScrollLock();
  return <>{children}</>;
}
