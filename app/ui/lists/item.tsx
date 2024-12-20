import { CSSProperties } from "react";
import { motion } from "framer-motion";

export interface ListItemProp {
  text: string;
  backgroundUrl?: string;
  onClick: () => string;
  style?: CSSProperties;
}

const VerticalListItem = ({
  text,
  backgroundUrl,
  onClick,
  style,
}: ListItemProp) => {
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
      >
        {text}
      </motion.div>
    </motion.div>
  );
};
export { VerticalListItem };
