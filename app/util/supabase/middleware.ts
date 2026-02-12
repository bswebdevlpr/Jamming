import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  PUBLIC_PATHS,
  PROTECTED_PATHS,
  GUEST_ONLY_PATHS,
} from "@/app/lib/constants/paths";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

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

      const url = request.nextUrl.clone();
      url.pathname = data ? "/" : "/signup";
      return NextResponse.redirect(url);
    }
  } catch {
    // Supabase 장애 시에도 페이지 접근은 허용
  }

  return supabaseResponse;
}
