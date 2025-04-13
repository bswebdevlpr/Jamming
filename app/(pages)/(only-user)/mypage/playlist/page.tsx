"use client";

import { LeftArrowWhite } from "@/app/ui/images/arrows";
import PlusPinkIcon from "@/app/ui/images/mypage/playlist/plus";
import { ImageWithTxt } from "@/app/ui/templates/images";
import { useContext, useEffect, useState } from "react";
import Popup from "./popup";
import ButtonTemplate from "@/app/ui/templates/buttons";
import { List_PlayList, ListItem_PlayList } from "@/app/ui/lists/playlist.list";
import {
  Entity_Playlist,
  Entity_User,
} from "@/app/lib/interfaces/entity.interface";
import { initialize } from "../functions/fetch";

import { motion } from "framer-motion";
import { deletePlaylistItem, updatePlaylistItem } from "./functions/fetch";
import { useRouter } from "next/navigation";
import { globalContext } from "@/app/(pages)/context";

export default function Playlist() {
  const { bottomSheet } = useContext(globalContext);

  const router = useRouter();

  // STATES
  const [isPopupOn, setIsPopupOn] = useState(false);

  const [user, setUser] = useState<Entity_User>(null);
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const [publicPlaylistToShow, setPublicPlaylistToShow] = useState<
    Entity_Playlist[]
  >([]);
  const [privatePlaylistToShow, setPrivatePlistToShow] = useState<
    Entity_Playlist[]
  >([]);

  const [isRefetch, setIsRefetch] = useState<boolean>(true);
  //

  // HANDLERS
  useEffect(() => {
    if (isRefetch)
      (async () => {
        const foundUser = await initialize();
        setUser(foundUser);

        setPublicPlaylistToShow(
          foundUser.playlist.filter((row) => row.is_public)
        );
        setPrivatePlistToShow(
          foundUser.playlist.filter((row) => !row.is_public)
        );

        setIsRefetch(false);
      })();
  }, [isRefetch]);

  const bottomSheetHandler = (playlistItemId) =>
    bottomSheet.set({
      location: 24,
      header: false,
      children: (
        <div className="flex flex-col px-4 pt-2 pb-3">
          <p
            className="w-full px-3 py-3.5 text-center"
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "15px",
              color: "#F2F2F4",

              borderBottom: "1px solid #323234",
            }}
            onClick={() => {
              updatePlaylistItem(playlistItemId, isPublic ? false : true).then(
                () => {
                  bottomSheet.set({ location: "hidden" });
                  setIsRefetch(true);
                }
              );
            }}
          >
            {isPublic ? "비" : ""}공개로 전환
          </p>
          <p
            className="w-full px-3 py-3.5 text-center"
            style={{
              fontFamily: "SUIT-BODY",
              fontSize: "15px",
              color: "#FF380C",
            }}
            onClick={() => {
              deletePlaylistItem(playlistItemId).then(() => {
                bottomSheet.set({ location: "hidden" });
                setIsRefetch(true);
              });
            }}
          >
            삭제
          </p>
          <ButtonTemplate
            text="취소"
            className="w-full my-3"
            style={{
              backgroundColor: "#323234",

              border: "1px solid #444447",
              borderRadius: "8px",
            }}
            onClick={() => bottomSheet.set({ location: "hidden" })}
          />
        </div>
      ),
    });
  //

  return (
    <div className="grow flex flex-col items-center overflow-without-scroll px-5">
      <div className="w-full flex justify-between py-5 mb-1">
        <LeftArrowWhite onClick={() => router.back()} />
        <p
          style={{
            fontFamily: "SUIT-BODY",
            fontSize: "1rem",
            color: "#FFF",
          }}
        >
          내 연주 목록
        </p>
        <div className="w-5 h-6" />
      </div>
      <div
        className="w-full flex flex-row"
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
        }}
      >
        <p
          className="basis-1/2"
          style={{
            color: "#FFF",

            textAlign: "center",

            paddingTop: "18px",
            paddingBottom: "8px",
          }}
          onClick={() => {
            setIsPublic(true);
          }}
        >
          공개
        </p>
        <p
          className="basis-1/2"
          style={{
            color: "#C0C0C5",

            textAlign: "center",

            paddingTop: "20px",
            paddingBottom: "8px",
          }}
          onClick={() => {
            setIsPublic(false);
          }}
        >
          비공개
        </p>
      </div>
      <div className="w-full flex flex-row">
        <motion.hr
          className="basis-1/2"
          style={{
            width: "100%",
            border: "none",
            borderTop: "4px solid var(--highlight)",
            borderRadius: isPublic ? "5px" : 0,
          }}
          animate={{
            opacity: isPublic ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.hr
          className="basis-1/2"
          style={{
            width: "100%",
            border: "none",
            borderTop: "4px solid var(--highlight)",
            opacity: 0,
            borderRadius: !isPublic ? "5px" : 0,
          }}
          animate={{
            opacity: !isPublic ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <hr
        style={{
          width: "100%",
          borderTop: "1px solid var(--border)",
          marginBottom: "20px",
        }}
      />
      <List_PlayList>
        {(isPublic ? publicPlaylistToShow : privatePlaylistToShow).length > 0 &&
          (isPublic ? publicPlaylistToShow : privatePlaylistToShow).map(
            (row, idx) => (
              <ListItem_PlayList
                key={idx}
                item={row}
                isOptionOn={true}
                onOptionClick={() => bottomSheetHandler(row.id)}
              />
            )
          )}
      </List_PlayList>
      <ImageWithTxt
        image={<PlusPinkIcon />}
        text="업로드 하기"
        className="absolute pl-2.5 pr-4 py-2.5 gap-1"
        style={{
          backgroundColor: "#242426",
          border: "1px solid #FF3773",
          borderRadius: "100px",

          fontFamily: "SUIT-TITLE",
          fontSize: "0.875rem",
          color: "#FF3773",

          right: "16px",
          bottom: "88px",
        }}
        onClick={() => {
          setIsPopupOn(true);
        }}
      />
      <Popup
        isTurnedOn={isPopupOn}
        turnOff={() => setIsPopupOn(false)}
        setIsRefetch={setIsRefetch}
      />
    </div>
  );
}
