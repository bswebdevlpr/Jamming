export default function ContentArea({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grow flex flex-col px-5">{children}</div>;
}
