import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  PUBLIC_PATHS,
  PROTECTED_PATHS,
  GUEST_ONLY_PATHS,
} from "@/app/lib/constants/paths";
import { getSSLConfig } from "./ssl";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    global: getSSLConfig(),
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // 공개 예외 경로 체크
    const isPublicException = PUBLIC_PATHS.some((path) =>
      pathname.startsWith(path)
    );
    if (isPublicException) {
      return supabaseResponse;
    }

    // 보호된 경로: 비로그인 사용자는 /signin으로 리다이렉트
    const isProtected = PROTECTED_PATHS.some((path) =>
      pathname.startsWith(path)
    );
    if (!user && isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("redirect", pathname); // 원래 경로 보존
      return NextResponse.redirect(url);
    }

    // Guest-only 경로: 로그인 사용자는 / 또는 /signup으로 리다이렉트
    const isGuestOnly = GUEST_ONLY_PATHS.some((path) =>
      pathname.startsWith(path)
    );
    if (user && isGuestOnly) {
      // 회원가입 완료 여부 체크 (DB 조회)
      const { data } = await supabase
        .from("user")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        // 기존 사용자: 이미 가입 완료 → 홈으로
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      // 신규 사용자 (DB 미등록): /signup 경로는 접근 허용 (회원가입 진행 중)
      if (pathname.startsWith("/signup")) {
        return supabaseResponse;
      }

      // 신규 사용자가 /signin, /email 등에 접근 → /signup으로
      const url = request.nextUrl.clone();
      url.pathname = "/signup";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Middleware] Auth check failed:", error);
    }
    // Supabase 장애 시에도 페이지 접근은 허용
  }

  return supabaseResponse;
}
