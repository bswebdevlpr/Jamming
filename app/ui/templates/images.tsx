import { CSSProperties, ReactNode } from "react";

const ImageWithTxt = ({
  image,
  text,
  className,
  style,
  onClick,
}: {
  image: ReactNode;
  text: string;
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
      <p>{text}</p>
    </span>
  );
};

export { ImageWithTxt };
