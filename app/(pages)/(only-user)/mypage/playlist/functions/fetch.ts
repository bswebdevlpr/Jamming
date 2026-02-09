"use server";

import { CreatePlaylistItemDto } from "@/app/api/dtos/create";
import { getUser } from "@/app/api/functions/read";
import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";
import axios from "axios";

export const updatePlaylistItem = async (
  playlistItemId: number,
  is_public: boolean
): Promise<ActionResult<boolean>> => {
  return safeAction("updatePlaylistItem", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    const { data, error } = await supabase
      .from("playlist")
      .update({ is_public })
      .eq("id", playlistItemId)
      .eq("user_id", user.id)
      .select();

    if (error || data.length === 0) {
      throw CustomError.fromSupabaseError(
        ErrorCode.PLAYLIST_UPDATE_FAILED,
        error ?? { message: "No data returned" },
        "updatePlaylistItem"
      );
    }

    return true;
  });
};

export const deletePlaylistItem = async (
  playlistItemId: number
): Promise<ActionResult<boolean>> => {
  return safeAction("deletePlaylistItem", async () => {
    const supabase = await createClient();
    const user = await getUser(supabase);

    const { data, error } = await supabase
      .from("playlist")
      .delete()
      .eq("id", playlistItemId)
      .eq("user_id", user.id)
      .select();

    if (error || data.length === 0) {
      throw CustomError.fromSupabaseError(
        ErrorCode.PLAYLIST_UPDATE_FAILED,
        error ?? { message: "No data returned" },
        "deletePlaylistItem"
      );
    }

    return true;
  });
};

const getVideoInfo = async (
  videoPath: string
): Promise<Partial<CreatePlaylistItemDto>> => {
  // EXTRACT VIDEO ID
  const regExp =
    /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=))([^?&]+)/;
  const match = videoPath.match(regExp);

  const videoId = match ? match[1] : null;
  if (!videoId) {
    throw CustomError.validationFailed({
      operation: "getVideoInfo",
    });
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_KEY}`;

  const video = await axios.get(url).then((res) => res?.data?.items[0]);
  if (!video) {
    throw CustomError.unexpected({
      operation: "getVideoInfo",
      originalError: "YouTube video not found",
    });
  }

  const { title, channelTitle, publishedAt, thumbnails } = video.snippet;

  return {
    title,
    author: channelTitle,
    date: publishedAt,
    thumbnail_path: thumbnails.high.url,
  };
};

export const uploadPlaylistItem = async (
  videoPath: string
): Promise<ActionResult<boolean>> => {
  return safeAction("uploadPlaylistItem", async () => {
    const input = await getVideoInfo(videoPath);

    const supabase = await createClient();
    const user = await getUser(supabase);
    input.user_id = user.id;
    input.origin = videoPath;

    const { data, error } = await supabase
      .from("playlist")
      .insert(input)
      .select();

    if (error || data.length === 0) {
      throw CustomError.fromSupabaseError(
        ErrorCode.PLAYLIST_UPDATE_FAILED,
        error ?? { message: "No data returned" },
        "uploadPlaylistItem"
      );
    }

    return true;
  });
};
