"use client";

import { CSSProperties, useState } from "react";
import { ListItemProp, VerticalListItem } from "./item";

export default function VerticalList({
  props,
  className,
  style,
}: {
  props: ListItemProp[];
  className?: string;
  style?: CSSProperties;
}) {
  const [isFocused, setIsFocused] = useState<boolean[]>(
    new Array(props.length).fill(false)
  );

  return (
    <div className={`flex flex-col ${className}`} style={style}>
      {props.map((prop, idx) => {
        const typeForcedProp = prop as ListItemProp;

        return (
          <VerticalListItem
            key={idx}
            text={typeForcedProp.text}
            value={typeForcedProp.value}
            backgroundUrl={typeForcedProp.backgroundUrl}
            onClick={prop.onClick}
            style={prop.style}
            isFocused={isFocused[idx]}
            setIsFocused={() =>
              setIsFocused(isFocused.map((val, innerIdx) => idx === innerIdx))
            }
          />
        );
      })}
    </div>
  );
}
