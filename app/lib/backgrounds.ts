import { LocationBackgroundURL } from "./enums/location.enum";

/**
 * LocationEnum 키를 배경 이미지 URL에 매핑하는 객체
 */
export const BACKGROUND_IMAGES: Record<
  keyof typeof LocationBackgroundURL,
  string
> = {
  Everywhere: LocationBackgroundURL.Everywhere,
  SeoUl: LocationBackgroundURL.SeoUl,
  GyeonGgiNorth: LocationBackgroundURL.GyeonGgiNorth,
  GyeonGgiSouth: LocationBackgroundURL.GyeonGgiSouth,
  InCheon: LocationBackgroundURL.InCheon,
  BuSan: LocationBackgroundURL.BuSan,
  DaeGu: LocationBackgroundURL.DaeGu,
  DaeJeon: LocationBackgroundURL.DaeJeon,
  GwangJu: LocationBackgroundURL.GwangJu,
  UlSan: LocationBackgroundURL.UlSan,
  SeJong: LocationBackgroundURL.SeJong,
  GangWon: LocationBackgroundURL.GangWon,
  ChungBuk: LocationBackgroundURL.ChungBuk,
  ChungNam: LocationBackgroundURL.ChungNam,
  JeonBuk: LocationBackgroundURL.JeonBuk,
  JeonNam: LocationBackgroundURL.JeonNam,
  GyeongBuk: LocationBackgroundURL.GyeongBuk,
  GyeongNam: LocationBackgroundURL.GyeongNam,
  JeJu: LocationBackgroundURL.JeJu,
};
