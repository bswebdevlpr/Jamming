import { ReactNode } from "react";
import { BottomSheetHeader } from "./header";

const MIN_Y = 60;
const BOTTOM_SHEET_HEIGHT = window.innerHeight - MIN_Y;

const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div
      className="flex flex-col fixed"
      style={{
        zIndex: 1,
        top: 0,
        left: 0,
        right: 0,

        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",
        height: `${BOTTOM_SHEET_HEIGHT}px`,
      }}
    >
      {children}
    </div>
  );
};

const BottomSheet = () => {
  return (
    <Wrapper>
      <BottomSheetHeader />
    </Wrapper>
  );
};
export default BottomSheet;
