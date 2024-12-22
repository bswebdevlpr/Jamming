import { CSSProperties } from "react";

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
