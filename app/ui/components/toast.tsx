"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { create } from "zustand";

/**
 * Toast 타입
 */
export type ToastType = "success" | "error" | "info";

/**
 * Toast 메시지 인터페이스
 */
export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms (기본: 3000)
}

/**
 * Toast Store 인터페이스
 */
interface ToastStore {
  toasts: ToastMessage[];
  addToast: (message: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

/**
 * Toast Zustand Store
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { ...message, id }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

/**
 * Toast 헬퍼 함수들
 */
export const toast = {
  success: (message: string, duration?: number) => {
    useToastStore.getState().addToast({ type: "success", message, duration });
  },
  error: (message: string, duration?: number) => {
    useToastStore.getState().addToast({ type: "error", message, duration });
  },
  info: (message: string, duration?: number) => {
    useToastStore.getState().addToast({ type: "info", message, duration });
  },
};

/**
 * Toast 타입별 색상
 */
const TOAST_COLORS = {
  success: {
    bg: "rgba(163, 255, 12, 0.16)",
    border: "#A3FF0C",
    text: "#A3FF0C",
  },
  error: {
    bg: "rgba(255, 62, 47, 0.16)",
    border: "#FF3E2F",
    text: "#FF3E2F",
  },
  info: {
    bg: "rgba(12, 124, 255, 0.16)",
    border: "#0C7CFF",
    text: "#0C7CFF",
  },
};

/**
 * 개별 Toast 아이템 컴포넌트
 */
function ToastItem({ toast }: { toast: ToastMessage }) {
  const { removeToast } = useToastStore();
  const duration = toast.duration ?? 3000;

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, duration, removeToast]);

  const colors = TOAST_COLORS[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{
        width: "min(calc(100% - 40px), 560px)",
        padding: "12px 16px",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "8px",
        marginBottom: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
      }}
    >
      <p
        style={{
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          color: colors.text,
          lineHeight: "140%",
          flex: 1,
        }}
      >
        {toast.message}
      </p>
      <button
        onClick={() => removeToast(toast.id)}
        style={{
          marginLeft: "12px",
          padding: "4px",
          background: "transparent",
          border: "none",
          color: colors.text,
          cursor: "pointer",
          fontSize: "1rem",
          lineHeight: "1",
        }}
        aria-label="닫기"
      >
        ×
      </button>
    </motion.div>
  );
}

/**
 * Toast 컨테이너 컴포넌트
 *
 * GlobalLayout에서 렌더링하여 전역적으로 사용
 *
 * @example
 * // app/(pages)/layout.tsx
 * <ToastContainer />
 *
 * // 사용 예시
 * import { toast } from '@/app/ui/components/toast';
 *
 * toast.success("밴드가 생성되었습니다!");
 * toast.error("권한이 없습니다.");
 * toast.info("로그인이 필요합니다.", 5000);
 */
export default function ToastContainer() {
  const { toasts } = useToastStore();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px", // BottomNavBar 위
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "var(--max-width)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 9999,
        padding: "0 20px",
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: "auto" }}>
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
