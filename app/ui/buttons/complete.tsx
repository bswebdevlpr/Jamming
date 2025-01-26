import { CSSProperties } from "react";

const commonStyle: CSSProperties = {
  width: "167.5px",
  padding: "10px 12px",

  borderRadius: "8px",

  fontFamily: "SUIT-BODY",
  fontSize: "1rem",
};

const CompleteButton = ({
  onClick,
  className,
  style,
  isActive,
}: {
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  isActive?: boolean;
}) => {
  return (
    <button
      style={
        !isActive
          ? {
              ...commonStyle,

              color: "#C0C0C5",
              border: "1px solid #535355",

              ...style,
            }
          : {
              ...commonStyle,

              color: "#A3FF0C",
              border: "1px solid #A3FF0C",
              background: "rgba(163, 255, 12, 0.12)",

              cursor: "pointer",

              ...style,
            }
      }
      className={className}
      onClick={onClick}>
      완료
    </button>
  );
};
export default CompleteButton;
