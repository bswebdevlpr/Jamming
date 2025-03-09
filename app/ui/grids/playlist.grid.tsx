"use client";

import { Entity_Playlist } from "@/app/lib/interfaces/entity.interface";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

export const GridItem_PlayList = ({ item }: { item: Entity_Playlist }) => {
  const [itemWidth, setItemWidth] = useState<number>(0);
  const [itemHeight, setItemHeight] = useState<number>(0);

  useEffect(() => {
    const width = document.body.offsetWidth;
    const height = document.body.offsetWidth;

    setItemWidth(width);
    setItemHeight(height * 0.1328);
  }, []);

  return (
    <Link
      href={item.origin}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col"
    >
      <Image
        src={item.thumbnail_path}
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
        }}
      >
        {item.title}
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
        {item.author} •{" "}
        <span
          style={{
            fontSize: "0.625rem",
          }}
        >
          {moment(item.date).fromNow()}
        </span>
      </p>
    </Link>
  );
};

export const Grid_PlayList = ({ children }: { children: ReactNode }) => {
  return <div className="grid grid-cols-2 gap-x-4 gap-y-6">{children}</div>;
};
