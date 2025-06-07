import { CSSProperties } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export interface ListItemProp {
  text: string;
  backgroundUrl?: string;
  onClick: () => void;
  style?: CSSProperties;
}

const imageVariants = {
  hidden: { opacity: 0, transition: { duration: 0.3 } },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const VerticalListItem = ({
  text,
  backgroundUrl,
  onClick,
  style,
  isFocused,
  setIsFocused,
}: ListItemProp & { isFocused: boolean; setIsFocused: () => void }) => {
  // 이미지가 보여야 하는 조건: hover 중이거나, 포커스됨
  const [isHovered, setIsHovered] = useState(false);
  const showImage = isHovered || isFocused;

  return (
    <motion.div
      style={{
        ...style,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        height: "52px",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {backgroundUrl && (
        <>
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate={showImage ? "visible" : "hidden"}
            style={{
              position: "absolute",
              zIndex: 0,
              inset: 0,
              height: "100%",
              width: "100%",
            }}
          >
            <Image
              src={backgroundUrl}
              alt=""
              fill
              style={{
                objectFit: "cover",
              }}
              sizes="100vw"
              priority
            />
          </motion.div>
          {/* 오버레이 효과 */}
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
              zIndex: 10,
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.0) 50%)",
              pointerEvents: "none",
            }}
          />
        </>
      )}
      <div
        className="py-3 px-5"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 20,
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          color: "#FFF",
        }}
        onClick={() => {
          setIsFocused();
          onClick();
        }}
      >
        {text}
      </div>
    </motion.div>
  );
};

export { VerticalListItem };
