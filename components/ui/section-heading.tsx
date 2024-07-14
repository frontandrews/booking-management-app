export default function SectionHeading({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="pb-5 sm:flex sm:items-center sm:justify-between py-10">
      <h1 className="text-4xl font-bold">{title}</h1>
      <div className="mt-3 sm:ml-4 sm:mt-0">{children}</div>
    </div>
  );
}
