import { http, HttpResponse } from "msw";

/**
 * Mock ManiaDB XML response
 */
const mockManiaDBXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Bohemian Rhapsody</title>
      <maniadb:artist><name>Queen</name></maniadb:artist>
      <maniadb:album><image>https://i.maniadb.com/test/cover1.jpg</image></maniadb:album>
    </item>
    <item>
      <title>Bohemian Like You</title>
      <maniadb:artist><name>The Dandy Warhols</name></maniadb:artist>
      <maniadb:album><image>https://i.maniadb.com/test/cover2.jpg</image></maniadb:album>
    </item>
  </channel>
</rss>`;

/**
 * Mock Naver Map API response
 */
const mockNaverMapResponse = {
  lastBuildDate: "2024-01-01",
  total: 2,
  start: 1,
  display: 2,
  items: [
    {
      title: "<b>홍대</b> 연습실",
      link: "",
      category: "음악연습실",
      description: "",
      telephone: "",
      address: "서울특별시 마포구 홍익로 123",
      roadAddress: "서울특별시 마포구 홍익로 123",
      mapx: "1268000",
      mapy: "375500",
    },
    {
      title: "<b>홍대</b> 스튜디오",
      link: "",
      category: "녹음실",
      description: "",
      telephone: "",
      address: "서울특별시 마포구 어울마당로 456",
      roadAddress: "서울특별시 마포구 어울마당로 456",
      mapx: "1268100",
      mapy: "375600",
    },
  ],
};

/**
 * MSW request handlers
 */
export const handlers = [
  // ManiaDB song search
  http.get("https://www.maniadb.com/api/search/*", () => {
    return new HttpResponse(mockManiaDBXml, {
      headers: { "Content-Type": "application/xml" },
    });
  }),

  // Naver Map local search
  http.get("https://openapi.naver.com/v1/search/local.json", () => {
    return HttpResponse.json(mockNaverMapResponse);
  }),
];

export { mockManiaDBXml, mockNaverMapResponse };
