import { ZodType_Image, ZodType_Post } from "@/app/lib/zod";
import { Dispatch, SetStateAction } from "react";
import { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

export interface JamFormState {
  location: string[];
  genre: string[];
  level: string[];
  headcnt_by_pos: { pos: string; headcnt: number }[];
  location_detail: { name: string; address: string } | null;
  songs: { title: string; artist: string }[];
  images: ZodType_Image[];
  openchat: string;
}

export interface JamFormActions {
  register: UseFormRegister<ZodType_Post>;
  setValue: UseFormSetValue<ZodType_Post>;
  clearErrors: UseFormClearErrors<ZodType_Post>;
  formState: { errors: FieldErrors<ZodType_Post> };
}

export interface JamPopupsState {
  isLocationPopupClicked: boolean;
  isHeadCountPopupTurnedOn: boolean;
  isClockPopupTurnedOn: boolean;
  isSearchSongPopupTurnedOn: boolean;
  isSearchLocationPopupTurnedOn: boolean;
  isRegisterOpenchatPopupTurnedOn: boolean;
}

export interface JamPopupsActions {
  setIsLocationPopupClicked: Dispatch<SetStateAction<boolean>>;
  setIsHeadCountPopupTurnedOn: Dispatch<SetStateAction<boolean>>;
  setIsClockPopupTurnedOn: Dispatch<SetStateAction<boolean>>;
  setIsSearchSongPopupTurnedOn: Dispatch<SetStateAction<boolean>>;
  setIsSearchLocationPopupTurnedOn: Dispatch<SetStateAction<boolean>>;
  setIsRegisterOpenchatPopupTurnedOn: Dispatch<SetStateAction<boolean>>;
}
