"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { ImageWithTxt } from "@/app/ui/templates/images";
import { useEffect, useState } from "react";
import { initialize } from "./functions/initialize";
import { useParams, useRouter } from "next/navigation";
import FullScreenLoading from "@/app/ui/loading/fullscreen";
import { CustomError } from "@/app/lib/errors/client.error";
import { Entity_User } from "@/app/lib/interfaces/entity.interface";

const MemberRow = () => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "100px",
          background:
            "linear-gradient(0deg, rgba(255, 187, 12, 0.70) 0%, rgba(255, 187, 12, 0.70) 100%)",
        }}
      />
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          color: "#F2F2F4",
        }}
      >
        닉네임
      </p>
    </div>
  );
};

export default function JamSession() {
  // validation
  const { id: jamId } = useParams();

  const [isInitializing, setIsInitializing] = useState(true);

  const [leader, setLeader] = useState<Entity_User>(null);
  const [members, setMembers] = useState<Entity_User[]>([]);
  const [appliers, setAppliers] = useState<Entity_User[]>([]);

  const router = useRouter();

  useEffect(() => {
    try {
      (async () => {
        const {
          leader: foundLeader,
          members: foundMembers,
          appliers: foundAppliers,
        } = await initialize(Number(jamId as string));

        setLeader(foundLeader);
        setMembers(foundMembers);
        setAppliers(foundAppliers);

        setIsInitializing(false);
      })();
    } catch (e) {
      const errToShow = e instanceof CustomError ? e : CustomError.UnExpected;
      // TODO: 에러팝업
      console.error(errToShow);
      router.back();
    }
  }, [jamId]);

  useEffect(() => {
    console.log(leader, members, appliers);
  }, [leader, members, appliers]);

  return isInitializing ? (
    <FullScreenLoading />
  ) : (
    <div className="grow flex flex-col px-4">
      <ImageWithTxt
        image={<LeftArrowWhite />}
        text="멤버 관리"
        className="py-3 gap-2 mb-3"
        style={{
          fontFamily: "SUIT-TITLE",
          fontSize: "1.125rem",
          color: "#FFF",
        }}
      />
      <p
        style={{
          fontFamily: "SBAggroM",
          fontSize: "1rem",
          color: "#FFF",
        }}
      >
        참여중인 멤버
      </p>
      <div
        className="flex flex-row py-4 gap-5 mb-8"
        style={{
          borderBottom: "1px solid #242426",
        }}
      >
        <MemberRow />
        <MemberRow />
        <MemberRow />
        <MemberRow />
      </div>
      <div>
        <p
          style={{
            fontFamily: "SBAggroM",
            fontSize: "1rem",
            color: "#FFF",
          }}
        >
          멤버 요청
        </p>
      </div>
      <div className="flex flx-col py-2">
        <div className="grow flex flex-row gap-4 items-center">
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "100px",
              background:
                "linear-gradient(0deg, rgba(255, 187, 12, 0.70) 0%, rgba(255, 187, 12, 0.70) 100%)",
            }}
          />
          <div className="grow flex flex-row justify-between">
            <div className="flex flex-col gap-1">
              <p
                style={{
                  fontFamily: "SUIT-BODY",
                  fontSize: "1rem",
                  color: "#FFF",
                }}
              >
                닉네임
              </p>
              <p
                style={{
                  fontFamily: "SUIT-BODY",
                  fontSize: "0.875rem",
                  color: "#C0C0C5",
                }}
              >
                지원 포지션: 기타
              </p>
              <div className="flex flex-row gap-1">
                <p
                  className="px-1.5 py-0.5"
                  style={{
                    fontFamily: "SUIT-BODY",
                    fontSize: "0.75rem",
                    color: "#FF3773",
                    alignItems: "center",

                    background: "rgba(255, 55, 115, 0.24)",
                    borderRadius: "2px",
                  }}
                >
                  일렉
                </p>
                <p
                  className="px-1.5 py-0.5"
                  style={{
                    fontFamily: "SUIT-BODY",
                    fontSize: "0.75rem",
                    color: "#A3FF0C",
                    alignItems: "center",

                    background: "rgba(163, 255, 12, 0.16)",
                    borderRadius: "2px",
                  }}
                >
                  헤비메탈
                </p>
                <p
                  className="px-1.5 py-0.5"
                  style={{
                    fontFamily: "SUIT-BODY",
                    fontSize: "0.75rem",
                    color: "#3994FF",
                    alignItems: "center",

                    background: "rgba(12, 124, 255, 0.20)",
                    borderRadius: "2px",
                  }}
                >
                  분당
                </p>
                <p
                  className="px-1.5 py-0.5"
                  style={{
                    fontFamily: "SUIT-BODY",
                    fontSize: "0.75rem",
                    color: "#E5E5E9",
                    alignItems: "center",

                    background: "#242426",
                    borderRadius: "2px",
                  }}
                >
                  프로
                </p>
              </div>
            </div>
            <p
              className="px-2 py-1"
              style={{
                width: "68px",
                height: "28px",

                fontFamily: "SUIT-TITLE",
                fontSize: "0.875rem",
                color: "#A3FF0C",
                alignItems: "center",

                background: "#323234",
                borderRadius: "4px",
              }}
            >
              REJAM
            </p>
          </div>
        </div>
      </div>

      <p
        className="py-6"
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          color: "#9F9FA2",
        }}
      >
        한줄 소개가 들어갑니다. 한줄 소개가 들어갑니다.한줄 소개가
        들어갑니다.한줄 소개가 들어갑니다.
      </p>

      <div className="flex flex-row gap-3">
        <ButtonTemplate
          text="거절"
          className="basis-1/2"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#FFF",

            background: "#323234",
            border: "1px solid #444447",
          }}
        />
        <ButtonTemplate
          text="수락"
          className="basis-1/2"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#A3FF0C",

            border: "1px solid #A3FF0C",
          }}
        />
      </div>
    </div>
  );
}
