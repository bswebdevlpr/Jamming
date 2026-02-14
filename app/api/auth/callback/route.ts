import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/app/util/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const redirectParam = searchParams.get("redirect");

  if (code) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // 서버 측 로깅 (클라이언트에 노출 안됨)
      console.error("[OAuth Callback] Session exchange failed:", {
        message: error.message,
        status: error.status,
      });

      // 에러 타입 구분
      const errorType = error.message?.toLowerCase().includes("org")
        ? "org_restricted"
        : "auth_code_error";

      return NextResponse.redirect(`${origin}/signin?error=${errorType}`);
    }

    if (data) {
      const user = await supabase
        .from("user")
        .select()
        .eq("id", data.user.id)
        .single()
        .then((res) => res.data);

      // 보안: 상대 경로만 허용 (Open Redirect 방지)
      const isValidRedirect =
        redirectParam &&
        redirectParam.startsWith("/") &&
        !redirectParam.startsWith("//") &&
        !redirectParam.includes("\\") &&
        !redirectParam.includes("%");

      let next: string;
      if (user) {
        // 기존 사용자
        next = isValidRedirect ? redirectParam : "/";
      } else {
        // 신규 사용자: user_metadata에서 accept_marketing 확인
        const acceptMarketing = data.user.user_metadata?.accept_marketing;

        if (acceptMarketing !== undefined) {
          // 이메일 가입 사용자: /email에서 이미 약관 동의 완료
          // policy 단계 건너뛰고 profile로 직접 이동
          next = `/signup/profile?accept_marketing=${acceptMarketing}`;
        } else {
          // OAuth 가입 사용자: 약관 동의 단계부터 시작
          next = "/signup";
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";

      // 허용된 호스트 목록 (환경변수 또는 하드코딩)
      const allowedHosts = process.env.ALLOWED_HOSTS?.split(",") || [];
      const productionDomain = process.env.DOMAIN?.replace(
        /^https?:\/\//,
        ""
      );
      if (productionDomain && !allowedHosts.includes(productionDomain)) {
        allowedHosts.push(productionDomain);
      }

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost && allowedHosts.includes(forwardedHost)) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to signin page with error
  return NextResponse.redirect(`${origin}/signin?error=auth_code_error`);
}
