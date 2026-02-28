import { Entity_Band } from "@/app/lib/interfaces/entity.interface";

export default function BandRow({
  band,
  role,
  onClick,
}: {
  band: Entity_Band;
  role: string;
  onClick: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 p-3"
      style={{
        background: "#242426",
        border: "1px solid #323234",
        borderRadius: "8px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "#323234",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {band.profile_image ? (
          <img
            src={band.profile_image}
            alt={band.name ?? ""}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ color: "#9F9FA2", fontSize: "1.25rem" }}>♪</span>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-0.5" style={{ minWidth: 0 }}>
        <div className="flex items-center gap-2">
          <p
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "0.875rem",
              color: "#ededed",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {band.name}
          </p>
          {role === "leader" && (
            <span
              style={{
                fontFamily: "SUIT-BODY",
                fontSize: "0.625rem",
                color: "#6C9EFF",
                background: "rgba(108, 158, 255, 0.15)",
                border: "1px solid rgba(108, 158, 255, 0.3)",
                padding: "1px 6px",
                borderRadius: "2px",
                flexShrink: 0,
              }}
            >
              Leader
            </span>
          )}
        </div>
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#9F9FA2",
          }}
        >
          {band.memberCount ?? 0}명
        </p>
      </div>
    </div>
  );
}
