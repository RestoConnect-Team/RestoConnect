export function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col bg-white rounded-xl border border-gray-200 ${className} `}
    >
      {children}
    </div>
  );
}
