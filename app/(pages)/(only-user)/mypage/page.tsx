"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
import SettingIcon from "@/app/ui/images/mypage/setting";
import RadixAvatar from "@/app/ui/templates/avatar";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  PositionTag,
  TagList,
} from "@/app/ui/tags/category-tag";
import { useEffect, useState } from "react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { EditGrayIcon } from "@/app/ui/images/mypage/edit/edits";
import { Entity_User } from "@/app/lib/interfaces/entity.interface";
import { initialize } from "./functions/fetch";
import { ImageWithTxt } from "@/app/ui/templates/images";
import MyListIcon from "@/app/ui/images/mypage/note";
import { Grid_PlayList, GridItem_PlayList } from "@/app/ui/grids/playlist.grid";
import ButtonTemplate from "@/app/ui/templates/buttons";
import BPMBar from "@/app/ui/bpm/bpm-bar";

export default function MyPage() {
  // HOOOKS
  const pathname = usePathname();
  const router = useRouter();
  //

  // STATES
  const [user, setUser] = useState<Entity_User>(null);

  const [feedback, setFeedback] = useState<string>("");
  //

  // HANDLERS
  useEffect(() => {
    (async () => {
      setUser(await initialize());
    })();
  }, []);
  //

  return (
    <div className="grow flex flex-col overflow-without-scroll px-5">
      <div className="w-full flex justify-between items-center py-3">
        <div className="flex gap-2">
          <LeftArrowWhite onClick={() => router.back()} />
          <p
            style={{
              fontFamily: "SBAggroM",
              fontSize: "1rem",
              color: "#FFF",
              lineHeight: "140%",
            }}>
            User Profile
          </p>
        </div>
        <SettingIcon onClick={() => redirect(pathname + "/setting")} />
      </div>
      <div className="flex items-center gap-5 pt-3 pb-5">
        <div className="relative">
          <RadixAvatar src={null} />
          <EditGrayIcon
            width={25}
            height={25}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
            onClick={() => router.push("/mypage/edit")}
          />
        </div>
        <div className="flex flex-col gap-3.5">
          <p
            style={{
              color: "#FFF",
              fontFamily: "SUIT-TITLE",
              fontSize: "1rem",
              lineHeight: "150%",
            }}>
            {user?.nickname ?? "닉네임"}
          </p>
          <TagList
            tags={[
              <LocationTag key="l" text={user?.location} />,
              <PositionTag key="p" text={user?.pos} />,
              <GenreTag key="g" text={user?.genre} />,
              <LevelTag key="lv" text={user?.level} />,
            ]}
          />
        </div>
      </div>
      {user && user.tags && (
        <div
          className="flex gap-2"
          style={{
            color: "#F2F2F4",
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            lineHeight: "140%",
          }}>
          {user.tags.map(
            (tag, idx) =>
              tag && (
                <p key={idx}>
                  <span style={{ color: "#767678", marginRight: "2px" }}>
                    #
                  </span>
                  {tag}
                </p>
              )
          )}
        </div>
      )}
      <BPMBar user={user} className="mt-9" />
      <div className="w-full flex flex-col">
        <div
          className="flex justify-between mb-4"
          style={{
            fontFamily: "SUIT-BODY",
          }}>
          <ImageWithTxt
            image={<MyListIcon />}
            text={"My list"}
            style={{
              color: "#767678",
              fontFamily: "SBAggroB",
              fontSize: "0.875rem",
              lineHeight: "150%",
            }}
          />
          <p
            style={{
              fontFamily: "SUIT-TITLE",
              fontSize: "0.875rem",
              color: "#9F9FA2",
              lineHeight: "150%",
            }}
            onClick={() => redirect("/mypage/playlist")}>
            편집
          </p>
        </div>
        <Grid_PlayList>
          {user &&
            user.playlist.map((row, idx) => (
              <GridItem_PlayList
                key={idx}
                thumbnailPath={row.thumbnailPath}
                title={row.title}
                author={row.author}
                created_at={row.date}
              />
            ))}
        </Grid_PlayList>
        <div
          style={{
            paddingTop: "20px",
            paddingBottom: "7px",
          }}>
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "1rem",
              color: "#FFF",
              lineHeight: "150%",
              letterSpacing: "-0.4px",
            }}>
            피드백 보내기
          </p>
          <div className="relative mt-2.5 mb-4">
            <style jsx>{`
              textarea::placeholder {
                color: "#9F9FA2";
              }
            `}</style>
            <textarea
              placeholder="재밍에 대한 의견을 자유롭게 입력해주세요"
              maxLength={100}
              className="w-full p-2.5"
              style={{
                height: "104px",

                fontFamily: "SUIT-BODY",
                fontSize: "0.75rem",
                color: "#FFF",

                lineHeight: "150%",
                letterSpacing: "-0.3px",

                backgroundColor: "#323234",
                borderRadius: "5px",
              }}
              onChange={(e) => setFeedback(e.currentTarget.value)}
            />
            <p
              className="absolute"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.75rem",
                color: "#9F9FA2",

                right: "10px",
                bottom: "10px",
              }}>
              {feedback.length} / 100
            </p>
          </div>
          <ButtonTemplate
            text="보내기"
            style={{
              backgroundColor: "#242426",
              border: "1px solid #333335",
            }}
            isActive={feedback.length > 0}
            // TODO: 메일전송 연동
          />
        </div>
      </div>
    </div>
  );
}
