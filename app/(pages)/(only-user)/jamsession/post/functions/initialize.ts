"use server";

import { CustomError } from "@/app/lib/errors/error";
import { Entity_JamSession } from "./../../../../../lib/interfaces/entity.interface";
import { Entity_User } from "@/app/lib/interfaces/entity.interface";
import { createClient } from "@/app/util/supabase/server";
import { getJam } from "@/app/api/functions/read";

interface RetType {
  user: Entity_User;
  jam: Entity_JamSession;
  isApplyBtnActive: boolean;
  applyBtnTxt: string;
}

export const initialize = async (jamId: number) => {
  let ret: RetType = {
    user: null,
    jam: null,
    isApplyBtnActive: undefined,
    applyBtnTxt: null,
  };

  try {
    const supabase = await createClient();

    const jam = await getJam(jamId);
    if (jam) ret.jam = jam;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) ret.user = user as unknown as Entity_User;

    if (jam && user) {
      const isAuthor = user.id === jam.userId;
      const isAlreadyRegistered = jam.jamEntry
        .map((je) => je.userId)
        .includes(user.id);

      ret.applyBtnTxt = isAuthor
        ? "내가 작성한 잼세션입니다"
        : jam.maxHeadCnt !== 0 && jam.maxHeadCnt <= jam.jamEntry.length
        ? "인원이 전부 찼어요"
        : isAlreadyRegistered
        ? "신청완료!"
        : null;

      ret.isApplyBtnActive = !isAuthor && !isAlreadyRegistered;
    }
  } catch (e) {
    throw CustomError.UnExpected;
  }

  return ret;
};
