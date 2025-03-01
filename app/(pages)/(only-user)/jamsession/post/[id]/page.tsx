"use client";

import { DownArrowWhite, LeftArrowWhite } from "@/app/ui/images/arrows";
import Kebap from "@/app/ui/images/menu/kebap";
import { ReactNode, useContext, useEffect, useState } from "react";
import { ImageWithTxt } from "@/app/ui/templates/images";
import EditIcon from "@/app/ui/images/jamsession/post/edit";
import DeleteIcon from "@/app/ui/images/jamsession/post/delete";
import ReportIcon from "@/app/ui/images/jamsession/post/report";
import ButtonTemplate from "@/app/ui/templates/buttons";
import Modal from "./modal";
import { globalContext } from "@/app/(pages)/layout";
import FullScreenLoading from "@/app/ui/loading/fullscreen";
import { useParams, useRouter } from "next/navigation";
import {
  Entity_JamSession,
  Entity_User,
} from "@/app/lib/interfaces/entity.interface";
import {
  MapDataToGenre,
  MapDataToLevel,
  MapDataToPosition,
} from "@/app/lib/maps/jam";
import moment from "moment";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  PositionTag,
  TagList,
} from "@/app/ui/tags/category-tag";
import { initialize } from "./functions/initialize";
import { CustomError } from "@/app/lib/errors/error";

