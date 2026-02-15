"use server";

import sanitizeHtml from "sanitize-html";
import { CustomError, ErrorCode } from "../errors/custom-error";
import { createClient } from "@/app/util/supabase/server";
import { UserStatus } from "../enums/supabase.enum";

export async function sanitize(text: string): Promise<string> {
  try {
    const sanitized: string = sanitizeHtml(text);

    if (text.length !== sanitized.length) {
      const supabase = await createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase
        .from("user")
        .update({
          status: UserStatus.Inactive,
        })
        .eq("id", user.id);
      await supabase.auth.signOut();
    }

    return sanitized;
  } catch (e) {
    if (e instanceof CustomError) throw e;
    throw CustomError.unexpected({
      operation: "sanitize",
      originalError: e,
    });
  }
}

export async function sanitizePublic(text: string): Promise<string> {
  try {
    const sanitized: string = sanitizeHtml(text);

    if (text.length !== sanitized.length) {
      throw CustomError.securityViolation({ operation: "sanitizePublic" });
    }

    return sanitized;
  } catch (e) {
    if (e instanceof CustomError) throw e;
    throw CustomError.unexpected({
      operation: "sanitizePublic",
      originalError: e,
    });
  }
}

export async function sanitizeForJsonLd(text: string | null | undefined): Promise<string> {
  if (!text) return "";

  // HTML 태그 제거 (JSON.stringify가 자동으로 특수문자 이스케이프 처리)
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
}
