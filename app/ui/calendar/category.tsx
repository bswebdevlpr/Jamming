import { Filter_JamSessionFeed } from "@/app/(pages)/(only-user)/jamsession/page";
import X from "../images/common/x";

export function CalendarCategoryList({
  filter,
  onClick,
}: {
  filter: Filter_JamSessionFeed;
  onClick: (input: Filter_JamSessionFeed) => any;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(filter).map(
        ([key, val], idx) =>
          val && (
            <CalendarCategoryItem
              key={idx}
              text={val}
              onClick={() => onClick({ ...filter, [key]: null })}
            />
          )
      )}
    </div>
  );
}

function CalendarCategoryItem({
  text,
  onClick,
}: {
  text: any;
  onClick: () => any;
}) {
  return (
    <span
      className="shrink-0 grow-0 flex gap-0.5 py-1 pl-2 pr-1.5"
      style={{
        borderRadius: "4px",
        border: "1px solid #444447",
      }}
    >
      <p
        style={{
          fontFamily: "SUIT-TITLE",
          fontSize: "0.875rem",
          color: "#FFF",
          textAlign: "center",
          lineHeight: "132%",
          letterSpacing: "-0.336px",
        }}
      >
        {text}
      </p>
      <X width={16} height={16} onClick={onClick} />
    </span>
  );
}
