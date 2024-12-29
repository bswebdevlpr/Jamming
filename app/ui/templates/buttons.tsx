import { CSSProperties } from "react";

export const ButtonInactiveStyle: CSSProperties = {
  padding: "10px 12px",

  fontFamily: "SUIT-BODY",
  fontSize: "1rem",

  borderRadius: "8px",
  border: "1px solid #444447",
  backgroundColor: "#323234",
};

export const ButtonActiveStyle: CSSProperties = {
  padding: "10px 12px",

  fontFamily: "SUIT-BODY",
  fontSize: "1rem",
  color: "#A3FF0C",

  borderRadius: "8px",
  border: "1px solid #A3FF0C",
  backgroundColor: "#304313",
};

const ButtonTemplate = ({
  text,
  onClick,
  className,
  style,
}: {
  text: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <button
      style={{
        cursor: "pointer",

        borderRadius: "8px",

        padding: "10px 12px",

        fontFamily: "SUIT-BODY",
        fontSize: "1rem",
        ...style,
      }}
      className={className}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
export default ButtonTemplate;
