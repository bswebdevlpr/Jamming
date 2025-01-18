import { CSSProperties } from "react";
import { motion } from "framer-motion";

export interface ListItemProp {
  text: string;
  backgroundUrl?: string;
  onClick: () => void;
  style?: CSSProperties;
}

const VerticalListItem = ({
  text,
  backgroundUrl,
  onClick,
  style,
  isFocused,
  setIsFocused,
}: ListItemProp & { isFocused: boolean; setIsFocused: () => void }) => {
  const hoverTapStyle =
    backgroundUrl &&
    `linear-gradient(90deg, rgba(0, 0, 0, 0.80) 0%, rgba(0, 0, 0, 0.00) 50%), url(${backgroundUrl}) lightgray 50% / cover no-repeat`;

  return (
    <motion.div style={{ ...style, cursor: "pointer" }} onClick={onClick}>
      <motion.div
        className="py-3 px-5"
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          color: "#FFF",
          ...(isFocused ? { background: hoverTapStyle, opacity: 1 } : {}),
        }}
        whileHover={
          backgroundUrl && {
            background: hoverTapStyle,
            opacity: 1,
          }
        }
        whileTap={
          backgroundUrl && {
            background: hoverTapStyle,
            opacity: 1,
          }
        }
        onClick={() => {
          setIsFocused();
          onClick();
        }}
      >
        {text}
      </motion.div>
    </motion.div>
  );
};
export { VerticalListItem };
