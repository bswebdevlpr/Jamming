"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
import { ImageWithTxt } from "@/app/ui/templates/images";
import { useContext, useEffect, useState } from "react";
import { initialize } from "./functions/initialize";
import { useParams, useRouter } from "next/navigation";
import FullScreenLoading from "@/app/ui/loading/fullscreen";
import { CustomError } from "@/app/lib/errors/error";
import {
  Entity_JamEntry,
  Entity_JamSession,
  Entity_User,
} from "@/app/lib/interfaces/entity.interface";
import { ApplierComponent } from "./components/applier.component";
import { MemberComponent } from "./components/member.component";
import { globalContext } from "@/app/(pages)/layout";
import { createClient } from "@/app/util/supabase/client";

export default function MyAct() {
  const { id } = useParams();
  const jamId = Number(id as string);

  const router = useRouter();

  const { bottomSheet } = useContext(globalContext);

  // STATES
  const [isInitializing, setIsInitializing] = useState(true);

  const [userId, setUserId] = useState<string>(null);

  const [jam, setJam] = useState<Entity_JamSession>(null);
  const [leader, setLeader] = useState<Entity_User>(null);
  const [memberEntries, setMemberEntries] = useState<Entity_JamEntry[]>([]);
  const [applierEntries, setApplierEntries] = useState<Entity_JamEntry[]>([]);
  //

  // HOOKS
  useEffect(() => {
    try {
      (async () => {
        const {
          data: { user },
          error,
        } = await createClient().auth.getUser();
        if (!user || error) throw CustomError.InvalidUserSession;

        setUserId(user.id);

        const {
          jam: foundJam,
          leader: foundLeader,
          memberEntries: foundMemberEntries,
          applierEntries: foundApplierEntries,
        } = await initialize(jamId);

        setJam(foundJam);
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
  //

  // HANDLERS
  const refuseEntryState = () => {
    setApplierEntries(applierEntries.slice(1, applierEntries.length));
  };
  const allowEntryState = () => {
    const newMember = applierEntries[0];

    setApplierEntries(applierEntries.slice(1, applierEntries.length));
    setMemberEntries([newMember, ...memberEntries]);
  };
  const letOutMember = (entryId: number) => {
    setMemberEntries(memberEntries.filter((entry) => entry.id !== entryId));
  };
  //

  return isInitializing ? (
    <FullScreenLoading />
  ) : (
    <div className="grow flex flex-col px-5">
      <ImageWithTxt
        image={<LeftArrowWhite onClick={router.back} />}
        text="멤버 관리"
        className="py-3 gap-2 mb-3"
        style={{
          fontFamily: "SUIT-TITLE",
          fontSize: "1.125rem",
          color: "#FFF",
          lineHeight: "140%",
        }}
      />
      {userId === leader.id && (
        <>
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
            ApplierComponent(
              applierEntries[0],
              refuseEntryState,
              allowEntryState
            )}
        </>
      )}
      <p
        style={{
          fontFamily: "SBAggroM",
          fontSize: "1rem",
          color: "#9F9FA2",
          lineHeight: "132%",
          letterSpacing: "-0.384px",

          marginTop: "32px",
          marginBottom: "4px",
        }}
      >
        참여중인 멤버
      </p>
      <div className="grow overflow-without-scroll flex flex-col items-center">
        {memberEntries.map((entry, idx) =>
          MemberComponent(
            idx,
            jam,
            entry,
            userId === leader.id,
            letOutMember,
            bottomSheet
          )
        )}
      </div>
    </div>
  );
}
