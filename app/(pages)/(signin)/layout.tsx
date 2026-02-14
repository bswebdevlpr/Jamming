"use client";

import WorkSpace from "@/app/ui/layouts/workspace";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <WorkSpace>{children}</WorkSpace>;
}
