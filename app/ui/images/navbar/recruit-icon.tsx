export default function RecruitIcon({ focused }: { focused: boolean }) {
  const color = focused ? "#A3FF0C" : "#9F9FA2";
  return (
    <svg
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 게시판 + 메가폰 아이콘 (구인) */}
      <rect
        x="2"
        y="2"
        width="16"
        height="18"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <line x1="6" y1="7" x2="14" y2="7" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <line x1="6" y1="11" x2="14" y2="11" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <line x1="6" y1="15" x2="10" y2="15" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
