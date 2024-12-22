const FlexRow = ({ tag, content }: { tag: string; content: any }) => {
  return (
    <div
      className="flex flex-row items-start px-4 py-2 gap-1"
      style={{
        height: "6.37%",
        borderBottom: "1px solid #333335",
      }}
    >
      <p
        style={{
          width: "19.2%",
          fontFamily: "SUIT-TITLE",
          fontSize: "0.875rem",
          color: "#9F9FA2",
        }}
      >
        {tag}
      </p>
      <div
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          color: "#FFF",
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default function JamSession_Post() {
  return (
    <div className="grow flex flex-col">
      <div
        className="flex flex-row px-4 py-2 gap-3"
        style={{
          borderBottom: "1px solid #333335",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "100px",
            backgroundColor: "#FFBB0C",
          }}
        />
        <div className="grow flex flex-col gap-0.5">
          <div className="flex flex-row gap-2">
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#FFF",
              }}
            >
              JAMJAM
            </p>
            <p
              style={{
                fontFamily: "SUIT-TITLE",
                fontSize: "0.875rem",
                color: "#A3FF0C",
              }}
            >
              280BPM
            </p>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.75rem",
                color: "#9F9FA2",
              }}
            >
              재즈 • 아마추어 • 보컬
            </p>
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.875rem",
                color: "#9F9FA2",
              }}
            >
              4일전
            </p>
          </div>
        </div>
      </div>
      <FlexRow tag="카테고리" content={"ㅋㅋ"} />
      <FlexRow tag="참여 인원" content={"0"} />
      <FlexRow tag="날짜" content={"0000.00.00 00:00"} />
      <FlexRow
        tag="장소"
        content={
          <div className="flex flex-col gap-1">
            <p>재즈스퀘어음악학원</p>
            <p
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.75rem",
                color: "#9F9FA2",
              }}
            >
              경기도 성남시 분당구 돌마로486번길 6 상록프라자
            </p>
          </div>
        }
      />
      <FlexRow
        tag="합주곡"
        content={"내일에서 기다릴게 (I'll See You There Tomorrow)"}
      />
    </div>
  );
}
