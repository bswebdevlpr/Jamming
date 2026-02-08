"use server";

import { CustomError } from "@/app/lib/errors/custom-error";
import {
  Entity_JamSession,
  Entity_User,
} from "@/app/lib/interfaces/entity.interface";
import { createClient } from "@/app/util/supabase/server";
import { getJam, getJamPublic } from "@/app/api/functions/read";

interface RetType {
  user: Entity_User;
  jam: Entity_JamSession;
  isApplyBtnActive: boolean;
  applyBtnTxt: string;
}

export const initialize = async (jam_id: number) => {
  let ret: RetType = {
    user: null,
    jam: null,
    isApplyBtnActive: undefined,
    applyBtnTxt: null,
  };

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) ret.user = user as unknown as Entity_User;

    // 인증 유저: getJam, 비인증: getJamPublic 폴백
    const jam = user ? await getJam(jam_id) : await getJamPublic(jam_id);
    if (jam) ret.jam = jam;

    if (jam && user) {
      const isAuthor = user.id === jam.user_id;
      const isAlreadyRegistered = jam.jamentry
        .map((je) => je.user_id)
        .includes(user.id);
      const isUserWithdrawn = !jam.user;

      ret.applyBtnTxt = isAuthor
        ? "내가 작성한 잼세션이에요"
        : isUserWithdrawn
        ? "세션장이 탈퇴하여 참여할 수 없어요"
        : jam.maxHeadCnt !== 0 && jam.maxHeadCnt <= jam.jamentry.length
        ? "인원이 전부 찼어요"
        : isAlreadyRegistered
        ? "신청완료!"
        : "신청하기";

      ret.isApplyBtnActive =
        !isAuthor && !isUserWithdrawn && !isAlreadyRegistered;
    } else if (jam && !user) {
      ret.applyBtnTxt = "로그인하고 참여하기";
      ret.isApplyBtnActive = true;
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    throw CustomError.UnExpected;
  }

  return ret;
};
