import { CSSProperties, useEffect, useState } from "react";

const commonStyle: CSSProperties = {
  height: "52px",
  borderRadius: "8px",

  background: "#323234",

  fontFamily: "SUIT-BODY",
  fontSize: "0.875rem",

  cursor: "pointer",
};
const deactivatedStyle: CSSProperties = {
  ...commonStyle,
  color: "#C0C0C5",
};

const GridItem = ({
  idx,
  text,
  isFocused,
  onClick,
  style,
  styleActivated,
}: {
  idx: number;
  text: string;
  isFocused: boolean;
  onClick: (idx: number, value: any) => void;
  style?: CSSProperties;
  styleActivated?: CSSProperties;
}) => {
  const initStyle = {
    ...deactivatedStyle,
    ...style,
  };

  const [innerStyle, setInnerStyle] = useState(initStyle);

  const activatedStyle: CSSProperties = {
    ...commonStyle,
    ...style,

    border: "1.5px solid #A3FF0C",
    color: "#A3FF0C",

    ...styleActivated,
  };

  useEffect(() => {
    if (isFocused) {
      setInnerStyle(activatedStyle);
    } else {
      setInnerStyle(initStyle);
    }
  }, [isFocused]);

  return (
    <div
      className="flex justify-center items-center"
      style={{
        ...innerStyle,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      onClick={() => onClick(idx, text)}
    >
      {text}
    </div>
  );
};

export default GridItem;
