/**
 * ErrorCode - 클라이언트가 프로그래밍적으로 에러를 분기할 수 있는 열거형
 */
export enum ErrorCode {
  UNEXPECTED = "UNEXPECTED",
  FORBIDDEN = "FORBIDDEN",
  INVALID_SESSION = "INVALID_SESSION",
  INVALID_JAM = "INVALID_JAM",
  INVALID_USER = "INVALID_USER",
  SIGNUP_FAILED = "SIGNUP_FAILED",
  GET_JAM_FEED = "GET_JAM_FEED",
  IMAGE_UPLOAD_FAILED = "IMAGE_UPLOAD_FAILED",
  PLAYLIST_UPDATE_FAILED = "PLAYLIST_UPDATE_FAILED",
  SEARCH_FAILED = "SEARCH_FAILED",
  SECURITY_VIOLATION = "SECURITY_VIOLATION",
  VALIDATION_FAILED = "VALIDATION_FAILED",
  NICKNAME_NOT_UNIQUE = "NICKNAME_NOT_UNIQUE",
  INVALID_BAND = "INVALID_BAND",
  INVALID_RECRUIT = "INVALID_RECRUIT",
  BAND_LIMIT_REACHED = "BAND_LIMIT_REACHED",
  MEMBER_LIMIT_REACHED = "MEMBER_LIMIT_REACHED",
  ALREADY_MEMBER = "ALREADY_MEMBER",
  ALREADY_APPLIED = "ALREADY_APPLIED",
  RECRUIT_NOT_ACTIVE = "RECRUIT_NOT_ACTIVE",
  NOT_BAND_LEADER = "NOT_BAND_LEADER",
}

/**
 * ErrorCode별 사용자 친화적 메시지
 */
const USER_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.UNEXPECTED]:
    "예기치 못한 문제가 발생했습니다. 문제가 지속적으로 발생한다면 피드백을 전송해주세요.",
  [ErrorCode.FORBIDDEN]: "권한이 없습니다.",
  [ErrorCode.INVALID_SESSION]:
    "회원정보를 불러오는 데에 실패했습니다. 문제가 지속적으로 발생한다면 피드백을 전송해주세요.",
  [ErrorCode.INVALID_JAM]: "유효하지 않은 잼세션입니다.",
  [ErrorCode.INVALID_USER]: "일치하는 유저를 찾을 수 없습니다.",
  [ErrorCode.SIGNUP_FAILED]:
    "회원가입에 실패했습니다. 새로고침후 다시 진행해주세요. 계속 실패한다면 처음부터 다시 진행해주세요.",
  [ErrorCode.GET_JAM_FEED]:
    "잼세션 목록을 불러오는 데에 실패했습니다. 문제가 지속적으로 발생한다면 피드백을 전송해주세요.",
  [ErrorCode.IMAGE_UPLOAD_FAILED]:
    "이미지 업로드에 실패했습니다. 문제가 지속적으로 발생한다면 피드백을 전송해주세요.",
  [ErrorCode.PLAYLIST_UPDATE_FAILED]:
    "연주목록 항목 업데이트에 실패했습니다. 문제가 지속적으로 발생한다면 피드백을 전송해주세요.",
  [ErrorCode.SEARCH_FAILED]:
    "곡 검색에 실패했습니다. 문제가 지속적으로 발생한다면 피드백을 전송해주세요.",
  [ErrorCode.SECURITY_VIOLATION]:
    "보안 위반이 감지되었습니다. 입력 내용을 확인해주세요.",
  [ErrorCode.VALIDATION_FAILED]: "입력값이 올바르지 않습니다.",
  [ErrorCode.NICKNAME_NOT_UNIQUE]: "이미 존재하는 닉네임입니다.",
  [ErrorCode.INVALID_BAND]: "유효하지 않은 밴드입니다.",
  [ErrorCode.INVALID_RECRUIT]: "유효하지 않은 구인 게시글입니다.",
  [ErrorCode.BAND_LIMIT_REACHED]: "밴드 생성/참여 한도에 도달했습니다.",
  [ErrorCode.MEMBER_LIMIT_REACHED]: "밴드 멤버 수가 최대 인원에 도달했습니다.",
  [ErrorCode.ALREADY_MEMBER]: "이미 해당 밴드의 멤버입니다.",
  [ErrorCode.ALREADY_APPLIED]: "이미 지원한 게시글입니다.",
  [ErrorCode.RECRUIT_NOT_ACTIVE]: "마감된 구인 게시글입니다.",
  [ErrorCode.NOT_BAND_LEADER]: "밴드장만 수행할 수 있는 작업입니다.",
};

