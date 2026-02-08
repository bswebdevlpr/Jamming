import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { PUBLIC_PATHS } from "@/app/lib/constants/paths";

const protectedPaths = ["/jamsession", "/mypage", "/myact", "/user-profile"];

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
    const isProtected = protectedPaths.some((path) =>
      pathname.startsWith(path)
    );
    const isPublicException = PUBLIC_PATHS.some((path) =>
      pathname.startsWith(path)
    );

    if (!user && isProtected && !isPublicException) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  } catch {
    // Supabase 장애 시에도 페이지 접근은 허용
  }

  return supabaseResponse;
}
