import { CSSProperties } from "react";

const common: CSSProperties = {
  display: "flex",
  width: "100%",
  height: "44px",

  padding: "10px 12px",

  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
};

const style_inactivated: CSSProperties = {
  ...common,

  background: "#242426",
  border: "1px solid #333335",
  borderRadius: "8px",

  fontFamily: "SUIT-TITLE",
  fontSize: "16px",
  color: "#767678",

  cursor: "default",
};

const style_activated: CSSProperties = {
  ...common,

  background: "#304313",
  border: "1px solid #A3FF0C",
  borderRadius: "8px",

  fontFamily: "SUIT-TITLE",
  fontSize: "16px",
  color: "#A3FF0C",
};

export const NextButton = ({
  className,
  isActive,
  onClick,
}: {
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      className={className}
      style={!isActive ? style_inactivated : style_activated}
      onClick={onClick}>
      다음
    </button>
  );
};
