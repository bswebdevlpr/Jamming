import Logo from "../images/logo";

export default function HomeButton() {
  return (
    <div
      className="flex justify-center items-center"
      style={{
        width: "56px",
        height: "56px",
        border: "1px solid #A3FF0C",
        borderRadius: "50%",
        backgroundColor: "#111113",
      }}
    >
      <Logo />
    </div>
  );
}
