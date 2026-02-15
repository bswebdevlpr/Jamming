/** 비인증 사용자에게 접근을 허용하는 경로 목록 */
export const PUBLIC_PATHS = ["/jamsession/post/", "/api/auth/callback"];

/** 인증이 필요한 경로 목록 (Middleware에서 사용) */
export const PROTECTED_PATHS = [
  "/jamsession",
  "/mypage",
  "/myact",
  "/user-profile",
  "/band",
  "/recruit",
];

/** 로그인 사용자가 접근할 수 없는 경로 (signin, signup 등) */
export const GUEST_ONLY_PATHS = ["/signin", "/email", "/signup"];
