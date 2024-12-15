import Plus from "../images/jamsession/plus";

export default function JamNow() {
  return (
    <span
      className="flex flex-row jusify-center items-center w-fit h-11 gap-1 pl-2.5 pr-4"
      style={{
        backgroundColor: "#242426",
        border: "1px solid #A3FF0C",
        borderRadius: "6.25rem",

        position: "absolute",
        bottom: "9.6%",
        right: "5.33%",
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
