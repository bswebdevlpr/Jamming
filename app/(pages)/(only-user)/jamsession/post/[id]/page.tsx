"use client";

import { useBottomSheetStore } from "@/app/stores";
import { deleteJamSession } from "@/app/api/functions/delete";
import { CustomError } from "@/app/lib/errors/custom-error";
import {
  Entity_JamSession,
  Entity_User,
} from "@/app/lib/interfaces/entity.interface";
import {
  MapDataToGenre,
  MapDataToLevel,
  MapDataToPosition,
} from "@/app/lib/maps/jam";
import { DownArrowWhite, LeftArrowWhite } from "@/app/ui/images/arrows";
import DeleteIcon from "@/app/ui/images/jamsession/post/delete";
import EditIcon from "@/app/ui/images/jamsession/post/edit";
import ReportIcon from "@/app/ui/images/jamsession/post/report";
import Kebap from "@/app/ui/images/menu/kebap";
import FullScreenLoading from "@/app/ui/loading/fullscreen";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  TagList,
} from "@/app/ui/tags/category-tag";
import RadixAvatar from "@/app/ui/templates/avatar";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { ImageWithTxt } from "@/app/ui/templates/images";
import moment from "moment";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { initialize } from "./functions/initialize";
import Modal from "./modal";
import BottomNavBarPublic from "@/app/ui/navbar/bottom-public";

const UpdateJam = dynamic(() => import("./popup/update-jam"), { ssr: false });

