export default function WorkSpace({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between min-w-full min-h-screen">
      {children}
    </div>
  );
}
