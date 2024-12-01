// https://blog.mathpresso.com/bottom-sheet-for-web-55ed6cc78c00

import { ReactNode } from "react";

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
      className="w-10 h-1 m-auto"
      style={{
        borderRadius: "2px",
        backgroundColor: "#535355",
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
