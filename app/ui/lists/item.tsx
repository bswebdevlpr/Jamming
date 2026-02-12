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

// 각 배경 이미지의 최적 표시 위치 (확장자 무관)
const IMAGE_POSITIONS: Record<string, string> = {
  ulsan: "center 30%",
  gangwon: "center 30%",
  chungbuk: "center 30%",
  jeonbuk: "center 30%",
  jeonnam: "center 30%",
  gyeongnam: "center 30%",
  // 사물과 하늘이 잘 보이도록 조정
  seoul: "center 50%", // SEOUL 구조물이 전체적으로 차지
  busan: "center 35%",
  daegu: "center 35%",
  daejeon: "center 40%",
  gwangju: "center 45%", // 돌과 산이 같이 보이게
  incheon: "center 50%", // 다리가 더 잘보이게 (픽스)
  sejong: "center 67.5%", // 돔 구조물이 가운데에
  "gyeonggi-north": "center 40%",
  "gyeonggi-south": "center 45%", // 성 구조물이 더 잘보이게
  chungnam: "center 35%",
  gyeongbuk: "center 40%",
  jeju: "center 35%",
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
    // 확장자 제거 (jpg, webp, avif 등 모두 지원)
    const basename = filename.replace(/\.(jpg|jpeg|webp|avif)$/i, "");
    return IMAGE_POSITIONS[basename] || "center 30%";
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
            placeholder="empty"
            priority={false}
            loading="lazy"
            style={{
              objectFit: "cover",
              objectPosition: imagePosition,
            }}
            sizes="(max-width: 480px) 95vw, (max-width: 768px) 98vw, 600px"
            quality={85}
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
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
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
