import * as Select from "@radix-ui/react-select";
import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { DownArrowOnEditPage } from "../images/mypage/edit/arrow";
import { LocationEnum } from "@/app/lib/enums/location.enum";
import { PositionEnum } from "@/app/lib/enums/position.enum";
import { GenreEnum } from "@/app/lib/enums/genre.enum";
import { LevelEnum } from "@/app/lib/enums/level.enum";

// 타입 정의
export type ProfileSelectType = "location" | "position" | "genre" | "level";

export type ProfileSelectValue<T extends ProfileSelectType> =
  T extends "location" ? LocationEnum :
  T extends "position" ? PositionEnum :
  T extends "genre" ? GenreEnum :
  T extends "level" ? LevelEnum :
  never;

export interface ProfileSelectProps<T extends ProfileSelectType> {
  type: T;
  value?: ProfileSelectValue<T>;
  onValueChange: (value: ProfileSelectValue<T>) => void;
  disabled?: boolean;
}

// 설정 상수 (드롭다운별 색상, 라벨, 아이템)
const PROFILE_SELECT_CONFIG = {
  location: {
    items: Object.values(LocationEnum),
    color: "#0C7CFF",
    label: "지역",
    ariaLabel: "지역 선택",
  },
  position: {
    items: Object.values(PositionEnum),
    color: "#FF3773",
    label: "포지션",
    ariaLabel: "포지션 선택",
  },
  genre: {
    items: Object.values(GenreEnum),
    color: "#A3FF0C",
    label: "장르",
    ariaLabel: "장르 선택",
  },
  level: {
    items: Object.values(LevelEnum),
    color: "#FFFFFF",
    label: "레벨",
    ariaLabel: "레벨 선택",
  },
} as const;

// 스타일 상수
const TRIGGER_CLASSES = "inline-flex items-center justify-center relative select-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3c] data-[state=open]:border-2 data-[state=open]:border-[#A3FF0C] focus:outline-none focus:border-2 focus:border-[#A3FF0C]";

const ITEM_CLASSES = "flex items-center justify-center cursor-pointer outline-none select-none first:border-t-0 last:border-b-0 data-[state=checked]:bg-[rgba(163,255,12,0.24)] data-[state=checked]:text-white data-[state=checked]:font-semibold";

// SelectItem: memo로 개별 아이템 최적화
const SelectItem = memo(({
  value,
  color,
  children
}: {
  value: string;
  color: string;
  children: React.ReactNode;
}) => {
  return (
    <Select.Item value={value} asChild>
      <motion.div
        className={ITEM_CLASSES}
        style={{
          width: "164px",
          height: "44px",
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          color,
          backgroundColor: "#323234",
          borderLeft: "none",
          borderRight: "none",
          borderTop: "none",
          borderBottom: "1px solid #9F9FA2",
          transition: "all 150ms",
        }}
        whileHover={{ backgroundColor: "rgba(163, 255, 12, 0.16)", color: "#FFFFFF" }}
        whileTap={{ backgroundColor: "rgba(163, 255, 12, 0.24)", scale: 0.98 }}
      >
        <Select.ItemText>{children}</Select.ItemText>
      </motion.div>
    </Select.Item>
  );
});
SelectItem.displayName = "SelectItem";

// ProfileSelect: 메인 컴포넌트
function ProfileSelectComponent<T extends ProfileSelectType>({
  type,
  value,
  onValueChange,
  disabled = false,
}: ProfileSelectProps<T>) {
  const config = PROFILE_SELECT_CONFIG[type];
  const items = config.items; // config.items가 이미 정적이므로 useMemo 불필요

  // useCallback: 안정적인 함수 참조
  const handleValueChange = useCallback(
    (newValue: string) => {
      // 타입 가드로 안전성 강화
      if ((items as readonly string[]).includes(newValue)) {
        onValueChange(newValue as ProfileSelectValue<T>);
      }
    },
    [onValueChange, items]
  );

  const placeholder = value ?? `${config.label} 선택`;

  return (
    <Select.Root onValueChange={handleValueChange} disabled={disabled}>
      <Select.Trigger
        className={TRIGGER_CLASSES}
        style={{
          width: "164px",
          height: "44px",
          borderRadius: "6px",
          backgroundColor: "var(--inactive-bg)",
          border: "1px solid #9F9FA2",
          fontFamily: "SUIT-BODY",
          fontSize: "0.875rem",
          color: config.color,
          paddingLeft: "16px",
          paddingRight: "36px",
        }}
        aria-label={config.ariaLabel}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon
          className="transition-transform duration-200 data-[state=open]:rotate-180"
          style={{
            position: "absolute",
            top: "50%",
            right: "12px",
            transform: "translateY(-50%)",
          }}
        >
          <DownArrowOnEditPage />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          asChild
          position="popper"
          side="bottom"
          sideOffset={4}
        >
          <motion.div
            className="overflow-hidden"
            style={{
              width: "164px",
              borderRadius: "6px",
              backgroundColor: "var(--inactive-bg)",
              border: "1px solid var(--mid-gray-border)",
              boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.6)",
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-gradient-to-b from-[#323234] to-transparent text-[#9F9FA2] text-xs cursor-pointer select-none hover:text-[#A3FF0C]">
              ▲
            </Select.ScrollUpButton>
            <Select.Viewport className="p-0 max-h-[220px] overflow-y-auto overflow-x-hidden">
              {items.map((item) => (
                <SelectItem key={item} value={item} color={config.color}>
                  {item}
                </SelectItem>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gradient-to-t from-[#323234] to-transparent text-[#9F9FA2] text-xs cursor-pointer select-none hover:text-[#A3FF0C]">
              ▼
            </Select.ScrollDownButton>
          </motion.div>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export const ProfileSelect = memo(ProfileSelectComponent) as typeof ProfileSelectComponent;
