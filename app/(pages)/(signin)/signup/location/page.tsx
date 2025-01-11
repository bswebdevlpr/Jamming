import { LocationEnum } from "@/app/lib/constants/location.enum";
import Grid from "@/app/ui/grids/grid";

const locations = Object.values(LocationEnum);

export default function SignUp_Location() {
  return (
    <div className="flex flex-col relative">
      <p
        style={{
          fontFamily: "SBAggroM",
          fontSize: "24px",
          color: "#C0C0C5",
          marginBottom: "18px",
        }}
      >
        활동 가능한 지역을 선택해주세요
      </p>
      <Grid colNum={2} items={locations} />
    </div>
  );
}
