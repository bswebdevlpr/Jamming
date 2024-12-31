import { CSSProperties, ReactNode } from "react";

const ImageWithTxt = ({
  image,
  text,
  className,
  style,
  onClick,
}: {
  image: ReactNode;
  text: string | ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}) => {
  return (
    <span
      className={`flex flex-row items-center gap-0.5 ${className}`}
      style={style}
      onClick={onClick}
    >
      {image}
      {typeof text === "string" ? <p>{text}</p> : text}
    </span>
  );
};

export { ImageWithTxt };
