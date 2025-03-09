"use client";

import moment from "moment";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";

export const GridItem_PlayList = ({
  thumbnailPath,
  title,
  author,
  created_at,
}: {
  thumbnailPath: string;
  title: string;
  author: string;
  created_at: string;
}) => {
  const [itemWidth, setItemWidth] = useState<number>(0);
  const [itemHeight, setItemHeight] = useState<number>(0);

  useEffect(() => {
    const width = document.body.offsetWidth;
    const height = document.body.offsetWidth;

    setItemWidth(width);
    setItemHeight(height * 0.1328);
  }, []);

  return (
    <div className="flex flex-col">
      <Image
        src={thumbnailPath}
        width={itemWidth / 2}
        height={itemHeight}
        alt="Image"
        className="mb-2"
      />
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
        }}>
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
        }}>
        {author} •{" "}
        <span
          style={{
            fontSize: "0.625rem",
          }}>
          {moment(created_at).fromNow()}
        </span>
      </p>
    </div>
  );
};

export const Grid_PlayList = ({ children }: { children: ReactNode }) => {
  return <div className="grid grid-cols-2 gap-x-4 gap-y-6">{children}</div>;
};
