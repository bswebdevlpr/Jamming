import { LocationEnum } from "@/app/lib/enums/location.enum";
import { MapDataToLocation } from "@/app/lib/maps/jam";

/**
 * DB 축약형("su") 또는 LocationEnum 값을 한글 표시명으로 변환
 * @param location - DB 축약형, LocationEnum 키, LocationEnum 값, 또는 undefined
 * @returns 한글 지역명 또는 "지역" (fallback)
 */
export function getLocationDisplay(
  location: string | LocationEnum | undefined
): string {
  if (!location) return "지역";

  // 1. DB 축약형("su") → LocationEnum("서울") 변환
  const fromDbCode = MapDataToLocation[location];
  if (fromDbCode) return fromDbCode;

  // 2. 이미 한글 값("서울")인 경우 그대로 반환
  const enumValues = Object.values(LocationEnum) as string[];
  if (enumValues.includes(location)) {
    return location;
  }

  // 3. 영문 키("SeoUl")인 경우 한글 값으로 변환
  if (location in LocationEnum) {
    return LocationEnum[location as keyof typeof LocationEnum];
  }

  // 4. 알 수 없는 값 → "지역" 반환
  return "지역";
}

/**
 * DB 축약형("su")을 LocationEnum 값("서울")으로 변환
 * @param dbLocation - DB에서 가져온 축약형 지역 코드
 * @returns LocationEnum 값 또는 undefined
 */
export function dbLocationToEnum(
  dbLocation: string | null | undefined
): LocationEnum | undefined {
  if (!dbLocation) return undefined;
  return MapDataToLocation[dbLocation];
}
