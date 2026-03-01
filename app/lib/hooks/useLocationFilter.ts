"use client";

import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { dbLocationToEnum } from "@/app/lib/utils/location";
import { useSessionStore } from "@/app/stores";

interface UseLocationFilterReturn {
  location: LocationEnum | undefined;
  setLocation: Dispatch<SetStateAction<LocationEnum | undefined>>;
}

/**
 * useLocationFilter - 사용자 설정 지역으로 필터를 초기화하는 커스텀 훅
 *
 * userProfile이 로드되면 사용자의 DB 지역 설정을 LocationEnum으로 변환하여
 * 초기값으로 설정합니다. 지역 설정이 없으면 LocationEnum.Everywhere를 사용합니다.
 *
 * @returns { location, setLocation } - 현재 지역 필터 상태와 setter
 *
 * @example
 * const { location, setLocation } = useLocationFilter();
 */
export function useLocationFilter(): UseLocationFilterReturn {
  const { userProfile } = useSessionStore();
  const [location, setLocation] = useState<LocationEnum>();

  useEffect(() => {
    if (userProfile.isLoaded && userProfile.location) {
      const mapped = dbLocationToEnum(userProfile.location);
      setLocation(mapped ?? LocationEnum.Everywhere);
    } else if (userProfile.isLoaded && !userProfile.location) {
      setLocation(LocationEnum.Everywhere);
    }
  }, [userProfile.isLoaded, userProfile.location]);

  return { location, setLocation };
}
