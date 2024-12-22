import { CSSProperties } from "react";

const CompleteButton = ({
  onClick,
  className,
  style,
}: {
  onClick: () => void;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <button
      style={{
        width: "167.5px",

        border: "1px solid #535355",
        borderRadius: "8px",

        padding: "10px 12px",

        fontFamily: "SUIT-BODY",
        fontSize: "1rem",
        color: "#C0C0C5",

        ...style,
      }}
      className={className}
      onClick={onClick}
    >
      완료
    </button>
  );
};
export default CompleteButton;
