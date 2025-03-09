"use server";

import { CreatePlaylistItemDto } from "@/app/api/dtos/create";
import { getUser } from "@/app/api/functions/read";
import { CustomError } from "@/app/lib/errors/client.error";
import { createClient } from "@/app/util/supabase/server";
import axios from "axios";

export const updatePlaylistItem = async (
  playlistItemId: number,
  is_public: boolean
) => {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    const user = await getUser(supabase);

    const { data, error } = await supabase
      .from("playlist")
      .update({
        is_public,
      })
      .eq("id", playlistItemId)
      .eq("user_id", user.id)
      .select();
    if (error || data.length === 0) throw CustomError.UpdatePlaylistItem;
    else ret = true;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};

export const deletePlaylistItem = async (playlistItemId: number) => {
  let ret: boolean = false;

  try {
    const supabase = await createClient();

    const user = await getUser(supabase);

    const { data, error } = await supabase
      .from("playlist")
      .delete()
      .eq("id", playlistItemId)
      .eq("user_id", user.id)
      .select();
    if (error || data.length === 0) throw CustomError.UpdatePlaylistItem;
    else ret = true;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};

const getVideoInfo = async (
  videoPath: string
): Promise<Partial<CreatePlaylistItemDto>> => {
  let ret: Partial<CreatePlaylistItemDto> = {};

  try {
    // EXTRACT VIDEO ID
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=))([^?&]+)/;
    const match = videoPath.match(regExp);

    const videoId = match ? match[1] : null;
    if (!videoId) throw new CustomError("유효한 유튜브 링크가 아닙니다.");
    //

    // AXIOS
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`;

    const video = await axios.get(url).then((res) => res?.data?.items[0]);
    if (!video)
      throw new CustomError("일치하는 유튜브 영상을 찾을 수 없습니다.");

    const { title, channelTitle, publishedAt, thumbnails } = video.snippet;

    ret.title = title;
    ret.author = channelTitle;
    ret.date = publishedAt;
    ret.thumbnail_path = thumbnails.high.url;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};

export const uploadPlaylistItem = async (videoPath: string) => {
  let ret: boolean = false;

  try {
    const input = await getVideoInfo(videoPath);

    const supabase = await createClient();

    const user = await getUser(supabase);
    input.user_id = user.id;
    input.origin = videoPath;

    const { data, error } = await supabase
      .from("playlist")
      .insert(input)
      .select();
    if (error || data.length === 0) throw CustomError.UpdatePlaylistItem;
    else ret = true;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }

  return ret;
};
