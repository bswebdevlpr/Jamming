/**
 * Test notification factory
 */
export function createTestNotification(overrides: Record<string, any> = {}) {
  return {
    id: 1,
    user_id: "test-user-id-001",
    type: "system" as const,
    title: "테스트 알림",
    body: "테스트 알림 내용입니다",
    data: {},
    is_read: false,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create multiple notifications for list testing
 */
export function createTestNotificationList(count: number = 5) {
  return Array.from({ length: count }, (_, i) =>
    createTestNotification({
      id: i + 1,
      title: `알림 ${i + 1}`,
      body: `알림 내용 ${i + 1}`,
      is_read: i >= 3, // first 3 unread, rest read
      created_at: new Date(Date.now() - i * 3600000).toISOString(),
    })
  );
}

/**
 * Rejam notification data
 */
export function createRejamNotificationData() {
  return {
    jam_ids: [1, 2],
    sender_id: "test-user-id-002",
    sender_nickname: "다른유저",
  };
}
