import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted to create mocks that survive hoisting
const { mockAxiosGet } = vi.hoisted(() => ({
  mockAxiosGet: vi.fn(),
}));

// Mock axios before import
vi.mock("axios", () => ({
  default: { get: mockAxiosGet },
}));

// Mock logger
vi.mock("@/app/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock sanitize-html
vi.mock("sanitize-html", () => ({
  default: vi.fn((input: string) => input.replace(/<[^>]*>/g, "")),
}));

import { POST } from "@/app/api/naver/map/route";

function createMockRequest(body: Record<string, unknown>) {
  return {
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Request;
}

const mockNaverResponse = {
  items: [
    {
      title: "<b>Test</b> Studio",
      address: "Seoul Mapo-gu",
      category: "Music Studio",
    },
    {
      title: "<b>Test</b> Room",
      address: "Seoul Gangnam-gu",
      category: "Practice Room",
    },
  ],
};

describe("Naver Map API - POST /api/naver/map", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 500 when location is not provided", async () => {
    const req = createMockRequest({});
    const response = await POST(req as any);
    const data = await response.json();

    expect(data.status).toBe(500);
    expect(data.data).toBeNull();
  });

  it("should return parsed location results on success", async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: mockNaverResponse });

    const req = createMockRequest({ location: "hongdae" });
    const response = await POST(req as any);
    const data = await response.json();

    expect(data.status).toBe(200);
    expect(data.msg).toBe("Success");
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBe(2);
  });

  it("should sanitize HTML from location titles", async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: mockNaverResponse });

    const req = createMockRequest({ location: "test" });
    const response = await POST(req as any);
    const data = await response.json();

    // Sanitized titles should not contain HTML tags
    data.data.forEach((item: any) => {
      expect(item.name).not.toContain("<b>");
      expect(item.name).not.toContain("</b>");
    });
  });

  it("should include name, address, and category in results", async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: mockNaverResponse });

    const req = createMockRequest({ location: "gangnam" });
    const response = await POST(req as any);
    const data = await response.json();

    const firstItem = data.data[0];
    expect(firstItem).toHaveProperty("name");
    expect(firstItem).toHaveProperty("address");
    expect(firstItem).toHaveProperty("category");
  });

  it("should send correct headers to Naver API", async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: mockNaverResponse });

    const req = createMockRequest({ location: "test" });
    await POST(req as any);

    expect(mockAxiosGet).toHaveBeenCalledWith(
      expect.stringContaining("https://openapi.naver.com/v1/search/local.json"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Naver-Client-Id": process.env.NAVER_MAP_ID,
          "X-Naver-Client-Secret": process.env.NAVER_MAP_SECRET,
        }),
      })
    );
  });

  it("should handle Naver API failure gracefully", async () => {
    mockAxiosGet.mockRejectedValueOnce(new Error("Network error"));

    const req = createMockRequest({ location: "test" });
    const response = await POST(req as any);
    const data = await response.json();

    expect(data.status).toBe(500);
    expect(data.msg).toBe("Failed to request");
    expect(data.data).toBeNull();
  });

  it("should handle empty results from Naver API", async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: { items: [] } });

    const req = createMockRequest({ location: "nonexistent" });
    const response = await POST(req as any);
    const data = await response.json();

    expect(data.status).toBe(200);
    expect(data.data).toEqual([]);
  });

  it("should include query in URL", async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: mockNaverResponse });

    const req = createMockRequest({ location: "hongdae studio" });
    await POST(req as any);

    expect(mockAxiosGet).toHaveBeenCalledWith(
      expect.stringContaining("query=hongdae studio"),
      expect.any(Object)
    );
  });
});
