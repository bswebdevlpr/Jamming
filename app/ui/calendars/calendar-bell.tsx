import Bell from "@/app/ui/images/jamsession/bell";
import Calendar from "@/app/ui/images/jamsession/calendar";

export default function DateAndBell() {
  return (
    <div className="flex flex-row justify-between py-3">
      <span className="flex flex-row justify-center items-center gap-2">
        <Calendar />
        <p
          style={{
            fontFamily: "SUIT-BODY",
            color: "#FFF",
            fontSize: "18px",
          }}
        >
          8월 14일 수요일
        </p>
      </span>
      <Bell />
    </div>
  );
}
