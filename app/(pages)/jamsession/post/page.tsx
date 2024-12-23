import { DownArrowWhite } from "@/app/ui/images/arrows";

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
          width: "66.66%",
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          color: "#FFF",
          flexGrow: 1,
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default function JamSession_Post() {
  return (
    <div className="grow h-full max-h-full flex flex-col overflow-hidden">
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
        content={
          <div className="grow flex flex-row justify-between">
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {"내일에서 기다릴게 (I'll See You There Tomorrow"}
            </p>
            <DownArrowWhite />
          </div>
        }
      />
      <hr
        style={{
          border: "none",
          borderTop: "4px solid #323234",
        }}
      />
      <div
        className="px-4 truncate"
        style={{
          width: "100%",
          height: "5%", //"51.77%",
          overflow: "auto",
        }}
      >
        <p
          className="pt-8"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1.125rem",
            color: "#FFF",
          }}
        >
          급구 재즈 드러머
        </p>
        <p
          className="pt-5"
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.875rem",
            color: "#F2F2F4",
          }}
        >
          강남구 신사동에 위치한 대형 라운지에서 공연하는 팀 (방송 출연 및 다수
          앨범 보유 중인 가수, 싱어송라이터, 보컬 트레이너, 작곡가, 믹싱
          엔지니어, 유튜버, BJ, 실용음악 전공 재학생 등 다양한 분야의 전공자가
          팀원으로 활동 중) 으로 공연 이외에도 많은 음악적 교류 (각종 행사 및
          축가 공연, 오디션, 방송 출연 섭외, 기획사 추천 등) 가 이루어지는 팀
          입니다.
          <br /> 1. 모집 내용 : 20세 ~ 35세 남 / 여 보컬 및 댄서 (동반 지원
          가능)
          <br /> 2. 근무 지역 : 서울특별시 강남구 신사동 (압구정역 도보 5분) 3.
          근무 요일 : 월요일 ~ 일요일 중 협의 (출근 일 수 및 요일 조정 가능)
          <br /> 4. 근무 시간 : PM 06:00 ~ AM 04:00 / PM 08:00 ~ AM 06:00 중 택1
          (휴게 시간 포함 평균 8시간 근무) 5. 근무 내용 : 음향기기 점검 및 세팅
          / 라이브 공연 (노래, 댄스, 마술 등의 공연 버스킹)
          <br /> 6. 급 여 : 월 400~600 (일 평균 10~50) (당일 현금 지급 / 개인 및
          경력에 따른 차이 있음)
          <br /> 7. 학 력 : 무관 (비전공자 및 무경력자 지원 가능)
          <br /> 8. 복리 후생 : 근무 간 무료 식사 제공, 연습실 제공 (코칭 및
          티칭 가능)
          <br /> 9. 우대 조건 : 실용음악 전공자, 연습생 경력, 공연팀 경력,
          음원발매 경력, 방송출연 경력, 유튜버, BJ, 보컬트레이너, 기타/피아노
          연주자, 동종 업계 경험자 면접 시 공연 참관 및 당일 체험도 가능하며
          지원 및 자세한 내용은 아래 연락처로 문자 바랍니다.
        </p>
      </div>
    </div>
  );
}
