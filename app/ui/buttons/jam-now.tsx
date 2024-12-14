import Plus from "../images/jamsession/plus";

export default function JamNow() {
  return (
    <span
      className="flex flex-row jusify-center items-center w-fit h-11 gap-1 pl-2.5 pr-4"
      style={{
        backgroundColor: "#242426",
        border: "1px solid #A3FF0C",
        borderRadius: "6.25rem",

        bottom: "9.06vh",
        right: "4.26vw",
        position: "fixed",
      }}
    >
      <Plus />
      <p
        style={{
          fontFamily: "SBAggroM",
          fontSize: "0.875rem",
          color: "#A3FF0C",
        }}
      >
        JAM NOW!
      </p>
    </span>
  );
}
