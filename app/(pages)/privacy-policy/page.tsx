import PrivacyPolicyContent from "./content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "Jamming의 개인정보 수집 및 이용에 관한 정책입니다.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
