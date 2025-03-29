import ButtonTemplate, { ButtonTemplateProps } from "../templates/buttons";

const CompleteButton = ({
  onClick,
  className,
  style,
  isActive,
  styleActivated,
  type,
}: Partial<ButtonTemplateProps>) => {
  return (
    <ButtonTemplate
      text="완료"
      onClick={isActive ? onClick : null}
      className={className}
      style={
        style ?? {
          color: "#C0C0C5",
          border: "1px solid #535355",
        }
      }
      isActive={isActive}
      styleActivated={
        styleActivated ?? {
          color: "#A3FF0C",
          border: "1px solid #A3FF0C",
          background: "rgba(163, 255, 12, 0.12)",
        }
      }
      type={type}
    />
  );
};
export default CompleteButton;
