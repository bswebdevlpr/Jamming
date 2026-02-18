import * as Select from "@radix-ui/react-select";
import { DownArrowOnEditPage } from "../images/mypage/edit/arrow";
import { useEffect } from "react";

export default function RadixSelect({
  items,
  color,
  placeholder,
  onValueChange,
}: {
  items: string[];
  color: string;
  placeholder: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Select.Root onValueChange={onValueChange}>
      <Select.Trigger
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "164px",
          height: "33px",

          backgroundColor: "#323234",
          borderRadius: "3px",

          color,

          position: "relative",
        }}
        aria-label=""
      >
        <Select.Value placeholder={placeholder ?? "-"} />
        <Select.Icon
          style={{
            position: "absolute",
            top: "9px",
            right: "11px",
          }}
        >
          <DownArrowOnEditPage />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden">
          <Select.ScrollUpButton />
          <Select.Viewport className="">
            {items.map((val, idx) => (
              <Select.Item
                key={idx}
                value={val}
                className="flex justify-center items-center"
                style={{
                  width: "164px",
                  height: "33px",

                  alignItems: "center",
                  justifyContent: "center",

                  backgroundColor: "#323234",
                  border: "1px solid #9F9FA2",

                  fontFamily: "SUIT-BODY",
                  fontSize: "0.875rem",
                  color,
                }}
              >
                <Select.ItemText>{val}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
            <Select.Separator />
          </Select.Viewport>
          <Select.ScrollDownButton />
          <Select.Arrow />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
