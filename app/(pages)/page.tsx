"use client";

import Filter from "@/app/ui/images/filter";
import { useEffect, useRef, useState } from "react";
import BottomSheetContent from "./(only-user)/jamsession/bottom-sheet/content";
import TopNavBar from "@/app/ui/navbar/jamsession/top";
import BottomNavBar from "@/app/ui/navbar/bottom";

import JamNow from "@/app/ui/buttons/jam-now";
import JamNowPublic from "@/app/ui/buttons/jam-now-public";
import BottomNavBarPublic from "@/app/ui/navbar/bottom-public";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import SlideCalendarComponent from "@/app/ui/calendar/slide-calendar";
import moment from "moment";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { Filter_JamSessionFeed, JamFeed } from "@/app/ui/feeds/jam-feed";
import { FeedMethods } from "@/app/ui/templates/feed";
import { useBottomSheetStore, useCalendarStore, useSessionStore } from "@/app/stores";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/app/util/supabase/client";
import { getDatesHavingJamPublic } from "@/app/ui/calendar/functions/fetch";
import { dbLocationToEnum } from "@/app/lib/utils/location";

export default function Home() {
  // AUTH STATE
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setIsAuthLoading(false);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsAuthenticated(!!session?.user);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  //

  // ZUSTAND STORE
  const bottomSheet = useBottomSheetStore();
  const resetToToday = useCalendarStore((s) => s.resetToToday);
  const { userProfile } = useSessionStore();
  //

  // REF
  const childRef = useRef<FeedMethods>(null);
  //

  // STATES
  const [genre, setGenre] = useState<GenreEnum>(null);
  const [position, setPosition] = useState<PositionEnum>(null);
  const [level, setLevel] = useState<LevelEnum>(null);
  const [location, setLocation] = useState<LocationEnum>();
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
  const [resetSlideCalendarDots, setResetSlideCalendarDots] =
    useState<boolean>(true);

  const [filter, setFilter] = useState<Filter_JamSessionFeed>({
    location,
    selectedDate,
    genre,
    position,
    level,
    setResetSlideCalendarDots,
  });
  //

  // 로그인한 사용자의 지역 설정을 초기 필터로 적용
  useEffect(() => {
    const initializeLocation = async () => {
      if (!isAuthenticated) return;

      // 프로필이 이미 로드되었으면 해당 location 사용
      if (userProfile.isLoaded) {
        const mapped = dbLocationToEnum(userProfile.location);
        setLocation(mapped ?? LocationEnum.Everywhere);
        return;
      }

      // 프로필이 아직 로드되지 않았으면 location만 fetch
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user")
        .select("location")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch user location:", error);
        setLocation(LocationEnum.Everywhere);
        return;
      }

      const mapped = dbLocationToEnum(data?.location);
      setLocation(mapped ?? LocationEnum.Everywhere);
    };

    initializeLocation();
  }, [isAuthenticated, userProfile.isLoaded]);

  useEffect(() => {
    setFilter({
      location,
      selectedDate,
      genre,
      position,
      level,
    });
  }, [location, selectedDate, genre, position, level]);

  const searchParams = useSearchParams();
  useEffect(() => {
    const paramDate = searchParams.get("date");
    const paramDateFormatted =
      paramDate && moment(paramDate).format("YYYYMMDD");

    if (
      paramDateFormatted &&
      paramDateFormatted !== selectedDate.format("YYYYMMDD")
    )
      setSelectedDate(moment(paramDate));
  }, [searchParams]);

  useEffect(() => {
    if (resetToToday > 0) {
      setSelectedDate(moment());
    }
  }, [resetToToday]);

  return (
    <div className="h-full flex flex-col overflow-without-scroll relative">
      <TopNavBar
        filter={filter}
        setLocation={setLocation}
        isAuthenticated={isAuthenticated}
        isAuthLoading={isAuthLoading}
      />
      {/* 슬라이드 캘린더 */}
      <div className="p-5" style={{ minHeight: "80px" }}>
        <SlideCalendarComponent
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          resetSlideCalendarDots={resetSlideCalendarDots}
          setResetSlideCalendarDots={setResetSlideCalendarDots}
          fetchDates={getDatesHavingJamPublic}
        />
      </div>
      <div className="grow overflow-hidden flex flex-col justify-between">
        <div className="flex flex-row justify-between px-5 pb-4">
          <p
            style={{
              fontFamily: "SBAggroB",
              fontSize: "0.875rem",
              color: "#9F9FA2",
            }}
          >
            JAM SESSION
          </p>
          <span className="flex flex-row gap-1 justify-center items-center">
            <p
              style={{
                fontFamily: "SUIT-TITLE",
                fontSize: "0.875rem",
                color: "#9F9FA2",
              }}
            >
              필터
            </p>
            <div
              onClick={() =>
                bottomSheet.set({
                  location: "high",
                  header: false,
                  children: (
                    <BottomSheetContent
                      genre={genre}
                      position={position}
                      level={level}
                      setGenre={setGenre}
                      setPosition={setPosition}
                      setLevel={setLevel}
                    />
                  ),
                })
              }
            >
              <Filter />
            </div>
          </span>
        </div>
        {/* 잼세션 피드 */}
        <div className="grow overflow-hidden flex justify-center items-center px-5">
          <JamFeed ref={childRef} filter={filter} />
        </div>
        {isAuthLoading ? null : isAuthenticated ? (
          <JamNow
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            refetch={childRef && childRef.current && childRef.current.refetch}
            setResetSlideCalendarDots={setResetSlideCalendarDots}
          />
        ) : (
          <JamNowPublic />
        )}
        {isAuthLoading ? (
          <div style={{ height: "6.93vh" }} />
        ) : isAuthenticated ? (
          <BottomNavBar />
        ) : (
          <BottomNavBarPublic />
        )}
      </div>
    </div>
  );
}
