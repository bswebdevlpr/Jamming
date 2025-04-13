"use client";

import { Entity_User } from "@/app/lib/interfaces/entity.interface";
import { LeftArrowWhite } from "@/app/ui/images/arrows";
import RadixSwitch from "@/app/ui/templates/switch";
import { createClient } from "@/app/util/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { initialize } from "./functions/fetch";
import { updateNotiAccept } from "./functions/update";
import UnregisterPopup from "./popup/unregister";

export default function Setting() {
  const router = useRouter();

  // STATES
  const [supabase, setSupabase] =
    useState<SupabaseClient<any, "public", any>>(null);
  const [user, setUser] = useState<Entity_User>(null);
  const [acceptNoti, setAcceptNoti] = useState<boolean>(null);

  const [isUnregisterPopupOn, setIsUnregisterPopupOn] =
    useState<boolean>(false);
  //

  useEffect(() => {
    (async () => {
      const supabase = await createClient();
      setSupabase(supabase);

      const user = await initialize();
      setUser(user);

      setAcceptNoti(user.allow_noti);
    })();
  }, []);

  useEffect(() => {
    if (user && acceptNoti !== null && user.allow_noti !== acceptNoti) {
      updateNotiAccept(acceptNoti);
      user.allow_noti = acceptNoti;
    }
  }, [user, acceptNoti]);

  return (
    <div className="grow flex flex-col">
      <div
        className="w-full flex justify-between py-5 px-4"
        style={{
          marginBottom: "25px",
        }}
      >
        <LeftArrowWhite />
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",
          }}
        >
          설정
        </p>
        <div />
      </div>
      <div
        className="flex flex-row justify-between px-4"
        style={{
          paddingBottom: "30px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex flex-col gap-2.5">
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "1rem",
              color: "#FFF",
            }}
          >
            알림 설정
          </p>
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.75rem",
              color: "#9F9FA2",
            }}
          >
            카카오톡으로 잼 세션 일정 및 참여 제안 알림을 보내드려요{" "}
          </p>
        </div>
        <RadixSwitch value={acceptNoti} setValue={setAcceptNoti} />
      </div>
      <div
        className="flex justify-between px-4 py-5"
        style={{
          borderBottom: "1px solid var(--border)",
        }}
      >
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",

            display: "inline",

            cursor: "pointer",
          }}
          onClick={() => {
            supabase.auth.signOut();
            redirect("/");
          }}
        >
          로그아웃
        </p>
        <LeftArrowWhite
          width={22}
          height={22}
          style={{
            transform: "rotate(180deg)",
          }}
          onClick={async () => {
            await supabase.auth.signOut().then(() => {
              router.push("/");
            });
          }}
        />
      </div>
      <div className="flex flex-row justify-between px-4 pt-5">
        <div>
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "1rem",
              color: "#FFF",

              paddingBottom: "9px",
            }}
          >
            회원 탈퇴
          </p>
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.75rem",
              color: "#A2A2A2",
            }}
          >
            재밍과 헤어지는건가요? 너무 아쉬워요!
          </p>
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.625rem",
              color: "#FF3773",
            }}
          >
            탈퇴 후 1개월 동안 재가입이 어렵습니다.
          </p>
        </div>
        <LeftArrowWhite
          width={22}
          height={22}
          style={{
            transform: "rotate(180deg)",
          }}
          onClick={() => setIsUnregisterPopupOn(true)}
        />
      </div>
      <UnregisterPopup
        isTurnedOn={isUnregisterPopupOn}
        turnOff={() => setIsUnregisterPopupOn(false)}
      />
    </div>
  );
}
