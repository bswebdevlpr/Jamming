// https://blog.mathpresso.com/bottom-sheet-for-web-55ed6cc00

import { ReactNode } from "react";
import { motion } from "framer-motion";

const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      className="pt-4 pb-1 cursor-grab active:cursor-grabbing"
      style={{
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
};

const Handle: React.FC = () => {
  return (
    <motion.div
      role="slider"
      aria-orientation="vertical"
      aria-label="바텀시트 높이 조절"
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      className="w-10 h-1 m-auto"
      style={{
        borderRadius: "2px",
        backgroundColor: "#535355",
      }}
      whileHover={{
        scale: 1.1,
        backgroundColor: "#737375",
      }}
      whileTap={{
        scale: 1.05,
        backgroundColor: "#636365",
      }}
      transition={{
        duration: 0.15,
      }}
    />
  );
};

const BottomSheetHeader: React.FC = () => {
  return (
    <Wrapper>
      <Handle />
    </Wrapper>
  );
};

export default BottomSheetHeader;