const FlexRow = ({ tag, content }: { tag: string; content: any }) => {
  return (
    <div
      className="flex flex-row items-start px-4 py-2 gap-1"
      style={{
        height: "6.37%",
        borderBottom: "1px solid #333335",
      }}
    >
      <p
        style={{
          width: "19.2%",
          fontFamily: "SUIT-TITLE",
          fontSize: "0.875rem",
          color: "#9F9FA2",
        }}
      >
        {tag}
      </p>
      <div
        style={{
          width: "66.66%",
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          color: "#FFF",
          flexGrow: 1,
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default function JamSession_Post() {
  // validation
  const { id: jamId } = useParams();
  const router = useRouter();

  const [isInitializing, setIsInitializing] = useState(true);

  const [jam, setJam] = useState<Entity_JamSession>(null);
  const [user, setUser] = useState<Entity_User>();
  const [tags, setTags] = useState<ReactNode[]>(null);

  const [dateDiff, setDateDiff] = useState<string>("0000-00-00");

  const [applyBtnTxt, setApplyBtnTxt] = useState<string>("Loading..");
  const [isApplyBtnActive, setIsApplyBtnActive] = useState<boolean>(false);

  useEffect(() => {
    try {
      (async () => {
        const {
          jam: foundJam,
          user: foundUser,
          isApplyBtnActive: isApplyBtnActiveFromFunc,
          applyBtnTxt: applyBtnTxtFromFunc,
        } = await initialize(Number(jamId as string));
        if (!foundJam) throw CustomError.InvalidJam;
        else if (!foundUser) throw CustomError.InvalidUserSession;

        setJam(foundJam);
        setUser(foundUser);

        if (applyBtnTxtFromFunc) setApplyBtnTxt(applyBtnTxtFromFunc);
        if (isApplyBtnActiveFromFunc !== undefined)
          setIsApplyBtnActive(isApplyBtnActiveFromFunc);

        moment.updateLocale("en", {
          relativeTime: {
            future: "in %s",
            past: "%s 전",
            s: "방금",
            ss: "%d초",
            m: "1분",
            mm: "%d분",
            h: "1시간",
            hh: "%d시간",
            d: "1일",
            dd: "%d일",
            w: "한주",
            ww: "%d주",
            M: "한달",
            MM: "%d달",
            y: "1년",
            yy: "%d년",
          },
        });
        setDateDiff(moment(foundJam.created_at).fromNow());

        const tagsToRender = [];
        if (location)
          tagsToRender.push(<LocationTag text={foundJam.location} />);
        tagsToRender.push(<PositionTag text={foundJam.pos} />);
        tagsToRender.push(<GenreTag text={foundJam.genre} />);
        tagsToRender.push(<LevelTag text={foundJam.level} />);
        setTags(tagsToRender);

        setIsInitializing(false);
      })();
    } catch (e) {
      const errToShow = e instanceof CustomError ? e : CustomError.UnExpected;
      // TODO: 에러팝업
      console.error(errToShow);
      router.back();
    }
  }, [jamId]);
  //

  // GLOBAL
  const { bottomSheet } = useContext(globalContext);
  //

  // STATES
  const [isModalOn, setIsModalOn] = useState(false);
  //

  return isInitializing ? (
    <FullScreenLoading />
  ) : (
    <div className="grow h-full max-h-full flex flex-col overflow-hidden">
      <div className="flex flex-row justify-between items-center px-4 py-3">
        <LeftArrowWhite
          onClick={() => {
            bottomSheet.set({
              location: "hidden",
            });
            router.back();
          }}
        />
        <Kebap
          onClick={
            user.id === jam.userId
              ? // 작성자
                () =>
                  bottomSheet.set({
                    location: "row-2",
                    children: (
                      <div className="flex flex-col px-4 pt-2 pb-3">
                        <ImageWithTxt
                          image={<EditIcon />}
                          text="수정하기"
                          style={{
                            padding: "12px",
                            gap: "8px",

                            fontFamily: "SUIT-BODY",
                            fontSize: "13px",
                            color: "#F2F2F4",

                            borderBottom: "1px solid #323234",
                          }}
                        />
                        <ImageWithTxt
                          image={<DeleteIcon />}
                          text="삭제하기"
                          style={{
                            padding: "12px",
                            gap: "8px",
                            marginBottom: "12px",

                            fontFamily: "SUIT-BODY",
                            fontSize: "13px",
                            color: "#FF3E2F",
                          }}
                        />
                        <ButtonTemplate
                          text="닫기"
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
                  })
              : // 일반 유저
                () =>
                  bottomSheet.set({
                    location: 16.5,
                    children: (
                      <div className="flex flex-col px-4 pt-2 pb-3">
                        <ImageWithTxt
                          image={<ReportIcon />}
                          text="신고하기"
                          style={{
                            padding: "12px",
                            gap: "8px",
                            marginBottom: "12px",

                            fontFamily: "SUIT-BODY",
                            fontSize: "13px",
                            color: "#FF3E2F",
                          }}
                        />
                        <ButtonTemplate
                          text="닫기"
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
                  })
          }
        />
      </div>
      <div
        className="flex flex-row px-4 py-2 gap-3"
        style={{
          borderBottom: "1px solid #333335",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "100px",
            backgroundColor: "#FFBB0C",
          }}
        />
        <div className="grow flex flex-col gap-0.5">
          <div className="flex flex-row gap-2">
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#FFF",
              }}
            >
              {jam.user.nickname ?? "-"}
            </p>
            <p
              style={{
                fontFamily: "SUIT-TITLE",
                fontSize: "0.875rem",
                color: "#A3FF0C",
              }}
            >
              {jam.user.bpm ?? 0}BPM
            </p>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.75rem",
                color: "#9F9FA2",
              }}
            >
              {jam.user.genre ? MapDataToGenre[jam.user.genre] : "-"} •{" "}
              {jam.user.level ? MapDataToLevel[jam.user.level] : "-"} •{" "}
              {jam.user.pos ? MapDataToPosition[jam.user.pos] : "-"}
            </p>
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#9F9FA2",
              }}
            >
              {dateDiff}
            </p>
          </div>
        </div>
      </div>
      <FlexRow tag="카테고리" content={<TagList tags={tags} />} />
      <FlexRow tag="참여 인원" content={jam.max_head_cnt ?? 0} />
      <FlexRow
        tag="날짜"
        content={
          jam.date
            ? moment(jam.date).format("YYYY.MM.DD HH:mm")
            : "0000.00.00 00:00"
        }
      />
      <FlexRow
        tag="장소"
        content={
          <div className="flex flex-col gap-1">
            <p>재즈스퀘어음악학원</p>
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.75rem",
                color: "#9F9FA2",
              }}
            >
              경기도 성남시 분당구 돌마로486번길 6 상록프라자
            </p>
          </div>
        }
      />
      <FlexRow
        tag="합주곡"
        content={
          <div className="grow flex flex-row justify-between">
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {"내일에서 기다릴게 (I'll See You There Tomorrow"}
            </p>
            <DownArrowWhite onClick={() => {}} />
          </div>
        }
      />
      <hr
        style={{
          border: "none",
          borderTop: "4px solid #323234",
        }}
      />
      <div
        className="grow px-4"
        style={{
          width: "100%",
          // height: "5%", //"51.77%",
          overflow: "auto",
        }}
      >
        <p
          className="pt-8"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1.125rem",
            color: "#FFF",
          }}
        >
          {jam.title}
        </p>
        <p
          className="py-5"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#F2F2F4",

            whiteSpace: "pre-line",
          }}
        >
          {jam.body ?? ""}
        </p>
      </div>
      <div
        className="w-full flex justify-center items-center px-4 py-2"
        style={{
          backgroundColor: "#111113",
          borderTop: "1px solid #333335",
          boxShadow: "0 -10px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <ButtonTemplate
          text={applyBtnTxt}
          styleActivated={{
            color: "#A3FF0C",
            border: "1px solid #A3FF0C",
            background: "#304313",
          }}
          onClick={() => setIsModalOn(!isModalOn)}
          isActive={isApplyBtnActive}
        />
      </div>
      <Modal
        isTurnedOn={isModalOn}
        turnOff={() => setIsModalOn(!isModalOn)}
        userId={user.id}
        jamId={jam.id}
      />
    </div>
  );
}
