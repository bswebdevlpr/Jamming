declare namespace NodeJS {
  interface ProcessEnv {
    // SERVER
    SUPABASE_STORAGE_NAME: string;

    // CLIENT
    KAKAO_CLIENT_ID: string;
    KAKAO_CLIENT_SECRET: string;
    YOUTUBE_KEY: string;
    NAVER_MAP_ID: string;
    NAVER_MAP_SECRET: string;
  }
}
