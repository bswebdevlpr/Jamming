/**
 * 랜딩 페이지 전용 태그 컴포넌트
 *
 * features-section.tsx에서 사용하는 태그들에 대해
 * 개별 색상 매핑을 제공하여 시각적 다양성을 확보합니다.
 *
 * 디자인 시스템의 허용된 컬러 팔레트만 사용합니다.
 */

const LANDING_TAG_COLORS: Record<string, { color: string; background: string }> = {
  // 장르 태그
  "락": { color: "#A3FF0C", background: "rgba(163, 255, 12, 0.16)" },
  "팝": { color: "#3994FF", background: "rgba(57, 148, 255, 0.20)" },

  // 포지션 태그
  "기타": { color: "#FF3773", background: "rgba(255, 55, 115, 0.24)" },
  "드럼": { color: "#FF3E2F", background: "rgba(255, 62, 47, 0.20)" },
  "보컬": { color: "#0C7CFF", background: "rgba(12, 124, 255, 0.20)" },
  "베이스": { color: "#A3FF0C", background: "rgba(163, 255, 12, 0.16)" },
  "키보드": { color: "#3994FF", background: "rgba(57, 148, 255, 0.20)" },

  // 역할 태그
  "리더": { color: "#FF3773", background: "rgba(255, 55, 115, 0.24)" },
  "멤버": { color: "#c0c0c5", background: "rgba(192, 192, 197, 0.16)" },

  // 지역 태그
  "서울": { color: "#0C7CFF", background: "rgba(12, 124, 255, 0.20)" },
  "경기": { color: "#3994FF", background: "rgba(57, 148, 255, 0.20)" },
  "부산": { color: "#A3FF0C", background: "rgba(163, 255, 12, 0.16)" },
};

interface LandingTagProps {
  text: string;
}

/**
 * 랜딩 페이지 전용 태그 컴포넌트
 *
 * @param text - 태그 텍스트 (예: "락", "팝", "기타", "드럼" 등)
 * @returns 색상이 적용된 태그 요소
 */
export function LandingTag({ text }: LandingTagProps) {
  // 정의되지 않은 태그는 기본 그레이 톤 사용
  const colorStyle = LANDING_TAG_COLORS[text] || {
    color: "#9F9FA2",
    background: "#242426"
  };

  return (
    <span
      style={{
        fontFamily: "SUIT-BODY",
        fontSize: "0.75rem",
        borderRadius: "2px",
        padding: "2px 6px",
        whiteSpace: "nowrap",
        color: colorStyle.color,
        background: colorStyle.background,
      }}
    >
      {text}
    </span>
  );
}
