import { LeftArrow } from "@/app/ui/images/arrows";
import { SearchIcon } from "@/app/ui/images/jamsession/popup/search";
import PopupTemplate from "@/app/ui/templates/popup";

export default function SearchSongPopup({
  isTurnedOn,
  turnOff,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
}) {
  return (
    <PopupTemplate isTurnedOn={isTurnedOn}>
      <div className="w-full flex justify-center gap-3">
        <LeftArrow onClick={turnOff} />
        <style jsx>
          {`
            input::placeholder {
              color: "#979798";
            }
          `}
        </style>
        <input
          type="text"
          placeholder="노래, 아티스트, 앨범 검색"
          style={{
            color: "#FFF",
            fontFamily: "SUIT-BODY",
            fontSize: "1.125rem",
            lineHeight: "132%",
            letterSpacing: "-0.408px",
          }}
        />
        <SearchIcon />
      </div>
    </PopupTemplate>
  );
}
