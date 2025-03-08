import { ReactNode } from "react";

export const GridItem_PlayList = ({
  title,
  author,
  created_at,
}: {
  title: string;
  author: string;
  created_at: string;
}) => {
  return (
    <div className="flex flex-col">
      <div
        style={{
          width: "100%",
          height: "100px",

          backgroundColor: "pink",

          marginBottom: "8px",
        }}
      >
        이미지
      </div>
      <p
        style={{
          width: "100%",

          color: "#FFF",
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          lineHeight: "150%",

          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        {title}
      </p>
      <p
        style={{
          color: "#767678",
          fontFamily: "SUIT-TITLE",
          fontSize: "0.75rem",
          lineHeight: "150%",

          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        {author} •{" "}
        <span
          style={{
            fontSize: "0.625rem",
          }}
        >
          {created_at}
        </span>
      </p>
    </div>
  );
};

export const Grid_PlayList = ({ children }: { children: ReactNode }) => {
  return <div className="grid grid-cols-2 gap-x-4 gap-y-6">{children}</div>;
};
