import { describe, it, expect } from "vitest";
import {
  CustomError,
  ErrorCode,
  CustomErrMsg,
} from "@/app/lib/errors/custom-error";

describe("CustomError", () => {
  describe("constructor", () => {
    it("should create an error with code and default message", () => {
      const error = new CustomError(ErrorCode.UNEXPECTED);
      expect(error.code).toBe(ErrorCode.UNEXPECTED);
      expect(error.userMessage).toBe(
        "예기치 못한 문제가 발생했습니다. 문제가 지속적으로 발생한다면 피드백을 전송해주세요."
      );
      expect(error.name).toBe("CustomError");
      expect(error.context).toEqual({});
    });

    it("should create an error with context", () => {
      const context = { operation: "test", supabaseCode: "23505" };
      const error = new CustomError(ErrorCode.FORBIDDEN, context);
      expect(error.code).toBe(ErrorCode.FORBIDDEN);
      expect(error.context).toEqual(context);
    });

    it("should be an instance of Error", () => {
      const error = new CustomError(ErrorCode.UNEXPECTED);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CustomError);
    });
  });

  describe("factory methods", () => {
    it("unexpected() should create UNEXPECTED error", () => {
      const error = CustomError.unexpected({ operation: "test" });
      expect(error.code).toBe(ErrorCode.UNEXPECTED);
      expect(error.context.operation).toBe("test");
    });

    it("forbidden() should create FORBIDDEN error", () => {
      const error = CustomError.forbidden();
      expect(error.code).toBe(ErrorCode.FORBIDDEN);
      expect(error.userMessage).toBe("권한이 없습니다.");
    });

    it("invalidSession() should create INVALID_SESSION error", () => {
      const error = CustomError.invalidSession();
      expect(error.code).toBe(ErrorCode.INVALID_SESSION);
    });

    it("invalidJam() should create INVALID_JAM error", () => {
      const error = CustomError.invalidJam();
      expect(error.code).toBe(ErrorCode.INVALID_JAM);
    });

    it("invalidUser() should create INVALID_USER error", () => {
      const error = CustomError.invalidUser();
      expect(error.code).toBe(ErrorCode.INVALID_USER);
    });

    it("signupFailed() should create SIGNUP_FAILED error", () => {
      const error = CustomError.signupFailed();
      expect(error.code).toBe(ErrorCode.SIGNUP_FAILED);
    });

    it("securityViolation() should create SECURITY_VIOLATION error", () => {
      const error = CustomError.securityViolation();
      expect(error.code).toBe(ErrorCode.SECURITY_VIOLATION);
      expect(error.userMessage).toBe(
        "보안 위반이 감지되었습니다. 입력 내용을 확인해주세요."
      );
    });

    it("bandLimitReached() should create BAND_LIMIT_REACHED error", () => {
      const error = CustomError.bandLimitReached();
      expect(error.code).toBe(ErrorCode.BAND_LIMIT_REACHED);
    });

    it("memberLimitReached() should create MEMBER_LIMIT_REACHED error", () => {
      const error = CustomError.memberLimitReached();
      expect(error.code).toBe(ErrorCode.MEMBER_LIMIT_REACHED);
    });

    it("alreadyMember() should create ALREADY_MEMBER error", () => {
      const error = CustomError.alreadyMember();
      expect(error.code).toBe(ErrorCode.ALREADY_MEMBER);
    });

    it("alreadyApplied() should create ALREADY_APPLIED error", () => {
      const error = CustomError.alreadyApplied();
      expect(error.code).toBe(ErrorCode.ALREADY_APPLIED);
    });

    it("recruitNotActive() should create RECRUIT_NOT_ACTIVE error", () => {
      const error = CustomError.recruitNotActive();
      expect(error.code).toBe(ErrorCode.RECRUIT_NOT_ACTIVE);
    });

    it("notBandLeader() should create NOT_BAND_LEADER error", () => {
      const error = CustomError.notBandLeader();
      expect(error.code).toBe(ErrorCode.NOT_BAND_LEADER);
    });

    it("rateLimitExceeded() should create RATE_LIMIT_EXCEEDED error", () => {
      const error = CustomError.rateLimitExceeded();
      expect(error.code).toBe(ErrorCode.RATE_LIMIT_EXCEEDED);
      expect(error.userMessage).toBe(
        "요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요."
      );
    });

    it("validationFailed() should create VALIDATION_FAILED error", () => {
      const error = CustomError.validationFailed({
        operation: "createPost",
      });
      expect(error.code).toBe(ErrorCode.VALIDATION_FAILED);
    });

    it("searchFailed() should create SEARCH_FAILED error", () => {
      const error = CustomError.searchFailed();
      expect(error.code).toBe(ErrorCode.SEARCH_FAILED);
    });

    it("imageUploadFailed() should create IMAGE_UPLOAD_FAILED error", () => {
      const error = CustomError.imageUploadFailed();
      expect(error.code).toBe(ErrorCode.IMAGE_UPLOAD_FAILED);
    });
  });

  describe("fromSupabaseError", () => {
    it("should convert a Supabase DB error", () => {
      const supabaseError = {
        code: "23505",
        message: "duplicate key value",
        details: "Key already exists",
        hint: "Use upsert",
      };
      const error = CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        supabaseError,
        "insertRecord"
      );
      expect(error.code).toBe(ErrorCode.UNEXPECTED);
      expect(error.context.supabaseCode).toBe("23505");
      expect(error.context.supabaseMessage).toBe("duplicate key value");
      expect(error.context.supabaseDetails).toBe("Key already exists");
      expect(error.context.supabaseHint).toBe("Use upsert");
      expect(error.context.operation).toBe("insertRecord");
    });
  });

  describe("fromAuthError", () => {
    it("should convert a Supabase auth error", () => {
      const authError = { message: "Invalid credentials", status: 401 };
      const error = CustomError.fromAuthError(
        ErrorCode.INVALID_SESSION,
        authError,
        "signIn"
      );
      expect(error.code).toBe(ErrorCode.INVALID_SESSION);
      expect(error.context.supabaseMessage).toBe("Invalid credentials");
      expect(error.context.httpStatus).toBe(401);
      expect(error.context.operation).toBe("signIn");
    });
  });

  describe("toClientSafe", () => {
    it("should return only code and user message without context", () => {
      const error = new CustomError(ErrorCode.FORBIDDEN, {
        supabaseCode: "secret_code",
        operation: "sensitive_operation",
      });
      const safe = error.toClientSafe();
      expect(safe).toEqual({
        code: ErrorCode.FORBIDDEN,
        message: "권한이 없습니다.",
      });
      expect(safe).not.toHaveProperty("context");
      expect(safe).not.toHaveProperty("supabaseCode");
    });
  });

  describe("CustomErrMsg", () => {
    it("NicknameNotUnique should have the correct message", () => {
      expect(CustomErrMsg.NicknameNotUnique).toBe(
        "이미 존재하는 닉네임입니다."
      );
    });
  });

  describe("ErrorCode enum", () => {
    it("should have all expected error codes", () => {
      expect(ErrorCode.UNEXPECTED).toBe("UNEXPECTED");
      expect(ErrorCode.FORBIDDEN).toBe("FORBIDDEN");
      expect(ErrorCode.SECURITY_VIOLATION).toBe("SECURITY_VIOLATION");
      expect(ErrorCode.RATE_LIMIT_EXCEEDED).toBe("RATE_LIMIT_EXCEEDED");
      expect(ErrorCode.BAND_LIMIT_REACHED).toBe("BAND_LIMIT_REACHED");
      expect(ErrorCode.MEMBER_LIMIT_REACHED).toBe("MEMBER_LIMIT_REACHED");
      expect(ErrorCode.NOT_BAND_LEADER).toBe("NOT_BAND_LEADER");
      expect(ErrorCode.ALREADY_MEMBER).toBe("ALREADY_MEMBER");
      expect(ErrorCode.ALREADY_APPLIED).toBe("ALREADY_APPLIED");
      expect(ErrorCode.RECRUIT_NOT_ACTIVE).toBe("RECRUIT_NOT_ACTIVE");
    });
  });
});
