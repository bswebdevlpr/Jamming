export default function ContentArea({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full grow flex flex-col px-5" style={{ overflowX: "hidden" }}>
      {children}
    </div>
  );
}
