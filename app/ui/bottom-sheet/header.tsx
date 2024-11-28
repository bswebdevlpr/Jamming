// https://blog.mathpresso.com/bottom-sheet-for-web-55ed6cc78c00

import { ReactNode } from "react";

// const MIN_Y = 60;
// const MAX_X = window.innerHeight - 80;

const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      className="h-12 pt-4 pb-1"
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
    <div
      className="w-8 h-1 m-auto"
      style={{
        borderRadius: "2px",
        backgroundColor: "#d0d0d0",
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
