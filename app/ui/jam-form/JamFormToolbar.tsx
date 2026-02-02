"use client";

import { memo } from "react";
import {
  Gallery,
  Location,
  MusicNote,
  OpenChat,
} from "@/app/ui/images/jamsession/popup/create-jam";
import { ImageWithTxt } from "@/app/ui/templates/images";

interface JamFormToolbarProps {
  onSongClick: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationClick: () => void;
  onOpenchatClick: () => void;
}

export const JamFormToolbar = memo(function JamFormToolbar({
  onSongClick,
  onFileChange,
  onLocationClick,
  onOpenchatClick,
}: JamFormToolbarProps) {
  return (
    <div
      className="flex flex-row px-5 py-2 gap-3"
      style={{
        height: "6.37%",
        fontFamily: "SUIT-BODY",
        fontSize: "0.875rem",
        fontFeatureSettings: "'liga' off, 'clig' off",
        color: "#FFF",
        lineHeight: "normal",
        letterSpacing: "-0.336px",
        borderTop: "1px solid #333335",
        borderBottom: "1px solid #333335",
      }}
    >
      <ImageWithTxt
        image={<MusicNote />}
        text="합주곡"
        style={{ opacity: 0.6, cursor: "pointer" }}
        onClick={onSongClick}
      />
      <div className="relative flex items-center">
        <ImageWithTxt
          image={<Gallery />}
          text="사진"
          style={{ opacity: 0.6 }}
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onFileChange}
          className="w-full h-full absolute opacity-0 z-20 top-0 left-0"
          style={{
            cursor: "pointer",
          }}
        />
      </div>
      <ImageWithTxt
        image={<Location />}
        text="장소"
        style={{ opacity: 0.6, cursor: "pointer" }}
        onClick={onLocationClick}
      />
      <ImageWithTxt
        image={<OpenChat />}
        text="채팅방링크"
        style={{ opacity: 0.6, cursor: "pointer" }}
        onClick={onOpenchatClick}
      />
    </div>
  );
});
