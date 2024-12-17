import { CSSProperties, useEffect, useState } from "react";

const commonStyle: CSSProperties = {
  height: "52px",
  borderRadius: "8px",

  background: "#323234",

  fontFamily: "SUIT-BODY",
  fontSize: "0.875rem",
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
  text,
  isFocused,
  onClick,
  style,
}: {
  idx: number;
  text: string;
  isFocused: boolean;
  onClick: (idx: number) => void;
  style?: CSSProperties;
}) => {
  const [innerStyle, setInnerStyle] = useState(deactivatedStyle);

  useEffect(() => {
    if (isFocused) {
      setInnerStyle(activatedStyle);
    } else {
      setInnerStyle(deactivatedStyle);
    }
  }, [isFocused]);

  console.log({ ...innerStyle, ...style });

  return (
    <div
      className="flex justify-center items-center"
      style={{ ...innerStyle, ...style }}
      onClick={() => onClick(idx)}
    >
      {text}
    </div>
  );
};

export default GridItem;
