export default function BandIcon({ focused }: { focused: boolean }) {
  const color = focused ? "#A3FF0C" : "#9F9FA2";
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 3명의 사람 아이콘 (밴드) */}
      <circle cx="11" cy="5" r="3" stroke={color} strokeWidth="1.5" fill="none" />
      <path
        d="M6 17c0-2.761 2.239-5 5-5s5 2.239 5 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="4" cy="7" r="2" stroke={color} strokeWidth="1.2" fill="none" />
      <path
        d="M1 15c0-1.657 1.343-3 3-3"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="18" cy="7" r="2" stroke={color} strokeWidth="1.2" fill="none" />
      <path
        d="M21 15c0-1.657-1.343-3-3-3"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
