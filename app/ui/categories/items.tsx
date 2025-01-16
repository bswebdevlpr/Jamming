import { CSSProperties, ReactNode } from "react";

const CategoryFilterItem = ({
  children,
  text,
  className,
  style,
}: {
  children: ReactNode;
  text?: string;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <span
      className={`flex flex-row gap-1${className ? " " + className : ""}`}
      style={style}
    >
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
};

const CategoryTagItem = ({
  text,
  style,
}: {
  text: string;
  style?: CSSProperties;
}) => {
  return (
    <div
      className=""
      style={{
        padding: "2px 6px",
        borderRadius: "2px",

        backgroundColor: "#323234",

        fontFamily: "SUIT-BODY",
        fontSize: "0.75rem",
        color: "#F2F2F4",

        ...style,
      }}
    >
      {text}
    </div>
  );
};

export { CategoryFilterItem, CategoryTagItem };
