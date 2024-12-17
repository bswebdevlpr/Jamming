"use client";

import { CSSProperties, useState } from "react";
import GridItem from "./item";

const gridCols: { [key: number]: string } = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
} as const;

/**
 * @param items
 * - createItems 함수의 반환값
 * - range: 1 ~ 4 (필요한 경우 추가 가능)
 * @param colNum
 * - default: 3
 */
const Grid = ({
  items,
  colNum,
  itemStyle,
}: {
  items: string[];
  colNum?: number;
  itemStyle?: CSSProperties;
}) => {
  const [itemStateList, setItemStateList] = useState<boolean[]>(
    Array(items.length).fill(false)
  );
  const handleItemClick = (selectedIdx: number) => {
    setItemStateList((prev) => {
      const newList = [...prev].map((val, idx) => idx === selectedIdx);

      return newList;
    });
  };

  const createItems = (texts: string[]) => {
    return (
      <>
        {texts.map((text, idx) => (
          <GridItem
            key={idx}
            idx={idx}
            text={text}
            isFocused={itemStateList[idx]}
            onClick={handleItemClick}
            style={itemStyle}
          />
        ))}
      </>
    );
  };

  return (
    <div className={`grid ${gridCols[colNum ?? 3]} gap-1`}>
      {createItems(items)}
    </div>
  );
};
export default Grid;
