import { ReactNode } from "react";

export default function CategoryItem({
  children,
  text,
}: {
  children: ReactNode;
  text?: string;
}) {
  return (
    <span className="flex flex-row gap-1">
      {children}
      {text && (
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFFFFF",
          }}
        >
          {text}
        </p>
      )}
    </span>
  );
}
