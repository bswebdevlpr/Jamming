import {
  MapDataToGenre,
  MapDataToLevel,
  MapDataToLocation,
  MapDataToPosition,
} from "@/app/lib/maps/jam";
import { CSSProperties, ReactNode } from "react";

interface TagProp {
  text: string;
  className?: string;
  style?: CSSProperties;
}

function Tag({ text, className, style }: TagProp) {
  return (
    <p
      className={`px-1.5 py-0.5 ${className}`}
      style={{
        fontFamily: "SUIT-BODY",
        fontSize: "0.75rem",
        alignItems: "center",

        borderRadius: "2px",

        ...style,
      }}
    >
      {text}
    </p>
  );
}

export const PositionTag = ({ text, className, style }: TagProp) => {
  return (
    <Tag
      text={MapDataToPosition[text]}
      className={className}
      style={{
        color: "#FF3773",
        background: "rgba(255, 55, 115, 0.24)",
        ...style,
      }}
    />
  );
};

export const GenreTag = ({ text, className, style }: TagProp) => {
  return (
    <Tag
      text={MapDataToGenre[text]}
      className={className}
      style={{
        color: "#A3FF0C",
        background: "rgba(163, 255, 12, 0.16)",
        ...style,
      }}
    />
  );
};

export const LocationTag = ({ text, className, style }: TagProp) => {
  return (
    <Tag
      text={MapDataToLocation[text]}
      className={className}
      style={{
        color: "#3994FF",
        background: "rgba(12, 124, 255, 0.20)",
        ...style,
      }}
    />
  );
};

export const LevelTag = ({ text, className, style }: TagProp) => {
  return (
    <Tag
      text={MapDataToLevel[text]}
      className={className}
      style={{
        color: "#E5E5E9",
        background: "#242426",
        ...style,
      }}
    />
  );
};

export const TagList = ({ tags }: { tags: ReactNode[] }) => {
  return <div className="flex gap-1">{tags}</div>;
};
