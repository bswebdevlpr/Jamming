"use client";

import Image from "next/image";
import { CSSProperties } from "react";

const style_checkbox_round_unchecked: CSSProperties = {
  appearance: "none",
  width: "20px",
  height: "20px",
  border: "1.5px solid",
  borderRadius: "50%",
  borderColor: "#9F9FA2",
};

export const RoundedCheckbox = ({
  onClick,
  thisState,
  className,
}: {
  onClick: (() => void) | ((newVal: boolean) => void);
  thisState: boolean;
  className?: string;
}) => {
  const handler = () => {
    onClick(!thisState);
  };

  return (
    <>
      {!thisState ? (
        <input
          type="checkbox"
          className={className}
          style={style_checkbox_round_unchecked}
          checked={thisState}
          onChange={handler}
        />
      ) : (
        <Image
          src="/check.svg"
          alt="note"
          width={20}
          height={20}
          onClick={handler}
        />
      )}
    </>
  );
};
