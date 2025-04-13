"use client";

import ButtonTemplate from "@/app/ui/templates/buttons";
import PopupTemplate from "@/app/ui/templates/popup";
import { destoryUser } from "../functions/delete";
import { useRouter } from "next/navigation";

export default function UnregisterPopup({
  isTurnedOn,
  turnOff,
}: {
  isTurnedOn;
  turnOff;
}) {
  const router = useRouter();

  return (
    <PopupTemplate
      isTurnedOn={isTurnedOn}
      className="flex items-center"
      style={{
        backgroundColor: "rgb(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="w-full flex-col items-center pt-7 px-2 pb-6.25 mx-4"
        style={{
          color: "#FFF",
          height: "26.5%",

          backgroundColor: "#242426",
          borderRadius: "12px",
        }}
      >
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            lineHeight: "140%",
            letterSpacing: "-0.45px",
            textAlign: "center",

            marginBottom: "16px",
          }}
        >
          회원 탈퇴
        </p>
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            textAlign: "center",

            marginBottom: "50px",
          }}
        >
          작성한 잼세션을 제외한 모든 데이터가 삭제되요
        </p>
        <div className="flex gap-3">
          <ButtonTemplate
            text="탈퇴"
            className="basis-1/2"
            onClick={async () => {
              await destoryUser().then(() => {
                router.push("/");
              });
            }}
          />
          <ButtonTemplate text="취소" className="basis-1/2" onClick={turnOff} />
        </div>
      </div>
    </PopupTemplate>
  );
}
