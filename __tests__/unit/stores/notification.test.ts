import { describe, it, expect, beforeEach } from "vitest";
import { useNotificationStore } from "@/app/stores/notification";

describe("useNotificationStore", () => {
  beforeEach(() => {
    useNotificationStore.setState({ unreadCount: 0 });
  });

  it("should have initial unreadCount of 0", () => {
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  it("setUnreadCount should set the count", () => {
    useNotificationStore.getState().setUnreadCount(5);
    expect(useNotificationStore.getState().unreadCount).toBe(5);
  });

  it("decrementUnread should decrease count by 1", () => {
    useNotificationStore.getState().setUnreadCount(3);
    useNotificationStore.getState().decrementUnread();
    expect(useNotificationStore.getState().unreadCount).toBe(2);
  });

  it("decrementUnread should not go below 0", () => {
    useNotificationStore.getState().setUnreadCount(0);
    useNotificationStore.getState().decrementUnread();
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  it("resetUnread should set count to 0", () => {
    useNotificationStore.getState().setUnreadCount(10);
    useNotificationStore.getState().resetUnread();
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });
});
