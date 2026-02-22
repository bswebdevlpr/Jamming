import { Agent, type Dispatcher } from "undici";
import { rootCertificates } from "node:tls";

// RequestInit 타입 확장 (undici의 dispatcher 속성 지원)
interface UndiciRequestInit extends RequestInit {
  dispatcher?: Dispatcher;
}

// 에러 메시지 상수
const SSL_ERROR_MESSAGES = {
  FAILED_CREATE: "[SSL] Failed to create SSL fetch",
  FALLBACK: "[SSL] Falling back to default fetch",
  INVALID_BASE64: "[SSL] Invalid base64 format in SUPABASE_SSL_CA_BASE64",
  INVALID_PEM: "[SSL] Invalid PEM format - missing BEGIN marker",
} as const;

// 싱글톤 캐시
let cachedFetch: typeof fetch | undefined | null = null;

/**
 * Supabase SSL CA 인증서를 base64 환경변수에서 디코딩하여
 * undici Agent가 포함된 custom fetch 함수를 생성합니다.
 *
 * 캐싱을 통해 매 요청마다 Agent를 재생성하지 않고 재사용합니다.
 *
 * @returns custom fetch 함수 (환경변수 없으면 undefined)
 */
export function createSSLFetch(): typeof fetch | undefined {
  // 이미 초기화되었으면 캐시된 값 반환
  if (cachedFetch !== null) {
    return cachedFetch;
  }

  const base64Cert = process.env.SUPABASE_SSL_CA_BASE64;

  // 환경변수 없으면 기본 fetch 사용 (선택적 기능)
  if (!base64Cert) {
    cachedFetch = undefined;
    return undefined;
  }

  // base64 형식 검증
  if (!/^[A-Za-z0-9+/=]+$/.test(base64Cert)) {
    console.error(SSL_ERROR_MESSAGES.INVALID_BASE64);
    cachedFetch = undefined;
    return undefined;
  }

  try {
    // base64 디코딩 → PEM 형식 추출
    const certPem = Buffer.from(base64Cert, "base64").toString("utf-8");

    // PEM 형식 검증 (BEGIN, END 마커 모두 확인)
    if (
      !certPem.includes("-----BEGIN CERTIFICATE-----") ||
      !certPem.includes("-----END CERTIFICATE-----")
    ) {
      console.error(SSL_ERROR_MESSAGES.INVALID_PEM);
      cachedFetch = undefined;
      return undefined;
    }

    // 시스템 CA + 커스텀 CA 결합
    const allCAs = [...rootCertificates, certPem];

    // undici Agent 생성 (시스템 CA + custom CA 적용)
    const dispatcher = new Agent({
      connect: {
        ca: allCAs,
      },
    });

    // custom fetch 함수 생성 및 캐싱
    cachedFetch = (url: RequestInfo | URL, init?: RequestInit) => {
      const undiciInit: UndiciRequestInit = { ...init, dispatcher };
      return fetch(url, undiciInit);
    };

    return cachedFetch;
  } catch (error) {
    // 에러 타입만 로그, 실제 값은 로그하지 않음 (보안)
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(SSL_ERROR_MESSAGES.FAILED_CREATE, errorMessage);
    console.warn(SSL_ERROR_MESSAGES.FALLBACK);
    cachedFetch = undefined;
    return undefined;
  }
}

/**
 * Supabase 클라이언트 global 설정 객체를 반환합니다.
 * createSSLFetch()가 성공하면 custom fetch를 포함, 실패하면 빈 객체 반환
 */
export function getSSLConfig() {
  const customFetch = createSSLFetch();
  return customFetch ? { fetch: customFetch } : {};
}

/**
 * SSL fetch 캐시를 초기화합니다.
 * 주로 테스트나 환경변수 재로드 시 사용합니다.
 */
export function resetSSLCache() {
  cachedFetch = null;
}
