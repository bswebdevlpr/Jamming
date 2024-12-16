import { CSSProperties } from "react";

export interface ListItemProp {
  text: string;
  onClick: () => string;
  style?: CSSProperties;
}

const VerticalListItem = ({ text, onClick, style }: ListItemProp) => {
  return (
    <div className="py-3" style={style} onClick={onClick}>
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          color: "#FFF",
        }}
      >
        {text}
      </p>
    </div>
  );
};
export { VerticalListItem };
