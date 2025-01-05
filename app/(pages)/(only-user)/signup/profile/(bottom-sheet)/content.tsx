import { GenreEnum } from "@/app/lib/constants/genre.enum";
import { LevelEnum } from "@/app/lib/constants/level.enum";
import { PositionEnum } from "@/app/lib/constants/position.enum";
import CancelButton from "@/app/ui/buttons/cancel";
import CompleteButton from "@/app/ui/buttons/complete";
import Grid from "@/app/ui/grids/grid";
import { BOTTOMSHEET_HEIGHT_HIGH } from "@/app/ui/templates/bottom-sheet/body";

export type BottomSheetContentType = null | "position" | "genre" | "level";

const BottomSheetContent = ({
  type,
  state,
  handleCancel,
  handleComplete,
  handleState,
}: {
  type: BottomSheetContentType;
  state: any;
  handleCancel: () => void;
  handleComplete: () => void;
  handleState: (value: any) => void;
}) => {
  const body = () => {
    if (type === "position")
      return (
        <Grid
          items={Object.values(PositionEnum)}
          values={Object.keys(PositionEnum)}
          state={state}
          handleState={handleState}
        />
      );
    else if (type === "genre")
      return (
        <Grid
          items={Object.values(GenreEnum)}
          values={Object.keys(GenreEnum)}
          state={state}
          handleState={handleState}
        />
      );
    else if (type === "level")
      return (
        <Grid
          items={Object.values(LevelEnum)}
          values={Object.keys(LevelEnum)}
          state={state}
          handleState={handleState}
        />
      );
    else return null;
  };

  return (
    <div
      className="flex flex-col justify-between"
      style={{
        height: `${BOTTOMSHEET_HEIGHT_HIGH}%`,
      }}>
      <div className="flex flex-col items-center gap-2">
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "20px",
            color: "#C0C0C5",
          }}>
          {type === "position"
            ? "포지션 선택"
            : type === "genre"
            ? "장르 선택"
            : type === "level"
            ? "밴드 유형 선택"
            : null}
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
      <div className="grow flex flex-col mb-7">
        {/* 선택사항들 */}
        {body()}
      </div>
      {/* 취소/완료 버튼 */}
      <div className="flex justify-center gap-2 mb-2">
        <CancelButton
          onClick={() => {
            handleState(state);
            handleCancel();
          }}
        />
        <CompleteButton onClick={handleComplete} />
      </div>
    </div>
  );
};

export default BottomSheetContent;
