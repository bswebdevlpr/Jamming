"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
import RadixSwitch from "@/app/ui/templates/switch";
import { redirect } from "next/navigation";

export default function Setting() {
  return (
    <div className="grow flex flex-col">
      <div
        className="w-full flex justify-between py-5 px-4"
        style={{
          marginBottom: "25px",
        }}>
        <LeftArrowWhite />
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",
          }}>
          설정
        </p>
        <div />
      </div>
      <div
        className="flex flex-row justify-between px-4"
        style={{
          paddingBottom: "30px",
          borderBottom: "1px solid var(--border)",
        }}>
        <div className="flex flex-col gap-2.5">
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "1rem",
              color: "#FFF",
            }}>
            알림 설정
          </p>
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.75rem",
              color: "#9F9FA2",
            }}>
            잼 세션 일정 및 참여 제안 알림을 허용합니다.
          </p>
        </div>
        <RadixSwitch />
      </div>
      <div
        className="px-4 py-5"
        style={{
          borderBottom: "1px solid var(--border)",
        }}>
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",

            display: "inline",

            cursor: "pointer",
          }}
          onClick={() => {
            signOut();
            redirect("/");
          }}>
          로그아웃
        </p>
      </div>
      <div className="flex flex-row justify-between px-4 pt-5">
        <div>
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "1rem",
              color: "#FFF",

              paddingBottom: "9px",
            }}>
            회원 탈퇴
          </p>
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.75rem",
              color: "#A2A2A2",
            }}>
            재밍과 헤어지는건가요? 너무 아쉽습니다!
          </p>
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.625rem",
              color: "#FF3773",
            }}>
            탈퇴 후 1개월 동안 재가입이 어렵습니다.
          </p>
        </div>
        <LeftArrowWhite
          width={22}
          height={22}
          style={{
            transform: "rotate(180deg)",
          }}
        />
      </div>
    </div>
  );
}
