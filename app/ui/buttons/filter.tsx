import { motion } from "framer-motion";
import { TRANSITION } from "@/app/lib/animations";

export default function FilterButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      style={{
        background: "#323234",
        border: "1px solid #444447",
        borderRadius: "8px",
        padding: "6px 14px",
        color: "#A3FF0C",
        fontFamily: "SUIT-BODY",
        fontSize: "0.875rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={TRANSITION.fast}
      type="button"
      aria-label="필터 열기"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 4h12M4 8h8M6 12h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      필터
    </motion.button>
  );
}
