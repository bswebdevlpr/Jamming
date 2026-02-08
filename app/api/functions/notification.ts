"use server";

import { CustomError } from "@/app/lib/errors/custom-error";
import { Entity_Notification } from "@/app/lib/interfaces/entity.interface";
import { createClient } from "@/app/util/supabase/server";

export async function getNotifications(
  limit: number = 20,
  offset: number = 0
): Promise<Entity_Notification[]> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) throw CustomError.InvalidUserSession;

    const { data, error } = await supabase
      .from("notification")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw CustomError.UnExpected;

    return data ?? [];
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) throw CustomError.InvalidUserSession;

    const { count, error } = await supabase
      .from("notification")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    if (error) throw CustomError.UnExpected;

    return count ?? 0;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }
}

export async function markAsRead(notificationId: number): Promise<boolean> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) throw CustomError.InvalidUserSession;

    const { error } = await supabase
      .from("notification")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", user.id);
    if (error) throw CustomError.UnExpected;

    return true;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }
}

export async function markAllAsRead(): Promise<boolean> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) throw CustomError.InvalidUserSession;

    const { error } = await supabase
      .from("notification")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    if (error) throw CustomError.UnExpected;

    return true;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    if (e instanceof CustomError) throw e;
    else throw CustomError.UnExpected;
  }
}

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  body?: string,
  data?: Record<string, any>
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("notification").insert({
      user_id: userId,
      type,
      title,
      body,
      data: data ?? {},
    });
    if (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
      return false;
    }

    return true;
  } catch (e) {
    if (process.env.NODE_ENV === "development") console.error(e);
    return false;
  }
}
