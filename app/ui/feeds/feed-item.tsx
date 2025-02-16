import Profile from "../images/navbar/profile";
import {
  GenreTag,
  LevelTag,
  LocationTag,
  PositionTag,
  TagList,
} from "../tags/category-tag";
import { ImageWithTxt } from "../templates/images";

export interface FeedItemProps_Jam {
  idx: number;
  title: string;
  location: string;
  pos: string;
  genre: string;
  level: string;
  maxHeadCnt: number;
}

export const FeedItem_Jam: React.FC<FeedItemProps_Jam> = ({
  idx,
  title,
  location,
  pos,
  genre,
  level,
  maxHeadCnt,
}) => {
  const tags = [];
  if (location) tags.push(<LocationTag text={location} />);
  tags.push(<PositionTag text={pos} />);
  tags.push(<GenreTag text={genre} />);
  tags.push(<LevelTag text={level} />);

  return (
    <div
      key={idx}
      className="w-full flex justify-between py-3"
      style={{
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex flex-col gap-1.5">
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            fontStyle: "normal",
            lineHeight: "140%",
            letterSpacing: "-0.384px",
          }}
        >
          {title}
        </p>
        <TagList tags={tags} />
        <ImageWithTxt
          className="gap-1"
          image={<Profile width={10.7} height={12} />}
          text={
            <p
              style={{
                color: "#9F9FA2",
                fontFamily: "SUIT-TITLE",
                fontSize: "0.875rem",
                fontStyle: "normal",
                lineHeight: "140%",
              }}
            >
              <span
                style={{
                  color: "var(--highlight)",
                }}
              >
                0
              </span>
              /{maxHeadCnt}
            </p>
          }
        />
      </div>
      <div
        style={{
          width: "21.49%",
          height: "100%",
          backgroundColor: "pink",
        }}
      >
        Image
      </div>
    </div>
  );
};
