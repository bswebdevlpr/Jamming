import CategoryFilter from "@/app/ui/categories/category-filter";
import DateAndBell from "../../ui/calendars/calendar-bell";
import Filter from "@/app/ui/images/filter";

export default function JamSession() {
  return (
    <div className="grow flex flex-col">
      <DateAndBell />
      <CategoryFilter />
      {/* 슬라이드 캘린더 */}
      <p className="py-8 text-center">Slide Calendarrrrrrrrrrrr</p>
      {/* 잼세션 피드 */}
      <div className="flex flex-row justify-between pb-4">
        <p
          style={{
            fontFamily: "SBAggroB",
            fontSize: "1rem",
            color: "#FFF",
          }}
        >
          <span
            style={{
              color: "#A3FF0C",
            }}
          >
            추천
          </span>{" "}
          JAM
        </p>
        <span className="flex flex-row gap-1 justify-center items-center">
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              color: "#9F9FA2",
            }}
          >
            필터
          </p>
          <Filter />
        </span>
      </div>
      <div className="grow flex justify-center items-center">
        Jam Session Feeeddddddddd
      </div>
    </div>
  );
}
