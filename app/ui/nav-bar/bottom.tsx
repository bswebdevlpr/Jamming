import HomeButton from "../buttons/home";
import MyActivity from "../images/jamsession/my-activity";
import Profile from "../images/jamsession/profile";

export default function BottomNavBar() {
  return (
    <div
      className="w-full flex flex-row"
      style={{
        height: "6.93vh", // 52px
        borderTop: "1px solid #323234",
        background: "#111113",
      }}
    >
      <div
        className="grow flex justify-center items-center"
        style={{
          padding: "6px 18px",
        }}
      >
        <MyActivity />
      </div>
      <div
        style={{
          transform: "translate(0vh, -2.13vh)", // 16px
        }}
      >
        <HomeButton />
      </div>
      <div
        className="grow flex justify-center items-center"
        style={{
          padding: "6px 18px",
        }}
      >
        <Profile />
      </div>
    </div>
  );
}
