"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CSSProperties, useRef, useState } from "react";

export interface ListItemProp {
  text: string;
  backgroundUrl?: string;
  onClick: () => void;
  style?: CSSProperties;
}

const DEFAULT_HEIGHT = 52;
const HOVER_HEIGHT = 80;

// 각 배경 이미지의 최적 표시 위치
const IMAGE_POSITIONS: Record<string, string> = {
  "ulsan.jpg": "center 30%",
  "gangwon.jpg": "center 30%",
  "chungbuk.jpg": "center 30%",
  "jeonbuk.jpg": "center 30%",
  "jeonnam.jpg": "center 30%",
  "gyeongnam.jpg": "center 30%",
  // 사물과 하늘이 잘 보이도록 조정
  "seoul.jpg": "center 50%", // SEOUL 구조물이 전체적으로 차지
  "busan.jpg": "center 35%",
  "daegu.jpg": "center 35%",
  "daejeon.jpg": "center 40%",
  "gwangju.jpg": "center 45%", // 돌과 산이 같이 보이게
  "incheon.jpg": "center 50%", // 다리가 더 잘보이게 (픽스)
  "sejong.jpg": "center 67.5%", // 돔 구조물이 가운데에
  "gyeonggi-north.jpg": "center 40%",
  "gyeonggi-south.jpg": "center 45%", // 성 구조물이 더 잘보이게
  "chungnam.jpg": "center 35%",
  "gyeongbuk.jpg": "center 40%",
  "jeju.jpg": "center 35%",
};

const VerticalListItem = ({
  text,
  backgroundUrl,
  onClick,
  style,
  isFocused,
  setIsFocused,
}: ListItemProp & { isFocused: boolean; setIsFocused: () => void }) => {
  // 이미지별 최적 표시 위치 가져오기
  const getImagePosition = (url?: string): string => {
    if (!url) return "center 30%";
    const filename = url.split("/").pop() || "";
    return IMAGE_POSITIONS[filename] || "center 30%";
  };
  const imagePosition = getImagePosition(backgroundUrl);

  // 이미지가 보여야 하는 조건: backgroundUrl이 있고 (hover 중이거나 포커스됨)
  const [isHovered, setIsHovered] = useState(false);
  const showImage = backgroundUrl && (isHovered || isFocused);

  // 한번 활성화되면 Image를 DOM에 유지 (캐시 활용)
  const hasBeenActivated = useRef(false);
  if (showImage) hasBeenActivated.current = true;

  return (
    <motion.div
      style={{
        ...style,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
      animate={{
        height: showImage ? HOVER_HEIGHT : DEFAULT_HEIGHT,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => backgroundUrl && setIsHovered(true)}
      onTouchEnd={() => backgroundUrl && setIsHovered(false)}
      onTouchCancel={() => backgroundUrl && setIsHovered(false)}
    >
      {backgroundUrl && hasBeenActivated.current && (
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: 1,
          }}
          animate={{
            opacity: showImage ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <Image
            src={backgroundUrl}
            alt=""
            fill
            style={{
              objectFit: "cover",
              objectPosition: imagePosition,
            }}
            sizes="(max-width: 600px) 100vw, 600px"
          />
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
        </motion.div>
      )}
      <div
        className="py-3 px-5"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 100,
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