const FlexRow = ({
  tag,
  mainConent,
  subContent,
}: {
  tag: string;
  mainConent: any;
  subContent?: any;
}) => {
  const [isSpreaded, setIsSpreaded] = useState<boolean>(false);

  return (
    <div
      className="flex flex-row items-start px-4 py-3.5 gap-1"
      style={{
        height: "fit-content",
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
        className="grow flex flex-col gap-1"
        style={{
          width: "66.66%",
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          color: "#FFF",
        }}
      >
        {mainConent}
        {isSpreaded && subContent}
      </div>
      {subContent && (
        <DownArrowWhite
          onClick={() => setIsSpreaded(!isSpreaded)}
          style={{
            transform: isSpreaded && "scaleY(-1)",
          }}
        />
      )}
    </div>
  );
};

export default function JamSession_Post() {
  // validation
  const { id: jam_id } = useParams();
  const router = useRouter();

  const [isInitializing, setIsInitializing] = useState(true);

  const [jam, setJam] = useState<Entity_JamSession>(null);
  const [user, setUser] = useState<Entity_User>(null);
  const [tags, setTags] = useState<ReactNode[]>(null);

  const [applyBtnTxt, setApplyBtnTxt] = useState<string>("Loading..");
  const [isApplyBtnActive, setIsApplyBtnActive] = useState<boolean>(false);

  const [isTurnedOn, setIsTurnedOn] = useState(false);
  const turnOff = () => {
    setIsTurnedOn(!isTurnedOn);
  };

  const fetchJamData = useCallback(async () => {
    const {
      jam: foundJam,
      user: foundUser,
      isApplyBtnActive: isApplyBtnActiveFromFunc,
      applyBtnTxt: applyBtnTxtFromFunc,
    } = await initialize(Number(jam_id as string));
    if (!foundJam) throw CustomError.InvalidJam;

    setJam(foundJam);
    setUser(foundUser ?? null);

    if (applyBtnTxtFromFunc) setApplyBtnTxt(applyBtnTxtFromFunc);
    if (isApplyBtnActiveFromFunc !== undefined)
      setIsApplyBtnActive(isApplyBtnActiveFromFunc);

    const tagsToRender = [];
    if (location)
      tagsToRender.push(
        <LocationTag key={"location"} text={foundJam.location} />
      );
    tagsToRender.push(<GenreTag key={"genre"} text={foundJam.genre} />);
    tagsToRender.push(<LevelTag key={"level"} text={foundJam.level} />);
    setTags(tagsToRender);

    setIsInitializing(false);
  }, [jam_id]);

  const refetch = useCallback(async () => {
    try {
      await fetchJamData();
    } catch (e) {
      const errToShow = e instanceof CustomError ? e : CustomError.UnExpected;
      if (process.env.NODE_ENV === "production") console.error(errToShow);
      router.back();
    }
  }, [fetchJamData, router]);

  useEffect(() => {
    refetch();
  }, [refetch]);
  //

  // ZUSTAND STORE
  const bottomSheet = useBottomSheetStore();
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
        {user && <Kebap
          onClick={
            user.id === jam.user_id
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
                          onClick={() => {
                            bottomSheet.set({
                              location: "hidden",
                            });
                            setIsTurnedOn(true);
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
                          onClick={() => {
                            if (jam)
                              deleteJamSession(jam.id).then(() => {
                                bottomSheet.set({
                                  location: "hidden",
                                });
                                router.push("/jamsession");
                              });
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
        />}
      </div>
      <div
        className="flex flex-row px-4 py-2 gap-3"
        style={{
          borderBottom: "1px solid #333335",
        }}
      >
        <RadixAvatar
          width={44}
          height={44}
          src={jam.user?.profile_image}
          pos={jam.user?.pos}
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
              {jam.user?.nickname ?? "탈퇴한 유저에요"}
            </p>
            <p
              style={{
                fontFamily: "SUIT-TITLE",
                fontSize: "0.875rem",
                color: "#A3FF0C",
              }}
            >
              {jam.user?.bpm ?? 0}BPM
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
              {jam.user?.genre ? MapDataToGenre[jam.user.genre] : "-"} •{" "}
              {jam.user?.level ? MapDataToLevel[jam.user.level] : "-"} •{" "}
              {jam.user?.pos ? MapDataToPosition[jam.user.pos] : "-"}
            </p>
          </div>
        </div>
      </div>
      <FlexRow tag="카테고리" mainConent={<TagList tags={tags} />} />
      <FlexRow
        tag="참여 인원"
        mainConent={
          <p>{`총 인원: ${
            jam.maxHeadCnt > 0
              ? `${jam.curHeadCnt ?? 0}/${jam.maxHeadCnt}`
              : "상관없음"
          }`}</p>
        }
        subContent={
          jam.maxHeadCnt > 0 && (
            <div className="flex flex-col">
              {jam.headcnt_by_pos.map(
                (row, idx) =>
                  row.headcnt > 0 && (
                    <p key={idx}>{`${MapDataToPosition[row.pos]}: ${
                      jam.appliedPosDict[row.pos]
                    }/${row.headcnt}`}</p>
                  )
              )}
            </div>
          )
        }
      />
      <FlexRow
        tag="날짜"
        mainConent={
          jam.datetime
            ? moment(jam.datetime).format("YYYY.MM.DD HH:mm")
            : "0000.00.00 00:00"
        }
      />
      <FlexRow
        tag="장소"
        mainConent={jam.location_detail && <p>{jam.location_detail.name}</p>}
        subContent={
          jam.location_detail && (
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.75rem",
                color: "#9F9FA2",
              }}
            >
              {jam.location_detail.address}
            </p>
          )
        }
      />
      <FlexRow
        tag="합주곡"
        mainConent={
          jam.songs.length > 0 && (
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {`${jam.songs[0].title} - ${jam.songs[0].artist}`}
            </p>
          )
        }
        subContent={
          jam.songs.length > 1 &&
          jam.songs.slice(1).map((row, idx) => (
            <p
              key={idx}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {`${row.title} - ${row.artist}`}
            </p>
          ))
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
        <div className="flex flex-wrap gap-4">
          {jam &&
            jam.images.map((image, idx) => (
              <div key={idx} className="relative">
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    position: "relative",
                  }}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            ))}
        </div>
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
          onClick={() => user ? setIsModalOn(!isModalOn) : router.push("/")}
          isActive={isApplyBtnActive}
        />
      </div>
      {!user && <BottomNavBarPublic />}
      {user && (
        <Modal
          isTurnedOn={isModalOn}
          turnOff={() => setIsModalOn(!isModalOn)}
          user_id={user.id}
          jam_id={jam.id}
        />
      )}
      {user && jam && (
        <UpdateJam
          isTurnedOn={isTurnedOn}
          turnOff={turnOff}
          jam={jam}
          jamId={jam.id}
          selectedDate={jam.datetime && moment(jam.datetime)}
          refetch={refetch}
        />
      )}
    </div>
  );
}
