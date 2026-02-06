"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useSearchParams } from "next/navigation";
import moment from "moment";
import { ZodSchema_Post, ZodType_Post, ZodType_Image } from "@/app/lib/zod";
import { MapDataToPosition } from "@/app/lib/maps/jam";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

interface UseJamFormOptions {
  initialDate: moment.Moment;
  onDateChange?: (date: moment.Moment) => void;
}

export function useJamForm({ initialDate, onDateChange }: UseJamFormOptions) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // STATES
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [headTotal, setHeadTotal] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Popup states
  const [isLocationPopupClicked, setIsLocationPopupClicked] = useState(false);
  const [isHeadCountPopupTurnedOn, setIsHeadCountPopupTurnedOn] = useState(false);
  const [isClockPopupTurnedOn, setIsClockPopupTurnedOn] = useState(false);
  const [isSearchSongPopupTurnedOn, setIsSearchSongPopupTurnedOn] = useState(false);
  const [isSearchLocationPopupTurnedOn, setIsSearchLocationPopupTurnedOn] = useState(false);
  const [isRegisterOpenchatPopupTurnedOn, setIsRegisterOpenchatPopupTurnedOn] = useState(false);

  // FORM
  const form = useForm<ZodType_Post>({
    defaultValues: {
      title: "",
      body: "",
      location: [],
      genre: [],
      level: [],
      headcnt_by_pos: Object.keys(MapDataToPosition).map((key) => ({
        pos: key,
        headcnt: 0,
      })),
      datetime: initialDate.toISOString(),
      songs: [],
      images: [],
      location_detail: null,
      openchat: "",
    },
    resolver: zodResolver(ZodSchema_Post),
  });

  const { watch, setValue, clearErrors, reset } = form;

  const location = watch("location");
  const genre = watch("genre");
  const level = watch("level");
  const headcnt_by_pos = watch("headcnt_by_pos");
  const location_detail = watch("location_detail");
  const songs = watch("songs");
  const images = watch("images");
  const openchat = watch("openchat");

  // HOOKS
  useEffect(() => {
    setWidth(document.body.offsetWidth);
    setHeight(document.body.offsetHeight);
  }, []);

  useEffect(() => {
    if (initialDate) {
      setValue("datetime", initialDate.toISOString(), { shouldValidate: false });
      clearErrors();
    }
  }, [initialDate, setValue, clearErrors]);

  useEffect(() => {
    setHeadTotal(headcnt_by_pos.reduce((acc, cur) => acc + cur.headcnt, 0));
  }, [headcnt_by_pos]);

  useEffect(() => {
    if (initialDate) {
      setValue("datetime", initialDate.toISOString(), { shouldValidate: false });
    }

    return () => {
      // 메모리 누수 방지: 생성된 Object URL 해제
      images.forEach((img) => {
        if (img.thumbnail) URL.revokeObjectURL(img.thumbnail);
      });
      reset();
    };
  }, [pathname, searchParams, images, reset, initialDate, setValue]);

  // HANDLERS
  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      alert(`파일 ${file.name}이(가) 10MB를 초과합니다.`);
      return false;
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      alert(`파일 ${file.name}은(는) 지원하지 않는 형식입니다.`);
      return false;
    }
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (fileList) {
      const validFiles = Array.from(fileList)
        .filter(validateFile)
        .slice(0, 5);

      const newImages: ZodType_Image[] = validFiles.map((row) => ({
        file: row,
        thumbnail: URL.createObjectURL(row),
      }));

      if (newImages.length + images.length <= 5) {
        setValue("images", [...images, ...newImages], { shouldValidate: false });
      } else {
        setValue("images", newImages, { shouldValidate: false });
      }
    }
  };

  const handleFileRemove = (idx: number) => {
    const imageToRemove = images[idx];
    if (imageToRemove?.thumbnail) {
      URL.revokeObjectURL(imageToRemove.thumbnail);
    }
    setValue(
      "images",
      images.filter((_, innerIdx) => innerIdx !== idx),
      { shouldValidate: false }
    );
  };

  // Popup handlers
  const popupHandlers = {
    location: {
      open: () => setIsLocationPopupClicked(true),
      close: () => setIsLocationPopupClicked(false),
      isOpen: isLocationPopupClicked,
    },
    headCount: {
      open: () => setIsHeadCountPopupTurnedOn(true),
      close: () => setIsHeadCountPopupTurnedOn(false),
      isOpen: isHeadCountPopupTurnedOn,
    },
    clock: {
      open: () => setIsClockPopupTurnedOn(true),
      close: () => setIsClockPopupTurnedOn(false),
      isOpen: isClockPopupTurnedOn,
    },
    searchSong: {
      open: () => setIsSearchSongPopupTurnedOn(true),
      close: () => setIsSearchSongPopupTurnedOn(false),
      isOpen: isSearchSongPopupTurnedOn,
    },
    searchLocation: {
      open: () => setIsSearchLocationPopupTurnedOn(true),
      close: () => setIsSearchLocationPopupTurnedOn(false),
      isOpen: isSearchLocationPopupTurnedOn,
    },
    registerOpenchat: {
      open: () => setIsRegisterOpenchatPopupTurnedOn(true),
      close: () => setIsRegisterOpenchatPopupTurnedOn(false),
      isOpen: isRegisterOpenchatPopupTurnedOn,
    },
  };

  return {
    // Form
    form,
    // Watched values
    watchedValues: {
      location,
      genre,
      level,
      headcnt_by_pos,
      location_detail,
      songs,
      images,
      openchat,
    },
    // Computed values
    headTotal,
    // Dimensions
    dimensions: { width, height },
    // Submit state
    isSubmitting,
    setIsSubmitting,
    // Handlers
    handleFileChange,
    handleFileRemove,
    // Popup handlers
    popupHandlers,
  };
}
