import { GenreEnum } from "@/app/lib/constants/genre.enum";
import { LevelEnum } from "@/app/lib/constants/level.enum";
import { PositionEnum } from "@/app/lib/constants/position.enum";
import CategoryItem from "@/app/ui/categories/category-item-layout";
import Grid from "@/app/ui/grids/grid";
import Genre from "@/app/ui/images/categories/genre";
import Level from "@/app/ui/images/categories/level";
import Position from "@/app/ui/images/categories/position";

const BottomSheetContent = () => {
  return (
    <div className="flex flex-col pt-6 px-5">
      <p
        className="pb-5"
        style={{
          fontFamily: "SUIT-TITLE",
          fontSize: "1.125rem",
          color: "#9F9FA2",
        }}
      >
        필터 선택
      </p>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <CategoryItem text="장르">
            <Genre />
          </CategoryItem>
          <Grid
            colNum={4}
            items={Object.values(GenreEnum)}
            itemStyle={{ height: "2.5rem", color: "#F2F2F4" }}
          />
        </div>
        <div className="flex flex-col gap-3">
          <CategoryItem text="포지션">
            <Position />
          </CategoryItem>
          <Grid
            colNum={4}
            items={Object.values(PositionEnum)}
            itemStyle={{ height: "2.5rem", color: "#F2F2F4" }}
          />
        </div>
        <div className="flex flex-col gap-3">
          <CategoryItem text="레벨">
            <Level />
          </CategoryItem>
          <Grid
            colNum={4}
            items={Object.values(LevelEnum)}
            itemStyle={{ height: "2.5rem", color: "#F2F2F4" }}
          />
        </div>
      </div>
    </div>
  );
};
export default BottomSheetContent;
