"use server";

import { CustomError, ErrorCode } from "@/app/lib/errors/custom-error";
import { Entity_Notification } from "@/app/lib/interfaces/entity.interface";
import { safeAction } from "@/app/lib/functions/server-action";
import { ActionResult } from "@/app/lib/types/result";
import { createClient } from "@/app/util/supabase/server";

export async function getNotifications(
  limit: number = 20,
  offset: number = 0
): Promise<ActionResult<Entity_Notification[]>> {
  return safeAction("getNotifications", async () => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) {
      throw CustomError.fromAuthError(
        ErrorCode.INVALID_SESSION,
        authErr ?? { message: "User not found" },
        "getNotifications"
      );
    }

    const { data, error } = await supabase
      .from("notification")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "getNotifications"
      );
    }

    return data ?? [];
  });
}

export async function getUnreadCount(): Promise<ActionResult<number>> {
  return safeAction("getUnreadCount", async () => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) {
      throw CustomError.fromAuthError(
        ErrorCode.INVALID_SESSION,
        authErr ?? { message: "User not found" },
        "getUnreadCount"
      );
    }

    const { count, error } = await supabase
      .from("notification")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "getUnreadCount"
      );
    }

    return count ?? 0;
  });
}

export async function markAsRead(
  notificationId: number
): Promise<ActionResult<boolean>> {
  return safeAction("markAsRead", async () => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) {
      throw CustomError.fromAuthError(
        ErrorCode.INVALID_SESSION,
        authErr ?? { message: "User not found" },
        "markAsRead"
      );
    }

    const { error } = await supabase
      .from("notification")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", user.id);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "markAsRead"
      );
    }

    return true;
  });
}

export async function markAllAsRead(): Promise<ActionResult<boolean>> {
  return safeAction("markAllAsRead", async () => {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) {
      throw CustomError.fromAuthError(
        ErrorCode.INVALID_SESSION,
        authErr ?? { message: "User not found" },
        "markAllAsRead"
      );
    }

    const { error } = await supabase
      .from("notification")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      throw CustomError.fromSupabaseError(
        ErrorCode.UNEXPECTED,
        error,
        "markAllAsRead"
      );
    }

    return true;
  });
}

