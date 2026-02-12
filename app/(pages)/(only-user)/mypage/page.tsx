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
import { useState } from "react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { EditGrayIcon } from "@/app/ui/images/mypage/edit/edits";
import { Entity_User } from "@/app/lib/interfaces/entity.interface";
import { createFeedback } from "./functions/fetch";
import { ImageWithTxt } from "@/app/ui/templates/images";
import MyListIcon from "@/app/ui/images/mypage/note";
import { Grid_PlayList, GridItem_PlayList } from "@/app/ui/grids/playlist.grid";
import ButtonTemplate from "@/app/ui/templates/buttons";
import BPMBar from "@/app/ui/bpm/bpm-bar";
import { useSessionStore } from "@/app/stores";

export default function MyPage() {
  // HOOOKS
  const pathname = usePathname();
  const router = useRouter();
  //

  const userProfile = useSessionStore((state) => state.userProfile);

  // STATES
  const [feedback, setFeedback] = useState<string>("");
  const [placeholder, setPlaceholder] = useState<string>("");
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
            }}
          >
            User Profile
          </p>
        </div>
        <SettingIcon onClick={() => redirect(pathname + "/setting")} />
      </div>
      <div className="flex items-center gap-5 pt-3 pb-5">
        <div className="relative">
          <RadixAvatar
            src={userProfile?.profile_image}
            pos={userProfile?.pos}
          />
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
            }}
          >
            {userProfile?.nickname ?? "닉네임"}
          </p>
          <TagList
            tags={[
              <LocationTag key="l" text={userProfile?.location} />,
              <PositionTag key="p" text={userProfile?.pos} />,
              <GenreTag key="g" text={userProfile?.genre} />,
              <LevelTag key="lv" text={userProfile?.level} />,
            ]}
          />
        </div>
      </div>
      {userProfile && userProfile.tags && (
        <div
          className="flex gap-2"
          style={{
            color: "#F2F2F4",
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            lineHeight: "140%",
          }}
        >
          {userProfile.tags.map(
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
      <BPMBar user={userProfile as Entity_User} className="mt-9" />
      <div className="w-full flex flex-col">
        <div
          className="flex justify-between mb-4"
          style={{
            fontFamily: "SUIT-BODY",
          }}
        >
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

              cursor: "pointer",
            }}
            onClick={() => redirect("/mypage/playlist")}
          >
            편집
          </p>
        </div>
        <Grid_PlayList>
          {userProfile.playlist && userProfile.playlist.length > 0 ? (
            userProfile.playlist.map((row, idx) => (
              <GridItem_PlayList key={idx} item={row} />
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center py-16">
              <p
                style={{
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.875rem",
                  color: "#9F9FA2",
                  lineHeight: "150%",
                  textAlign: "center",
                }}
              >
                아직 등록된 곡이 없어요
              </p>
              <p
                style={{
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.75rem",
                  color: "#767678",
                  lineHeight: "150%",
                  textAlign: "center",
                  marginTop: "8px",
                }}
              >
                편집 버튼을 눌러 곡을 추가해보세요
              </p>
            </div>
          )}
        </Grid_PlayList>
        <div
          style={{
            paddingTop: "20px",
            paddingBottom: "7px",
          }}
        >
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "1rem",
              color: "#FFF",
              lineHeight: "150%",
              letterSpacing: "-0.4px",
            }}
          >
            피드백 보내기
          </p>
          <div className="relative mt-2.5 mb-4">
            <style jsx>{`
              textarea::placeholder {
                color: "#9F9FA2";
              }
            `}</style>
            <textarea
              placeholder={
                placeholder || "재밍에 대한 의견을 자유롭게 입력해주세요"
              }
              value={feedback}
              maxLength={100}
              className="w-full p-2.5"
              style={{
                height: "104px",

                fontFamily: "SUIT-BODY",
                color: "#FFF",

                lineHeight: "150%",
                letterSpacing: "-0.3px",

                backgroundColor: "#323234",
                borderRadius: "5px",
              }}
              onChange={(e) => {
                setFeedback(e.currentTarget.value);
                setPlaceholder("");
              }}
            />
            <p
              className="absolute"
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.75rem",
                color: "#9F9FA2",

                right: "10px",
                bottom: "10px",
              }}
            >
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
            onClick={() =>
              createFeedback(feedback).then((result) => {
                setFeedback("");
                if (result.success === true) setPlaceholder("피드백 전송이 완료되었어요");
                else if (result.success === false)
                  setPlaceholder(
                    result.error.message || "피드백 전송이 실패했어요. 나중에 다시 시도해주세요."
                  );
              })
            }
            // TODO: 메일전송 연동
          />
        </div>
      </div>
    </div>
  );
}
