export default function ContentArea({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grow flex flex-col pl-4 pr-4">{children}</div>;
}
