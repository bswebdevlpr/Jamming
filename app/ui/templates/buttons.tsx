import { CSSProperties } from "react";

const CommonStyle = {
  width: "100%",
  borderRadius: "8px",
  padding: "10px 12px",

  fontFamily: "SUIT-BODY",
  fontSize: "1rem",

  cursor: "pointer",
};

export const ButtonBasicInactiveStyle: CSSProperties = {
  color: "#9F9FA2",

  border: "1px solid #444447",
  backgroundColor: "#323234",
};

export const ButtonBasicActiveStyle: CSSProperties = {
  color: "#A3FF0C",

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
              ...ButtonBasicActiveStyle,
              ...styleActivated,
            }
          : {
              ...CommonStyle,
              ...ButtonBasicInactiveStyle,
              ...style,
            }
      }
      className={className}
      onClick={isActive === undefined || isActive ? onClick : null}>
      {text}
    </button>
  );
};
export default ButtonTemplate;
