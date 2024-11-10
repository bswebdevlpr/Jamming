import Image from "next/image";
import { RoundedCheckbox } from "../ui/checkbox";
import { NextButton } from "../ui/buttons/next";

const RightArrow = () => {
  return (
    <Image
      className="ml-auto"
      src="/arrow-right.svg"
      alt="arrow-right"
      width={20}
      height={20}
    />
  );
};

const PolicyRow = ({ opt, txt }: { opt: string; txt: string }) => {
  return (
    <div className="flex flex-row items-center gap-1">
      <RoundedCheckbox />
      <p
        style={{
          fontFamily: "SUIT-Body",
          fontSize: "14px",
        }}
      >
        ({opt}) {txt}
      </p>
      <RightArrow />
    </div>
  );
};

export default function SignUp() {
  return (
    <div className="grid grid-rows-[36px_1fr_52px] min-h-screen min-w-full">
      <div></div> {/* 빈칸 */}
      <div className="flex flex-col">
        <div className="flex flex-row basis-auto grow-0 shrink-0 gap-2.5 mb-5">
          <Image src="/note-on.svg" alt="note" width={24} height={24} />
          <Image src="/note-off.svg" alt="note" width={24} height={24} />
          <Image src="/note-off.svg" alt="note" width={24} height={24} />
        </div>
        <div className="flex flex-col mb-5">
          <p
            style={{
              fontFamily: "SBAggroM",
              fontSize: "24px",
              color: "#C0C0C5",
            }}
            className=""
          >
            반갑습니다
          </p>
          <p
            style={{
              fontFamily: "SBAggroM",
              fontSize: "24px",
              color: "#C0C0C5",
            }}
            className=""
          >
            시작 전, 약관에 동의해주세요
          </p>
        </div>
        <div
          className="flex flex-row justify-between items-center mb-3"
          style={{
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "#444447",

            paddingTop: "17.5px",
            paddingRight: "20px",
            paddingBottom: "17.5px",
            paddingLeft: "12px",
          }}
        >
          <p
            style={{
              fontFamily: "SUIT-Body",
              fontSize: "16px",
              color: "#E5E5E9",
            }}
          >
            약관 전체동의
          </p>
          <RoundedCheckbox />
        </div>
        <div className="mx-3 mb-8">
          <p
            style={{
              fontFamily: "SUIT-Body",
              fontSize: "13px",
            }}
          >
            본인은 만 14세 이상이며, 로그인 진행 시 이용 약관,
          </p>
          <p
            style={{
              fontFamily: "SUIT-Body",
              fontSize: "13px",
            }}
          >
            개인정보 수집 및 이용 동의서, 운영 정책에 동의하게 됩니다.
          </p>
        </div>
        <div className="flex flex-col gap-4 mx-3">
          {[
            "서비스 이용약관",
            "전자금융거래 이용약관",
            "개인정보 수집/이용 동의",
            "본인확인서비스 이용약관",
          ].map((txt, idx) => (
            <PolicyRow key={idx} opt={"필수"} txt={txt} />
          ))}
          <PolicyRow opt={"선택"} txt={"마케팅 수신 이용 동의"} />
        </div>
      </div>
      <div className="flex py-2 justify-center items-center">
        <NextButton />
      </div>
    </div>
  );
}
