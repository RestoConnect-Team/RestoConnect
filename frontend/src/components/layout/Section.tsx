export function Section({
  children,
  withPadding = true,
  className,
  title,
}: {
  children: React.ReactNode;
  withPadding?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={`flex flex-col relative bg-white rounded-xl border border-gray-200 ${className} ${withPadding ? "p-5" : ""}`}
    >
      <h2 className="text-[15px] font-bold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}
