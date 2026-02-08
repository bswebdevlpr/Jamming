"use client";

import {
  LocationEnum,
  LocationBackgroundURL,
} from "@/app/lib/enums/location.enum";
import X from "@/app/ui/images/common/x";
import { ListItemProp } from "@/app/ui/lists/item";
import VerticalList from "@/app/ui/lists/list";
import PopupTemplate from "@/app/ui/templates/popup";

const locations: ListItemProp[] = Object.keys(LocationEnum).map((key) => {
  const typeForcedKey: keyof typeof LocationEnum =
    key as keyof typeof LocationEnum;

  return {
    text: LocationEnum[typeForcedKey],
    backgroundUrl: LocationBackgroundURL[typeForcedKey],
    onClick: null,
    style: {
      backgroundColor: "var(--background)",
    },
  };
});

export default function LocationPopup({
  isTurnedOn,
  turnOff,
  setLocation,
}: {
  isTurnedOn: boolean;
  turnOff: () => void;
  setLocation: (location: LocationEnum) => void;
}) {
  return (
    <PopupTemplate isTurnedOn={isTurnedOn} className="flex flex-col">
      <div
        className="flex flex-row justify-between w-full px-5 py-3 mb-3"
        style={{
          borderBottom: "1px solid #323234",
        }}
      >
        <p
          style={{
            fontFamily: "SUIT-TITLE",
            fontSize: "1.125rem",
            color: "#FFF",
          }}
        >
          지역 선택
        </p>
        <X onClick={turnOff} />
      </div>
      <VerticalList
        props={locations.map((prop) => {
          prop.onClick = () => {
            setLocation(prop.text as LocationEnum);
            turnOff();
          };
          return prop;
        })}
      />
    </PopupTemplate>
  );
}
