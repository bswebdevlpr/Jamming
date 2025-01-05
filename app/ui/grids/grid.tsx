"use client";

import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
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
  values,
  colNum,
  itemStyle,
  itemStyleActivated,

  state,
  handleState,

  useInitState,
}: {
  items: string[];
  values: any[];
  state?: any;
  handleState: (input: any) => void;
  colNum?: number;
  itemStyle?: CSSProperties;
  itemStyleActivated?: CSSProperties;

  // 초기화 사용 시
  useInitState?: {
    initState: boolean;
    setInitState: Dispatch<SetStateAction<boolean>>;
  };
}) => {
  const [itemStateList, setItemStateList] = useState<boolean[]>(
    Array(items.length).fill(false)
  );

  useEffect(() => {
    console.log("state from grid", state);
  }, [state]);

  useEffect(() => {
    if (useInitState?.initState) {
      setItemStateList(Array(items.length).fill(false));
      useInitState.setInitState(!useInitState?.initState);
    }
  }, [useInitState?.initState]);

  const handleItemClick = (selectedIdx: number, value: any) => {
    setItemStateList((prev) =>
      [...prev].map((val, idx) => idx === selectedIdx)
    );
    handleState(value);
  };

  const createItems = (texts: string[], values: any[]) => {
    return (
      <>
        {texts.map((text, idx) => (
          <GridItem
            key={idx}
            idx={idx}
            text={text}
            value={values[idx]}
            isFocused={itemStateList[idx]}
            onClick={handleItemClick}
            style={itemStyle}
            styleActivated={itemStyleActivated}
          />
        ))}
      </>
    );
  };

  return (
    <div className={`grid ${gridCols[colNum ?? 3]} gap-1`}>
      {createItems(items, values)}
    </div>
  );
};
export default Grid;
