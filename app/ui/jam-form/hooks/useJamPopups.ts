"use client";

import { useState } from "react";
import { JamPopupsState, JamPopupsActions } from "../types";

export function useJamPopups(): JamPopupsState & JamPopupsActions {
  const [isLocationPopupClicked, setIsLocationPopupClicked] = useState(false);
  const [isHeadCountPopupTurnedOn, setIsHeadCountPopupTurnedOn] = useState(false);
  const [isClockPopupTurnedOn, setIsClockPopupTurnedOn] = useState(false);
  const [isSearchSongPopupTurnedOn, setIsSearchSongPopupTurnedOn] = useState(false);
  const [isSearchLocationPopupTurnedOn, setIsSearchLocationPopupTurnedOn] = useState(false);
  const [isRegisterOpenchatPopupTurnedOn, setIsRegisterOpenchatPopupTurnedOn] = useState(false);

  return {
    isLocationPopupClicked,
    isHeadCountPopupTurnedOn,
    isClockPopupTurnedOn,
    isSearchSongPopupTurnedOn,
    isSearchLocationPopupTurnedOn,
    isRegisterOpenchatPopupTurnedOn,
    setIsLocationPopupClicked,
    setIsHeadCountPopupTurnedOn,
    setIsClockPopupTurnedOn,
    setIsSearchSongPopupTurnedOn,
    setIsSearchLocationPopupTurnedOn,
    setIsRegisterOpenchatPopupTurnedOn,
  };
}
