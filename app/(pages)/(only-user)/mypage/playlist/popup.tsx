"use client";

import X from "@/app/ui/images/common/x";
import ButtonTemplate, {
  ButtonBasicActiveStyle,
} from "@/app/ui/templates/buttons";
import PopupTemplate from "@/app/ui/templates/popup";
import { Dispatch, SetStateAction, useState } from "react";
import { uploadPlaylistItem } from "./functions/fetch";

export default function Popup({
  isTurnedOn,
  turnOff,
  setIsRefetch,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
  setIsRefetch: Dispatch<SetStateAction<boolean>>;
}) {
  const [videoPath, setVideoPath] = useState<string>("");

  return (
    <PopupTemplate
      isTurnedOn={isTurnedOn}
      className="flex items-center"
      style={{
        backgroundColor: "rgb(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="w-full mx-4"
        style={{
          height: "33.86%",
          backgroundColor: "#242426",
          borderRadius: "12px",

          paddingTop: "17px",
          paddingRight: "16px",
          paddingBottom: "24px",
          paddingLeft: "25px",
        }}
      >
        <div className="flex justify-end mb-3.5">
          <X onClick={turnOff} />
        </div>
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",
            paddingBottom: "6px",
          }}
        >
          링크
        </p>
        <style jsx>{`
          input::placeholder {
            color: #767678;
          }
        `}</style>
        <input
          type="text"
          placeholder="영상 링크를 입력해주세요"
          className="w-full px-3 py-4 mb-14"
          style={{
            height: "50px",
            border: "1px solid #767678",
            borderRadius: "5px",
            backgroundColor: "#242426",

            fontFamily: "SUIT-BODY",
            fontSize: "0.75rem",
            color: "#FFF",
          }}
          onChange={(e) => setVideoPath(e.currentTarget.value)}
        />
        <ButtonTemplate
          text="업로드 하기"
          isActive={videoPath.length > 0}
          styleActivated={ButtonBasicActiveStyle}
          className="w-full"
          style={{
            borderRadius: "8px",
            border: "1px solid #333335",
            background: "#242426",

            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",
          }}
          onClick={() =>
            uploadPlaylistItem(videoPath).then(() => {
              setIsRefetch(true);
              turnOff();
            })
          }
        />
      </div>
    </PopupTemplate>
  );
}
