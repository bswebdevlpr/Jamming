import WorkSpace from "@/app/ui/layouts/workspace";
import BottomNavBar from "@/app/ui/navbar/bottom";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WorkSpace>
      {children}
      <BottomNavBar />
    </WorkSpace>
  );
}
