export default function ContentArea({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grow flex flex-col px-4">{children}</div>;
}
