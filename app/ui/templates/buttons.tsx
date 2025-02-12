import { CSSProperties } from "react";

const CommonStyle = {
  cursor: "pointer",

  borderRadius: "8px",

  padding: "10px 12px",

  fontFamily: "SUIT-BODY",
  fontSize: "1rem",
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

export interface ButtonTemplateProps {
  text: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  isActive?: boolean;
  styleActivated?: CSSProperties;
}

const ButtonTemplate = ({
  text,
  onClick,
  className,
  style,
  isActive,
  styleActivated,
}: ButtonTemplateProps) => {
  return (
    <button
      style={
        isActive
          ? {
              ...CommonStyle,
              ...styleActivated,
            }
          : {
              ...CommonStyle,
              ...style,
            }
      }
      className={className}
      onClick={isActive ? onClick : null}
    >
      {text}
    </button>
  );
};
export default ButtonTemplate;
