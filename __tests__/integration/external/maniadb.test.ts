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

// Mock natural (JaroWinklerDistance)
vi.mock("natural", () => ({
  JaroWinklerDistance: vi.fn((a: string, b: string) => {
    // Simple mock: return 1 if exact match, 0.5 otherwise
    return a.toLowerCase() === b.toLowerCase() ? 1 : 0.5;
  }),
}));

import { POST } from "@/app/api/maniadb/route";

function createMockRequest(body: Record<string, unknown>) {
  return {
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Request;
}

const validManiaDBXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Bohemian Rhapsody</title>
      <maniadb:artist><name>Queen</name></maniadb:artist>
      <maniadb:album><image>https://i.maniadb.com/cover1.jpg</image></maniadb:album>
    </item>
    <item>
      <title>Bohemian Like You</title>
      <maniadb:artist><name>The Dandy Warhols</name></maniadb:artist>
      <maniadb:album><image>https://i.maniadb.com/cover2.jpg</image></maniadb:album>
    </item>
  </channel>
</rss>`;

describe("ManiaDB API - POST /api/maniadb", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 500 when songName is not provided", async () => {
    const req = createMockRequest({});
    const response = await POST(req as any);
    const data = await response.json();

    expect(data.status).toBe(500);
    expect(data.data).toBeNull();
  });

  it("should return parsed song results on success", async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: validManiaDBXml });

    const req = createMockRequest({ songName: "Bohemian" });
    const response = await POST(req as any);
    const data = await response.json();

    expect(data.status).toBe(200);
    expect(data.msg).toBe("Success");
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  });

  it("should include title and artist in results", async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: validManiaDBXml });

    const req = createMockRequest({ songName: "Bohemian Rhapsody" });
    const response = await POST(req as any);
    const data = await response.json();

    const firstItem = data.data[0];
    expect(firstItem).toHaveProperty("title");
    expect(firstItem).toHaveProperty("artist");
    expect(firstItem).toHaveProperty("album_cover_url");
  });

  it("should filter out instrumental tracks", async () => {
    const xmlWithInstrumental = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Song Title (Inst.)</title>
      <maniadb:artist><name>Artist</name></maniadb:artist>
      <maniadb:album><image>https://i.maniadb.com/cover.jpg</image></maniadb:album>
    </item>
    <item>
      <title>Normal Song</title>
      <maniadb:artist><name>Artist</name></maniadb:artist>
      <maniadb:album><image>https://i.maniadb.com/cover2.jpg</image></maniadb:album>
    </item>
  </channel>
</rss>`;

    mockAxiosGet.mockResolvedValueOnce({ data: xmlWithInstrumental });

    const req = createMockRequest({ songName: "Song" });
    const response = await POST(req as any);
    const data = await response.json();

    // Instrumental tracks should be filtered out
    if (data.data) {
      const hasInstrumental = data.data.some((item: any) =>
        /inst\./i.test(item.title)
      );
      expect(hasInstrumental).toBe(false);
    }
  });

  it("should propagate error when ManiaDB API fails", async () => {
    mockAxiosGet.mockRejectedValueOnce(new Error("Network error"));

    const req = createMockRequest({ songName: "Test" });

    // The route does not have a top-level catch on axios.get(),
    // so the error propagates as an unhandled rejection
    await expect(POST(req as any)).rejects.toThrow("Network error");
  });

  it("should call ManiaDB API with correct URL format", async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: validManiaDBXml });

    const req = createMockRequest({ songName: "TestSong" });
    await POST(req as any);

    expect(mockAxiosGet).toHaveBeenCalledWith(
      expect.stringContaining("https://www.maniadb.com/api/search/TestSong")
    );
  });
});
