import { CSSProperties, useEffect, useState } from "react";

const commonStyle: CSSProperties = {
  height: "52px",
  borderRadius: "8px",

  background: "#323234",

  fontFamily: "SUIT-BODY",
  fontSize: "14px",

  textAlign: "center",
};
const deactivatedStyle: CSSProperties = {
  ...commonStyle,
  color: "#C0C0C5",
};
const activatedStyle: CSSProperties = {
  ...commonStyle,

  border: "1.5px solid #A3FF0C",
  color: "#A3FF0C",
};

const GridItem = ({
  idx,
  content,
  state,
  onClick,
}: {
  idx: number;
  content: string;
  state: boolean;
  onClick: (idx: number) => void;
}) => {
  const [style, setStyle] = useState(deactivatedStyle);

  useEffect(() => {
    if (state) {
      setStyle(activatedStyle);
    } else {
      setStyle(deactivatedStyle);
    }
  }, [state]);

  return (
    <div className="p-4" style={style} onClick={() => onClick(idx)}>
      {content}
    </div>
  );
};

export default GridItem;
