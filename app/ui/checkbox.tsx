"use client";

import Image from "next/image";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CSSProperties } from "react";

export const RoundedCheckbox = ({
  onClick,
  thisState,
  className,
}: {
  onClick: any;
  // onClick: (() => void) | ((newVal: boolean) => void);
  thisState: boolean;
  className?: string;
}) => {
  return (
    <>
      {!thisState ? (
        <input
          type="checkbox"
          className={className}
          style={{
            appearance: "none",
            width: "20px",
            height: "20px",
            border: "1.5px solid",
            borderRadius: "50%",
            borderColor: "#9F9FA2",
          }}
          checked={thisState}
          onChange={onClick}
          // onChange={() => onClick(!thisState)}
        />
      ) : (
        <Image
          src="/check.svg"
          alt="note"
          width={20}
          height={20}
          // onClick={onClick}
          onClick={() => onClick(!thisState)}
        />
      )}
    </>
  );
};

export const SquaredCheckbox = ({
  style,
  onClick,
}: // thisState,
// className,
{
  onClick: () => void;
  // thisState: boolean;
  style?: CSSProperties;
  className?: string;
}) => {
  return (
    <Checkbox.Root
      className="w-5 h-5"
      style={{
        border: "2px solid #9DA2AC",
        borderRadius: "5px",
        ...style,
      }}
      onClick={() => onClick()}
    >
      <Checkbox.CheckboxIndicator>
        <div
          className="w-4 h-4"
          style={{
            backgroundColor: "white",
            borderRadius: "4px",
          }}
        ></div>
      </Checkbox.CheckboxIndicator>
    </Checkbox.Root>
  );
};
