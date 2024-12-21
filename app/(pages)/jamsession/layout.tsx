import JamNow from "@/app/ui/buttons/jam-now";
import ContentArea from "@/app/ui/layouts/content-area";
import WorkSpace from "@/app/ui/layouts/workspace";
import BottomNavBar from "@/app/ui/navbar/bottom";
import TopNavBar from "@/app/ui/navbar/jamsession/top";

// 작업영역: 750px
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WorkSpace
      style={{
        position: "relative",
      }}>
      <TopNavBar />
      <ContentArea>{children}</ContentArea>
      <JamNow />
      <BottomNavBar />
    </WorkSpace>
  );
}
