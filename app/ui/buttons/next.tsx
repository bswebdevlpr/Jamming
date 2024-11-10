import { CSSProperties } from "react";

const style_button_next: CSSProperties = {
  display: "flex",
  width: "343px",
  height: "44px",
  padding: "10px 12px",
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,

  background: "#242426",
  border: "1px solid #333335",
  borderRadius: "8px",

  fontFamily: "SUIT-Title",
  fontSize: "16px",
  color: "#767678",
};

export const NextButton = ({ className }: { className?: string }) => {
  return (
    <button type="button" className={className} style={style_button_next}>
      다음
    </button>
  );
};
