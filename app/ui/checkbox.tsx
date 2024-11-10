import { CSSProperties } from "react";

const style_checkbox_round: CSSProperties = {
  appearance: "none",
  width: "20px",
  height: "20px",
  border: "1.5px solid",
  borderRadius: "50%",
  borderColor: "#9F9FA2",
};

export const RoundedCheckbox = ({ className }: { className?: string }) => {
  return (
    <input type="checkbox" className={className} style={style_checkbox_round} />
  );
};
