import CancelButton from "@/app/ui/buttons/cancel";
import CompleteButton from "@/app/ui/buttons/complete";
import GridItem from "@/app/ui/grids/item";

export type BottomSheetContentType = null | "position" | "genre" | "bandType";

const BottomSheetContent = ({
  type,
  handleCancel,
  handleComplete,
}: {
  type: BottomSheetContentType;
  handleCancel: () => void;
  handleComplete: () => void;
}) => {
  const title =
    type === "position"
      ? "포지션 선택"
      : type === "genre"
      ? "장르 선택"
      : type === "bandType"
      ? "밴드 유형 선택"
      : null;

  const body = () => {
    if (type === "position")
      return (
        <>
          <GridItem content="기타" />
          <GridItem content="베이스" />
          <GridItem content="드럼" />
          <GridItem content="보컬" />
          <GridItem content="키보드" />
        </>
      );
    else if (type === "genre")
      return (
        <>
          <GridItem content="종합" />
          <GridItem content="락" />
          <GridItem content="팝" />
          <GridItem content="인디" />
          <GridItem content="재즈" />
          <GridItem content="펑크" />
          <GridItem content="메탈" />
        </>
      );
    else if (type === "bandType")
      return (
        <>
          <GridItem content="프로" />
          <GridItem content="아마추어" />
          <GridItem content="스터디" />
          <GridItem content="직장인 밴드" />
        </>
      );
    else return null;
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex flex-col items-center gap-2">
        <p
          style={{
            fontFamily: "SUIT-Body",
            fontSize: "20px",
            color: "#C0C0C5",
          }}
        >
          {title}
        </p>
        {/* {
            <p
          style={{
            fontFamily: "SUIT-Body",
            fontSize: "12px",
            color: "#9F9FA2",
          }}
        >
          (최대 3개)
        </p>
        } */}
      </div>
      <div className="grow flex flex-col justify-end mb-7">
        {/* 선택사항들 */}
        <div className="grid grid-cols-3 gap-1">{body()}</div>
      </div>
      {/* 취소/완료 버튼 */}
      <div className="flex justify-center gap-2 mb-2">
        <CancelButton onClick={handleCancel} />
        <CompleteButton onClick={handleComplete} />
      </div>
    </div>
  );
};

export default BottomSheetContent;
