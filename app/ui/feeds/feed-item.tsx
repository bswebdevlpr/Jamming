"use client";

import { CrownImage } from "../images/myact/crown";
import Profile from "../images/navbar/profile";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  PositionTag,
  TagList,
} from "../tags/category-tag";
import { ImageWithTxt } from "../templates/images";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { motion } from "framer-motion";
import Kebap from "../images/menu/kebap";
import { BottomSheetContext } from "@/app/lib/interfaces/global.interface";
import ButtonTemplate from "../templates/buttons";

export interface FeedItemProps_Jam {
  idx: number;
  id: number;
  title: string;
  location: string;
  pos: string;
  genre: string;
  level: string;
  curHeadCnt: number;
  max_head_cnt: number;
  router: AppRouterInstance;
  isMyJam?: boolean;
  bottomSheet: BottomSheetContext;
}

export const FeedItem_Jam: React.FC<FeedItemProps_Jam> = ({
  idx,
  id,
  title,
  isMyJam,
  location,
  pos,
  genre,
  level,
  curHeadCnt,
  max_head_cnt,
  router,
  bottomSheet,
}) => {
  const tags = [];
  if (location) tags.push(<LocationTag text={location} />);
  tags.push(<PositionTag text={pos} />);
  tags.push(<GenreTag text={genre} />);
  tags.push(<LevelTag text={level} />);

  const isMyAct = isMyJam !== undefined;

  return (
    <motion.div
      key={idx}
      className="w-full flex justify-between py-3"
      style={{
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
      }}
      onClick={() =>
        isMyAct
          ? router.push(`/myact/${id}`)
          : router.push(`/jamsession/post/${id}`)
      }
      whileHover={{
        background: "rgba(163, 255, 12, 0.12)",
      }}
      whileTap={{
        background: "rgba(163, 255, 12, 0.12)",
      }}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-1">
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "1rem",
              fontStyle: "normal",
              lineHeight: "140%",
              letterSpacing: "-0.384px",
            }}
          >
            {title}
          </p>
          {isMyAct && isMyJam && <CrownImage />}
        </div>
        <TagList tags={tags} />
        <ImageWithTxt
          className="gap-1"
          image={<Profile width={10.7} height={12} />}
          text={
            <p
              style={{
                color: "#9F9FA2",
                fontFamily: "SUIT-TITLE",
                fontSize: "0.875rem",
                fontStyle: "normal",
                lineHeight: "140%",
              }}
            >
              <span
                style={{
                  color: "var(--highlight)",
                }}
              >
                {curHeadCnt}
              </span>
              /{max_head_cnt}
            </p>
          }
        />
      </div>
      <div className="flex gap-4 justify-end items-center">
        <div
          style={{
            width: "72px",
            height: "100%",
            backgroundColor: "pink",
          }}
        >
          Image
        </div>
        {isMyAct && (
          <Kebap
            onClick={(e) => {
              console.log("is clicked!");
              e.stopPropagation();

              bottomSheet.set({
                location: "row-2",
                children: (
                  <div
                    className="flex flex-col px-4 pt-2 pb-3"
                    style={{
                      fontFamily: "SUIT-TITLE",
                      fontSize: "0.9375rem",
                      lineHeight: "132%",
                      letterSpacing: "-0.36px",
                    }}
                  >
                    <p
                      className="text-center px-3 py-3.5"
                      style={{
                        color: "#F2F2F4",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      참여 멤버 보기
                    </p>
                    <p
                      className="text-center px-3 py-3.5"
                      style={{
                        color: "#FF3E2F",
                      }}
                    >
                      기록 삭제하기
                    </p>
                    <ButtonTemplate
                      text="취소"
                      className="w-full"
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #444447",
                        backgroundColor: "#323234",
                      }}
                      onClick={() =>
                        bottomSheet.set({
                          location: "hidden",
                        })
                      }
                    />
                  </div>
                ),
              });
            }}
          />
        )}
      </div>
    </motion.div>
  );
};
