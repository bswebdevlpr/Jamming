import WorkSpace from "@/app/ui/layouts/workspace";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <WorkSpace>{children}</WorkSpace>;
}
