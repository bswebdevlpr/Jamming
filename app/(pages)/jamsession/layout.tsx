import WorkSpace from "@/app/ui/layouts/workspace";

// 작업영역: 750px
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WorkSpace
      style={{
        position: "relative",
      }}
    >
      {children}
    </WorkSpace>
  );
}
