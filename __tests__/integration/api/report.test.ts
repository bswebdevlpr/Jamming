import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockClient } = vi.hoisted(() => ({
  mockClient: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "reporter-id" } },
        error: null,
      }),
    },
    from: vi.fn(),
  },
}));

vi.mock("@/app/util/supabase/server", () => ({
  createClient: vi.fn(async () => mockClient),
}));

vi.mock("@/app/lib/functions/validate", () => ({
  sanitize: vi.fn(async (t: string) => t),
}));

vi.mock("@/app/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

import { createReport } from "@/app/api/functions/report";

const validInput = { jam_id: 1, type: "spam", body: "스팸입니다" };

/**
 * createReport 3-step Supabase 흐름:
 * 1. from("jamsession").select().eq().single()     — 게시글 존재 확인
 * 2. from("report").select().eq().eq().maybeSingle() — 중복 신고 확인
 * 3. from("report").insert({...})                  — 신고 생성
 */
function mockReportFlow({
  jamData = { id: 1, user_id: "author-id" },
  jamError = null,
  existingReport = null,
  insertError = null,
}: {
  jamData?: object | null;
  jamError?: object | null;
  existingReport?: object | null;
  insertError?: object | null;
} = {}) {
  // Step 1: jamsession 조회
  mockClient.from.mockReturnValueOnce({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: jamData, error: jamError }),
      }),
    }),
  });
  // Step 2: 중복 신고 조회
  mockClient.from.mockReturnValueOnce({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: existingReport,
            error: null,
          }),
        }),
      }),
    }),
  });
  // Step 3: insert
  mockClient.from.mockReturnValueOnce({
    insert: vi.fn().mockResolvedValue({ error: insertError }),
  });
}

describe("createReport", () => {
  beforeEach(() => {
    vi.resetAllMocks(); // mockReturnValueOnce 큐까지 초기화
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "reporter-id" } },
      error: null,
    });
  });

  it("should create a report successfully", async () => {
    mockReportFlow();
    const result = await createReport(validInput);
    expect(result.success).toBe(true);
    expect(result.data).toBe(true);
  });

  it("should fail when jam session does not exist", async () => {
    mockReportFlow({
      jamData: null,
      jamError: { code: "PGRST116", message: "not found" },
    });
    const result = await createReport(validInput);
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe("INVALID_JAM");
  });

  it("should fail when jam is null without error", async () => {
    mockReportFlow({ jamData: null, jamError: null });
    const result = await createReport(validInput);
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe("INVALID_JAM");
  });

  it("should fail when reporting own post", async () => {
    mockReportFlow({ jamData: { id: 1, user_id: "reporter-id" } });
    const result = await createReport(validInput);
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe("FORBIDDEN");
  });

  it("should fail when report already exists (duplicate)", async () => {
    mockReportFlow({ existingReport: { id: 99 } });
    const result = await createReport(validInput);
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe("ALREADY_REPORTED");
  });

  it("should sanitize body before inserting", async () => {
    mockReportFlow();
    const { sanitize } = await import("@/app/lib/functions/validate");
    await createReport({ ...validInput, body: "<script>xss</script>" });
    expect(sanitize).toHaveBeenCalledWith("<script>xss</script>");
  });

  it("should fail when Supabase insert fails", async () => {
    mockReportFlow({ insertError: { code: "23000", message: "insert failed" } });
    const result = await createReport(validInput);
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe("UNEXPECTED");
  });

  it("should fail when user is not authenticated", async () => {
    mockClient.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });
    // jamsession mock (step 1 only, will throw before reaching it)
    mockClient.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    });
    const result = await createReport(validInput);
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe("INVALID_SESSION");
  });
});
