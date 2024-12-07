import Grid from "@/app/ui/grids/grid";

const locations = [
  "전체",
  "서울",
  "경기 북부",
  "경기 남부",
  "인천",
  "부산",
  "대구",
  "강원",
  "대전",
  "광주",
  "울산",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

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
