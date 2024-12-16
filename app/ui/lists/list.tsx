import { CSSProperties } from "react";
import { ListItemProp, VerticalListItem } from "./item";

export default function VerticalList({
  props,
  className,
  style,
}: {
  props: Partial<ListItemProp>[];
  className?: string;
  style?: CSSProperties;
}) {
  const returnTxt = (text: string) => {
    return () => text;
  };

  return (
    <div className={`flex flex-col ${className}`} style={style}>
      {props.map((prop, idx) => {
        const typeForcedProp = prop as ListItemProp;

        return (
          <VerticalListItem
            key={idx}
            text={typeForcedProp.text}
            onClick={returnTxt(typeForcedProp.text)}
            style={prop.style}
          />
        );
      })}
    </div>
  );
}
