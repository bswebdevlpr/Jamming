import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Jamming - 음악인을 위한 합주 매칭 플랫폼";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111113",
          gap: "24px",
        }}
      >
        <svg
          width="149"
          height="138"
          viewBox="0 0 149 138"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0)">
            <path
              d="M97.8716 18.5106L66.9794 107.408L15.1221 81.0754L0 125.327L79.7528 138L111.478 21.6209L145.818 31.1257L149 8.39072L104.143 0"
              fill="#A3FF0C"
            />
            <path
              d="M26.3336 60.1798C26.3336 55.8182 22.8085 52.2823 18.4601 52.2823C14.1117 52.2823 10.5867 55.8182 10.5867 60.1798C10.5867 64.5415 14.1117 68.0773 18.4601 68.0773C22.8085 68.0773 26.3336 64.5415 26.3336 60.1798Z"
              fill="#A3FF0C"
            />
            <path
              d="M67.9281 44.3849C67.9281 40.0232 64.403 36.4874 60.0546 36.4874C55.7062 36.4874 52.1812 40.0232 52.1812 44.3849C52.1812 48.7466 55.7062 52.2824 60.0546 52.2824C64.403 52.2824 67.9281 48.7466 67.9281 44.3849Z"
              fill="#A3FF0C"
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="149" height="138" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <p
            style={{
              color: "#A3FF0C",
              fontSize: "64px",
              fontWeight: 700,
              margin: 0,
              lineHeight: 1,
            }}
          >
            JAMMING
          </p>
          <p
            style={{
              color: "#ededed",
              fontSize: "28px",
              margin: 0,
              lineHeight: 1,
            }}
          >
            놀기 위해 모였다!
          </p>
          <p
            style={{
              color: "#9F9FA2",
              fontSize: "20px",
              margin: 0,
              lineHeight: 1,
            }}
          >
            음악인을 위한 합주 매칭 플랫폼
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
