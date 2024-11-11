"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useState } from "react";

const style_checkbox_round_unchecked: CSSProperties = {
  appearance: "none",
  width: "20px",
  height: "20px",
  border: "1.5px solid",
  borderRadius: "50%",
  borderColor: "#9F9FA2",
};

export const RoundedCheckbox = ({
  className,
  state,
  onClick,
}: {
  className?: string;
  state: boolean;
  onClick?: () => void;
}) => {
  const [isChecked, setIsChecked] = useState(state);

  const handler = () => {
    console.log("handler called");
    setIsChecked(!isChecked);
    if (onClick) {
      console.log("onclick called");
      onClick();
    }
  };

  useEffect(() => {
    console.log("useEffect called");
    setIsChecked(state);
  }, [state]);

  return (
    <>
      {!isChecked ? (
        <input
          type="checkbox"
          className={className}
          style={style_checkbox_round_unchecked}
          checked={isChecked}
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
