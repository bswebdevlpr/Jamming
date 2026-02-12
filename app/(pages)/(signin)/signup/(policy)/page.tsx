"use client";

import { RoundedCheckbox } from "@/app/ui/checkbox";
import { useEffect, useRef, useState } from "react";
import { RightArrow } from "@/app/ui/images/arrows";
import { useDebouncedRedirect } from "../buttons/next-button";
import { usePathname } from "next/navigation";
import ButtonTemplate from "@/app/ui/templates/buttons";
import PolicyModal from "@/app/ui/modals/policy-modal";

type PolicyType =
  | "서비스 이용약관"
  | "전자금융거래 이용약관"
  | "개인정보 수집/이용 동의"
  | "본인확인서비스 이용약관"
  | "마케팅 수신 이용 동의";

const PolicyRow = ({
  opt,
  txt,
  onClick,
  thisState,
  onViewPolicy,
}: {
  opt: string;
  txt: string;
  onClick: (() => void) | ((newVal: boolean) => void);
  thisState: boolean;
  onViewPolicy: () => void;
}) => {
  return (
    <div className="flex flex-row items-center gap-1">
      <RoundedCheckbox onClick={onClick} thisState={thisState} />
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "14px",
        }}
      >
        ({opt}) {txt}
      </p>
      <div
        className="ml-auto cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onViewPolicy();
        }}
      >
        <RightArrow />
      </div>
    </div>
  );
};

export default function SignUp_Policy() {
  // INIT
  const isInited = useRef(false);

  const [acceptAllTermCon, setAcceptAllTermCon] = useState(false);
  const [termCons, setTermCons] = useState(Array(5).fill(false));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyType | null>(null);

  useEffect(() => {
    if (!isInited.current) isInited.current = true;
    else setTermCons(Array(5).fill(acceptAllTermCon));
  }, [acceptAllTermCon]);

  const handleAllTermCon = () => {
    return () => {
      setAcceptAllTermCon(!acceptAllTermCon);
    };
  };
  const handleTermConAction = (idx: number) => {
    return (newVal: boolean) => {
      const newState = [...termCons];
      newState[idx] = newVal;
      setTermCons(newState);
    };
  };
  //

  // HOOKS
  const pathname = usePathname();
  //

  // STATES
  const [isButtonActivated, setIsButtonActivated] = useState(false);
  //

  const debouncedRedirect = useDebouncedRedirect(300);

  // USE-EFFECTS
  useEffect(() => {
    let checkCnt = 0;

    for (const con of termCons.slice(0, termCons.length - 1))
      if (con) checkCnt++;
    if (checkCnt === termCons.length - 1) setIsButtonActivated(true);
    else setIsButtonActivated(false);
  }, [termCons]);
  //

  // MODAL HANDLERS
  const openPolicyModal = (policyType: PolicyType) => {
    setSelectedPolicy(policyType);
    setModalOpen(true);
  };

  const closePolicyModal = () => {
    setModalOpen(false);
  };
  //

  return (
    <div className="grow flex flex-col justify-between overflow-without-scroll">
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
      <div className="grow">
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
              fontFamily: "SUIT-BODY",
              fontSize: "16px",
              color: "#E5E5E9",
            }}
          >
            약관 전체동의
          </p>
          <RoundedCheckbox
            onClick={handleAllTermCon()}
            thisState={acceptAllTermCon}
          />
        </div>
        <div className="mx-3 mb-8">
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "13px",
            }}
          >
            본인은 만 14세 이상이며, 로그인 진행 시 이용 약관,
          </p>
          <p
            style={{
              fontFamily: "SUIT-BODY",
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
            <PolicyRow
              key={idx}
              opt={"필수"}
              txt={txt}
              onClick={handleTermConAction(idx)}
              thisState={termCons[idx]}
              onViewPolicy={() => openPolicyModal(txt as PolicyType)}
            />
          ))}
          <PolicyRow
            opt={"선택"}
            txt={"마케팅 수신 이용 동의"}
            onClick={handleTermConAction(termCons.length - 1)}
            thisState={termCons[termCons.length - 1]}
            onViewPolicy={() => openPolicyModal("마케팅 수신 이용 동의")}
          />
        </div>
      </div>
      <ButtonTemplate
        text="다음"
        isActive={isButtonActivated}
        onClick={() =>
          debouncedRedirect(pathname + "/profile", undefined, {
            accept_marketing: termCons[termCons.length - 1],
          })
        }
      />

      {/* Policy Modal */}
      {selectedPolicy && (
        <PolicyModal
          policyType={selectedPolicy}
          isOpen={modalOpen}
          onClose={closePolicyModal}
        />
      )}
    </div>
  );
}
