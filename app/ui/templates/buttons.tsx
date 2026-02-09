import { CSSProperties } from "react";
import { motion } from "framer-motion";
import { BUTTON_INTERACTION } from "@/app/lib/animations";

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
  type?: "button" | "reset" | "submit";
}

const ButtonTemplate = ({
  text,
  onClick,
  className,
  style,
  isActive,
  styleActivated,
  type = "submit",
}: ButtonTemplateProps) => {
  return (
    <motion.button
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
      onClick={isActive === undefined || isActive ? onClick : null}
      type={type}
      // Framer Motion interactions (only when button is active)
      whileHover={
        isActive === undefined || isActive
          ? BUTTON_INTERACTION.whileHover
          : undefined
      }
      whileTap={
        isActive === undefined || isActive
          ? BUTTON_INTERACTION.whileTap
          : undefined
      }
      transition={BUTTON_INTERACTION.transition}
    >
      {text}
    </motion.button>
  );
};
export default ButtonTemplate;
