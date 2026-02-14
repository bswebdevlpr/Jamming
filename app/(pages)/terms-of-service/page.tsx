import TermsOfServiceContent from "./content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 이용약관",
  description: "Jamming의 서비스 이용에 관한 약관입니다.",
};

export default function TermsOfServicePage() {
  return <TermsOfServiceContent />;
}
