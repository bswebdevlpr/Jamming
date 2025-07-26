"use client";

import { CSSProperties, useEffect, useState } from "react";
import { ListItemProp, VerticalListItem } from "./item";
import { usePathname, useSearchParams } from "next/navigation";

export default function VerticalList({
  props,
  className,
  style,
}: {
  props: ListItemProp[];
  className?: string;
  style?: CSSProperties;
}) {
  const pathname = usePathname(),
    searchParams = useSearchParams();

  const [isFocused, setIsFocused] = useState<boolean[]>(
    new Array(props.length).fill(false)
  );

  useEffect(() => {
    return () => {
      setIsFocused(new Array(props.length).fill(false));
    };
  }, [pathname, searchParams]);

  return (
    <div className={`flex flex-col ${className}`} style={style}>
      {props.map((prop, idx) => {
        const typeForcedProp = prop as ListItemProp;

        return (
          <VerticalListItem
            key={idx}
            text={typeForcedProp.text}
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
