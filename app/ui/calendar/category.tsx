import X from "../images/common/x";

export function CalendarCategoryList({
  filters,
}: {
  filters: {
    text: string;
    value: any;
  }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(({ text, value }, idx) => (
        <CalendarCategoryItem key={idx} text={text} />
      ))}
    </div>
  );
}

function CalendarCategoryItem({ text }: { text: string }) {
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
      <X width={16} height={16} />
    </span>
  );
}
