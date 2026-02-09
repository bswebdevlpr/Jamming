"use client";

import TopNavBar from "@/app/ui/navbar/myact/top";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import SlideCalendarComponent from "@/app/ui/calendar/slide-calendar";
import { Filter_JamSessionFeed, JamFeed } from "@/app/ui/feeds/jam-feed";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FeedMethods } from "@/app/ui/templates/feed";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { Entity_JamEntry } from "@/app/lib/interfaces/entity.interface";
import { getRejamInvitations } from "./functions/fetch";
import RejamInvitationCard from "./components/rejam-invitation";

export default function MyAct() {
  const searchParams = useSearchParams();
  const dateParam = moment(searchParams.get("date"));

  const pathname = usePathname();
  const router = useRouter();

  // REF
  const childRef = useRef<FeedMethods>(null);
  //

  // MEMO & STATES
  const [isPopupOn, setIsPopupOn] = useState(false);

  const [genre, setGenre] = useState<GenreEnum>(null);
  const [position, setPosition] = useState<PositionEnum>(null);
  const [level, setLevel] = useState<LevelEnum>(null);
  const [location, setLocation] = useState<LocationEnum>();
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(
    dateParam.isValid() ? dateParam : moment()
  );
  const [resetSlideCalendarDots, setResetSlideCalendarDots] =
    useState<boolean>(true);

  const [filter, setFilter] = useState<Filter_JamSessionFeed>({
    selectedDate,
    atMyAct: true,
    location,
    genre,
    position,
    level,
    includeWithDrawn: true,
  });

  const [rejamInvitations, setRejamInvitations] = useState<Entity_JamEntry[]>(
    []
  );
  //

  // HOOKS
  useEffect(() => {
    setFilter({
      location: LocationEnum[location],
      selectedDate,
      genre: GenreEnum[genre],
      position: PositionEnum[position],
      level: LevelEnum[level],
    });
  }, [location, selectedDate, genre, position, level]);

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
    (async () => {
      try {
        const result = await getRejamInvitations();
        if (result.success === true) {
          setRejamInvitations(result.data);
        } else if (result.success === false) {
          if (process.env.NODE_ENV === "development") console.error(result.error.message);
        }
      } catch (e) {
        if (process.env.NODE_ENV === "development") console.error(e);
      }
    })();
  }, []);
  //

  const handleRemoveInvitation = (entryId: number) => {
    setRejamInvitations((prev) => prev.filter((inv) => inv.id !== entryId));
  };

  return (
    <div className="grow flex flex-col overflow-without-scroll">
      <TopNavBar
        filter={filter}
        // setFilter={setFilter}
        // setSelectedDate={setSelectedDate}
      />
      {/* 슬라이드 */}
      <div className="p-5">
        <SlideCalendarComponent
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      {/* 리잼 초대 */}
      {rejamInvitations.length > 0 && (
        <div className="px-5 pb-4">
          <p
            className="mb-3"
            style={{
              fontFamily: "SBAggroB",
              fontSize: "0.875rem",
              color: "#A3FF0C",
            }}
          >
            REJAM Invitations
          </p>
          {rejamInvitations.map((entry) => (
            <RejamInvitationCard
              key={entry.id}
              entry={entry}
              onRemove={handleRemoveInvitation}
            />
          ))}
        </div>
      )}
      {/* 잼세션 피드 */}
      <div className="flex flex-row justify-between px-5 pb-4">
        <p
          style={{
            fontFamily: "SBAggroB",
            fontSize: "0.875rem",
            color: "#9F9FA2",
          }}
        >
          My Jam
        </p>
      </div>
      <div className="grow overflow-hidden flex justify-center items-center px-5">
        <JamFeed filter={filter} ref={childRef} />
      </div>
    </div>
  );
}