/**
 * Supabase 에러 및 기타 원본 에러 정보를 보존하는 컨텍스트
 */
export interface ErrorContext {
  supabaseCode?: string;
  supabaseMessage?: string;
  supabaseDetails?: string;
  supabaseHint?: string;
  httpStatus?: number;
  operation?: string;
  originalError?: unknown;
}

/**
 * CustomErrMsg - 기존 호환성 유지용 (signup/profile에서 사용)
 */
export class CustomErrMsg {
  static NicknameNotUnique = USER_MESSAGES[ErrorCode.NICKNAME_NOT_UNIQUE];
}

/**
 * CustomError - 구조화된 에러 클래스
 *
 * ErrorCode 기반 팩토리 메서드를 사용하여 인스턴스를 생성합니다.
 * Supabase 에러의 code, message, details, hint 정보를 ErrorContext에 보존합니다.
 */
export class CustomError extends Error {
  readonly code: ErrorCode;
  readonly userMessage: string;
  readonly context: ErrorContext;

  constructor(code: ErrorCode, context?: ErrorContext) {
    super(USER_MESSAGES[code]);
    this.code = code;
    this.userMessage = USER_MESSAGES[code];
    this.context = context ?? {};
    this.name = "CustomError";
  }

  // ========== 팩토리 메서드 ==========

  static unexpected(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.UNEXPECTED, context);
  }

  static forbidden(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.FORBIDDEN, context);
  }

  static invalidSession(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.INVALID_SESSION, context);
  }

  static invalidJam(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.INVALID_JAM, context);
  }

  static invalidUser(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.INVALID_USER, context);
  }

  static signupFailed(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.SIGNUP_FAILED, context);
  }

  static getJamFeed(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.GET_JAM_FEED, context);
  }

  static imageUploadFailed(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.IMAGE_UPLOAD_FAILED, context);
  }

  static playlistUpdateFailed(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.PLAYLIST_UPDATE_FAILED, context);
  }

  static searchFailed(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.SEARCH_FAILED, context);
  }

  static securityViolation(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.SECURITY_VIOLATION, context);
  }

  static validationFailed(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.VALIDATION_FAILED, context);
  }

  static invalidBand(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.INVALID_BAND, context);
  }

  static invalidRecruit(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.INVALID_RECRUIT, context);
  }

  static bandLimitReached(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.BAND_LIMIT_REACHED, context);
  }

  static memberLimitReached(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.MEMBER_LIMIT_REACHED, context);
  }

  static alreadyMember(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.ALREADY_MEMBER, context);
  }

  static alreadyApplied(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.ALREADY_APPLIED, context);
  }

  static recruitNotActive(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.RECRUIT_NOT_ACTIVE, context);
  }

  static notBandLeader(context?: ErrorContext): CustomError {
    return new CustomError(ErrorCode.NOT_BAND_LEADER, context);
  }

  // ========== Supabase 에러 변환 헬퍼 ==========

  /**
   * PostgrestError (DB 에러)를 CustomError로 변환
   */
  static fromSupabaseError(
    code: ErrorCode,
    error: { code?: string; message?: string; details?: string; hint?: string },
    operation?: string
  ): CustomError {
    return new CustomError(code, {
      supabaseCode: error.code,
      supabaseMessage: error.message,
      supabaseDetails: error.details,
      supabaseHint: error.hint,
      operation,
    });
  }

  /**
   * AuthError (인증 에러)를 CustomError로 변환
   */
  static fromAuthError(
    code: ErrorCode,
    error: { message?: string; status?: number },
    operation?: string
  ): CustomError {
    return new CustomError(code, {
      supabaseMessage: error.message,
      httpStatus: error.status,
      operation,
    });
  }

  /**
   * 클라이언트에 전달할 안전한 에러 정보 (민감 정보 제외)
   */
  toClientSafe(): { code: ErrorCode; message: string } {
    return {
      code: this.code,
      message: this.userMessage,
    };
  }

}
