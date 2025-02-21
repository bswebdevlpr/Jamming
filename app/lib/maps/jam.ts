import { GenreEnum } from "../enums/genre.enum";
import { LevelEnum } from "../enums/level.enum";
import { LocationEnum } from "../enums/location.enum";
import { PositionEnum } from "../enums/position.enum";

export const MapDataToPosition = {
  g: PositionEnum.Guitar,
  b: PositionEnum.Base,
  d: PositionEnum.Drum,
  v: PositionEnum.Vocal,
  k: PositionEnum.Keyboard,
  e: PositionEnum.ETC,
};

export const MapDataToGenre = {
  a: GenreEnum.All,
  r: GenreEnum.Rock,
  po: GenreEnum.Pop,
  i: GenreEnum.Indie,
  j: GenreEnum.Jazz,
  pu: GenreEnum.Punk,
  m: GenreEnum.Metal,
};

export const MapDataToLevel = {
  p: LevelEnum.Pro,
  a: LevelEnum.Amature,
  s: LevelEnum.Study,
  h: LevelEnum.Hobby,
};

export const MapDataToLocation = {
  e: LocationEnum.Everywhere,
  su: LocationEnum.SeoUl,
  ic: LocationEnum.InCheon,
  bs: LocationEnum.BuSan,
  dg: LocationEnum.DaeGu,
  dj: LocationEnum.DaeJeon,
  gj: LocationEnum.GwangJu,
  us: LocationEnum.UlSan,
  sj: LocationEnum.SeJong,
  ggn: LocationEnum.GyeonGgiNorth,
  ggs: LocationEnum.GyeonGgiSouth,
  gw: LocationEnum.GangWon,
  cb: LocationEnum.ChungBuk,
  cn: LocationEnum.ChungNam,
  jb: LocationEnum.JeonBuk,
  gb: LocationEnum.GyeongBuk,
  gn: LocationEnum.GyeongNam,
  jj: LocationEnum.JeJu,
};
