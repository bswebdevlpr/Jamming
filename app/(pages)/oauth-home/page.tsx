import type { Metadata } from "next";
import OAuthPage from "./oauth-page";

export const metadata: Metadata = {
  title: "JAMMING - 음악인을 위한 합주 매칭 플랫폼",
  description:
    "JAMMING은 음악인을 위한 합주 매칭 플랫폼입니다. 지역·장르·레벨별로 딱 맞는 세션을 찾고, 밴드를 관리하고, 음악인 커뮤니티를 만드세요. 밴드 멤버 구하기, 잼 세션 매칭, 합주실 공유까지 한 곳에서 모두 해결합니다. 아마추어부터 프로까지, 전국 19개 지역에서 사용 가능합니다.",
  alternates: {
    canonical: "https://jamming.co.kr/oauth-home",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "JAMMING - 음악인을 위한 합주 매칭 플랫폼",
    description:
      "JAMMING은 음악인을 위한 합주 매칭 플랫폼입니다. 밴드 멤버 구하기, 잼 세션 매칭, 합주실 공유 등 음악인을 위한 올인원 플랫폼입니다. 전국 19개 지역에서 장르, 포지션, 레벨별로 딱 맞는 세션을 찾고, 실시간으로 참여하세요.",
    url: "https://jamming.co.kr/oauth-home",
    siteName: "JAMMING",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JAMMING - 음악인을 위한 합주 매칭 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JAMMING - 음악인을 위한 합주 매칭 플랫폼",
    description:
      "JAMMING은 음악인을 위한 합주 매칭 플랫폼입니다. 밴드 멤버 구하기, 잼 세션 매칭, 합주실 공유 등 음악인을 위한 올인원 플랫폼입니다. 전국 19개 지역에서 장르, 포지션, 레벨별로 딱 맞는 세션을 찾고, 실시간으로 참여하세요.",
    images: ["/og-image.png"],
  },
};

export default function OAuth홈페이지() {
  return <OAuthPage />;
}
