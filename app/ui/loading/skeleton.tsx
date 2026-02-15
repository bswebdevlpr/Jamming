"use client";

import React from "react";

// ---------------------------------------------------------------------------
// Layout Constants
// ---------------------------------------------------------------------------

const SKELETON_LAYOUT = {
  TAG_WIDTH: "19.2%", // FlexRow의 태그 영역 너비
  CONTENT_WIDTH_LONG: "60%",
  CONTENT_WIDTH_SHORT: "50%",
  TITLE_WIDTH: "60%",
  BODY_WIDTH_PARTIAL: "75%",
  INFO_ROW_COUNT: 5,
} as const;

// ---------------------------------------------------------------------------
// Base Skeleton Components
// ---------------------------------------------------------------------------

interface SkeletonBoxProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export function SkeletonBox({
  width,
  height,
  borderRadius = 4,
  className = "",
  style = {},
}: SkeletonBoxProps) {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius:
          typeof borderRadius === "number"
            ? `${borderRadius}px`
            : borderRadius,
        ...style,
      }}
    />
  );
}

interface SkeletonCircleProps {
  size: number;
  className?: string;
}

export function SkeletonCircle({ size, className = "" }: SkeletonCircleProps) {
  return (
    <SkeletonBox
      width={size}
      height={size}
      borderRadius="50%"
      className={className}
    />
  );
}

// ---------------------------------------------------------------------------
// Jam Feed Skeleton
// ---------------------------------------------------------------------------

export function JamFeedItemSkeleton() {
  return (
    <div
      className="w-full flex justify-between py-3"
      style={{
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* 좌측 콘텐츠 */}
      <div className="flex flex-col gap-1.5" style={{ minWidth: 0, flex: 1 }}>
        {/* 제목 */}
        <SkeletonBox width="70%" height={16} />
        {/* 태그 리스트 (3개) */}
        <div className="flex gap-1">
          <SkeletonBox width={50} height={24} borderRadius={12} />
          <SkeletonBox width={50} height={24} borderRadius={12} />
          <SkeletonBox width={50} height={24} borderRadius={12} />
        </div>
        {/* 인원 정보 */}
        <SkeletonBox width={60} height={14} />
      </div>

      {/* 우측 썸네일 */}
      <div className="flex gap-4 justify-end items-center">
        <SkeletonBox width={72} height={72} />
      </div>
    </div>
  );
}

export function JamFeedSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="w-full h-full overflow-without-scroll">
      {Array.from({ length: count }, (_, idx) => (
        <JamFeedItemSkeleton key={idx} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Jam Post Page Skeleton
// ---------------------------------------------------------------------------

export function JamPostSkeleton() {
  return (
    <div className="grow h-full max-h-full flex flex-col overflow-hidden">
      {/* Section A: Top Navigation */}
      <div className="flex flex-row justify-between items-center px-4 py-3">
        <SkeletonCircle size={24} />
        <SkeletonBox width={24} height={24} />
      </div>

      {/* Section B: User Profile */}
      <div
        className="flex flex-row px-4 py-2 gap-3"
        style={{
          borderBottom: "1px solid var(--divider)",
        }}
      >
        <SkeletonCircle size={44} />
        <div className="grow flex flex-col gap-0.5">
          <SkeletonBox width={120} height={14} />
          <SkeletonBox width={180} height={12} />
        </div>
      </div>

      {/* Section C: FlexRow Information Rows */}
      {Array.from({ length: SKELETON_LAYOUT.INFO_ROW_COUNT }, (_, idx) => (
        <div
          key={idx}
          className="flex flex-row px-4 py-3.5 gap-4 items-center"
          style={{
            borderBottom: "1px solid var(--divider)",
          }}
        >
          <SkeletonBox width={SKELETON_LAYOUT.TAG_WIDTH} height={14} />
          <SkeletonBox
            width={
              idx % 2 === 0
                ? SKELETON_LAYOUT.CONTENT_WIDTH_LONG
                : SKELETON_LAYOUT.CONTENT_WIDTH_SHORT
            }
            height={14}
            className="grow"
          />
        </div>
      ))}

      {/* Section D: Thick Divider */}
      <hr
        style={{
          border: "none",
          borderTop: "4px solid var(--border)",
        }}
      />

      {/* Section E: Content Area */}
      <div className="grow px-4 overflow-auto">
        <div className="pt-8">
          <SkeletonBox width={SKELETON_LAYOUT.TITLE_WIDTH} height={18} />
        </div>
        <div className="py-5 flex flex-col gap-3">
          <SkeletonBox width="100%" height={14} />
          <SkeletonBox width="100%" height={14} />
          <SkeletonBox width="100%" height={14} />
          <SkeletonBox width={SKELETON_LAYOUT.BODY_WIDTH_PARTIAL} height={14} />
        </div>
      </div>

      {/* Section F: Bottom Apply Button */}
      <div
        className="px-4 py-3"
        style={{
          borderTop: "1px solid var(--divider)",
          background: "var(--background)",
        }}
      >
        <SkeletonBox width="100%" height={40} borderRadius={8} />
      </div>
    </div>
  );
}
