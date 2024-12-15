import CancelButton from "@/app/ui/buttons/cancel";
import CompleteButton from "@/app/ui/buttons/complete";
import Grid from "@/app/ui/grids/grid";
import GridItem from "@/app/ui/grids/item";

const positions = ["기타", "베이스", "드럼", "보컬", "키보드"];
const genres = ["종합", "락", "팝", "인디", "재즈", "펑크", "메탈"];
const level = ["프로", "아마추어", "스터디", "직장인 밴드"];

export type BottomSheetContentType = null | "position" | "genre" | "level";

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
      : type === "level"
      ? "밴드 유형 선택"
      : null;

  const body = () => {
    if (type === "position") return <Grid items={positions} />;
    else if (type === "genre") return <Grid items={genres} />;
    else if (type === "level") return <Grid items={level} />;
    else return null;
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex flex-col items-center gap-2">
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "20px",
            color: "#C0C0C5",
          }}
        >
          {title}
        </p>
        {/* {
            <p
          style={{
            fontFamily: "SUIT-BODY",
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
