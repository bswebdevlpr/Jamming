"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
import { ImageWithTxt } from "@/app/ui/templates/images";
import { useEffect, useState } from "react";
import { initialize } from "./functions/initialize";
import { useParams, useRouter } from "next/navigation";
import FullScreenLoading from "@/app/ui/loading/fullscreen";
import { CustomError } from "@/app/lib/errors/error";
import {
  Entity_JamEntry,
  Entity_User,
} from "@/app/lib/interfaces/entity.interface";
import { ApplierComponent } from "./components/applier.component";
import { MemberComponent } from "./components/member.component";

export default function JamSession() {
  // validation
  const { id } = useParams();
  const jamId = Number(id as string);

  const [isInitializing, setIsInitializing] = useState(true);

  const [leader, setLeader] = useState<Entity_User>(null);
  const [memberEntries, setMemberEntries] = useState<Entity_JamEntry[]>([]);
  const [applierEntries, setApplierEntries] = useState<Entity_JamEntry[]>([]);

  const router = useRouter();

  useEffect(() => {
    try {
      (async () => {
        const {
          leader: foundLeader,
          memberEntries: foundMemberEntries,
          applierEntries: foundApplierEntries,
        } = await initialize(jamId);

        setLeader(foundLeader);
        if (foundMemberEntries.length > 0) setMemberEntries(foundMemberEntries);
        if (foundApplierEntries.length > 0)
          setApplierEntries(foundApplierEntries);

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
    console.log(leader, memberEntries, applierEntries);
  }, [leader, memberEntries, applierEntries]);

  return isInitializing ? (
    <FullScreenLoading />
  ) : (
    <div className="grow flex flex-col px-5">
      <ImageWithTxt
        image={<LeftArrowWhite />}
        text="멤버 관리"
        className="py-3 gap-2 mb-3"
        style={{
          fontFamily: "SUIT-TITLE",
          fontSize: "1.125rem",
          color: "#FFF",
          lineHeight: "140%",
        }}
      />
      <p
        style={{
          fontFamily: "SBAggroM",
          fontSize: "1rem",
          color: "#9F9FA2",
          lineHeight: "132%",
          letterSpacing: "-0.384px",
        }}
      >
        멤버 요청
      </p>
      {applierEntries.length > 0 &&
        ApplierComponent(applierEntries[0], setApplierEntries)}
      <p
        style={{
          fontFamily: "SBAggroM",
          fontSize: "1rem",
          color: "#9F9FA2",
          lineHeight: "132%",
          letterSpacing: "-0.384px",

          marginTop: "32px",
        }}
      >
        참여중인 멤버
      </p>
      <div className="grow overflow-without-scroll flex justify-center items-center">
        {memberEntries.map((entry, idx) =>
          MemberComponent(idx, entry, setMemberEntries)
        )}
        {/* <MyAct_MemberFeed jamId={jamId} /> */}
      </div>
    </div>
  );
}
