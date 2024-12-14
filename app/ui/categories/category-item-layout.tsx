import { ReactNode } from "react";

export default function CategoryItemLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <span className="flex flex-row gap-1 py-2">{children}</span>;
}
