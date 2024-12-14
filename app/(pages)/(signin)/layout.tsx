import ContentArea from "@/app/ui/layouts/content-area";
import WorkSpace from "@/app/ui/layouts/workspace";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WorkSpace>
      <ContentArea>{children}</ContentArea>
    </WorkSpace>
  );
}
