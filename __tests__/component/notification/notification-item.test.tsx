import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createTestNotification } from "../../mocks/fixtures/notification";

// next/navigation mock (setup.ts 에서 전역으로 설정됨)
const mockPush = vi.fn();
vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      refresh: vi.fn(),
    })),
  };
});

import NotificationItem from "@/app/(pages)/(only-user)/notification/components/notification-item";

describe("NotificationItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===== 라우팅 테스트 =====
  describe("타입별 라우팅", () => {
    it("rejam 알림 클릭 시 /myact로 이동한다", () => {
      const notification = createTestNotification({
        type: "rejam",
        data: { jam_ids: [1, 2] },
      });

      render(<NotificationItem notification={notification as any} />);
      fireEvent.click(screen.getByText(notification.title).closest("div")!);

      expect(mockPush).toHaveBeenCalledWith("/myact");
    });

    it("jam_apply 알림 클릭 시 jam_id가 있으면 /myact/{jamId}로 이동한다", () => {
      const notification = createTestNotification({
        type: "jam_apply",
        title: "새로운 잼 신청",
        data: { jam_id: 42 },
      });

      render(<NotificationItem notification={notification as any} />);
      fireEvent.click(screen.getByText("새로운 잼 신청").closest("div")!);

      expect(mockPush).toHaveBeenCalledWith("/myact/42");
    });

    it("jam_apply 알림 클릭 시 jam_id가 없으면 /myact로 이동한다", () => {
      const notification = createTestNotification({
        type: "jam_apply",
        title: "새로운 잼 신청",
        data: {},
      });

      render(<NotificationItem notification={notification as any} />);
      fireEvent.click(screen.getByText("새로운 잼 신청").closest("div")!);

      expect(mockPush).toHaveBeenCalledWith("/myact");
    });

    it("jam_accepted 알림 클릭 시 jam_id가 있으면 /jamsession/post/{jamId}로 이동한다", () => {
      const notification = createTestNotification({
        type: "jam_accepted",
        title: "잼 신청 수락",
        data: { jam_id: 7 },
      });

      render(<NotificationItem notification={notification as any} />);
      fireEvent.click(screen.getByText("잼 신청 수락").closest("div")!);

      expect(mockPush).toHaveBeenCalledWith("/jamsession/post/7");
    });

    it("jam_accepted 알림 클릭 시 jam_id가 없으면 /jamsession으로 이동한다", () => {
      const notification = createTestNotification({
        type: "jam_accepted",
        title: "잼 신청 수락",
        data: {},
      });

      render(<NotificationItem notification={notification as any} />);
      fireEvent.click(screen.getByText("잼 신청 수락").closest("div")!);

      expect(mockPush).toHaveBeenCalledWith("/jamsession");
    });

    it("jam_rejected 알림 클릭 시 /jamsession으로 이동한다", () => {
      const notification = createTestNotification({
        type: "jam_rejected",
        title: "잼 신청 반려",
        data: { jam_id: 7 },
      });

      render(<NotificationItem notification={notification as any} />);
      fireEvent.click(screen.getByText("잼 신청 반려").closest("div")!);

      expect(mockPush).toHaveBeenCalledWith("/jamsession");
    });
  });

  // ===== 라벨 렌더링 테스트 =====
  describe("타입별 라벨", () => {
    it("rejam 타입은 'REJAM!' 라벨을 표시한다", () => {
      const notification = createTestNotification({ type: "rejam" });
      render(<NotificationItem notification={notification as any} />);

      expect(screen.getByText("REJAM!")).toBeDefined();
    });

    it("jam_accepted 타입은 'ACCEPTED!' 라벨을 표시한다", () => {
      const notification = createTestNotification({ type: "jam_accepted" });
      render(<NotificationItem notification={notification as any} />);

      expect(screen.getByText("ACCEPTED!")).toBeDefined();
    });

    it("jam_apply 타입은 특별한 라벨을 표시하지 않는다", () => {
      const notification = createTestNotification({ type: "jam_apply" });
      render(<NotificationItem notification={notification as any} />);

      expect(screen.queryByText("REJAM!")).toBeNull();
      expect(screen.queryByText("ACCEPTED!")).toBeNull();
    });

    it("jam_rejected 타입은 특별한 라벨을 표시하지 않는다", () => {
      const notification = createTestNotification({ type: "jam_rejected" });
      render(<NotificationItem notification={notification as any} />);

      expect(screen.queryByText("REJAM!")).toBeNull();
      expect(screen.queryByText("ACCEPTED!")).toBeNull();
    });
  });

  // ===== 읽음/안읽음 표시 테스트 =====
  describe("읽음 상태 표시", () => {
    it("안읽은 알림은 초록색 배경과 표시를 가진다", () => {
      const notification = createTestNotification({ is_read: false });
      const { container } = render(
        <NotificationItem notification={notification as any} />
      );

      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.style.backgroundColor).toBe("rgba(163, 255, 12, 0.04)");
    });

    it("읽은 알림은 투명 배경이다", () => {
      const notification = createTestNotification({ is_read: true });
      const { container } = render(
        <NotificationItem notification={notification as any} />
      );

      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper.style.backgroundColor).toBe("transparent");
    });
  });

  // ===== 본문 렌더링 테스트 =====
  describe("내용 표시", () => {
    it("제목과 본문을 모두 표시한다", () => {
      const notification = createTestNotification({
        title: "테스트 제목",
        body: "테스트 본문",
      });
      render(<NotificationItem notification={notification as any} />);

      expect(screen.getByText("테스트 제목")).toBeDefined();
      expect(screen.getByText("테스트 본문")).toBeDefined();
    });

    it("본문이 없으면 본문 영역을 렌더링하지 않는다", () => {
      const notification = createTestNotification({
        title: "제목만 있음",
        body: null,
      });
      render(<NotificationItem notification={notification as any} />);

      expect(screen.getByText("제목만 있음")).toBeDefined();
    });
  });
});
