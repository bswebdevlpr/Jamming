"use client";

import moment from "moment";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import MeatballMenu from "../images/menu/meatball";
import Link from "next/link";
import { Entity_Playlist } from "@/app/lib/interfaces/entity.interface";

export const ListItem_PlayList = ({
  item,
  isOptionOn = false,
  onOptionClick,
}: {
  item: Entity_Playlist;
  isOptionOn?: boolean;
  onOptionClick?: () => void;
}) => {
  const [itemWidth, setItemWidth] = useState<number>(0);
  const [itemHeight, setItemHeight] = useState<number>(0);

  useEffect(() => {
    const width = document.body.offsetWidth;
    const height = document.body.offsetWidth;

    setItemWidth(width * 0.2986);
    setItemHeight(height * 0.1022);
  }, []);

  return (
    <div
      className="w-full flex"
      style={{
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Link
        href={item?.origin}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3.5 py-4`}
        style={{
          width: "92.84%",
        }}
      >
        <Image
          src={item?.thumbnail_path}
          width={itemWidth}
          height={itemHeight}
          placeholder="empty"
          priority={true}
          alt="Image"
        />
        <div
          className={`flex flex-col gap-1`}
          style={{
            width: `${isOptionOn ? "50.85" : "62.38"}%`,
          }}
        >
          <p
            style={{
              color: "#FFF",
              fontFamily: "SUIT-BODY",
              fontSize: "1rem",
              lineHeight: "150%",
              letterSpacing: "-0.4px",

              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {item?.title}
          </p>
          <p
            style={{
              color: "#C0C0C5",
              fontFamily: "SUIT-BODY",
              fontSize: "0.625rem",
              lineHeight: "150%",
              letterSpacing: "-0.3px",

              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {moment(item?.date).fromNow()}
          </p>
        </div>
      </Link>
      {isOptionOn && <MeatballMenu onClick={onOptionClick} />}
    </div>
  );
};

export const List_PlayList = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={`w-full flex flex-col ${className}`}>{children}</div>;
};
