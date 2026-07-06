import Title from "../title/title";

export function PageLayout({
  children,
  title,
  onClick,
  buttonLabel,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
  buttonLabel?: string;
}) {
  return (
    <main className="flex-1 bg-[F5F5F5] p-6 min-h-[calc(100vh-14rem)] flex flex-col gap-6">
      <div className="flex w-full justify-between items-center">
        <Title title={title} />

        {onClick && (
          <button
            onClick={onClick}
            className="md:w-40 py-2 px-4 bg-[rgb(230,0,126)] text-white font-medium rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
          >
            {buttonLabel}
          </button>
        )}
      </div>
      <div className="w-full h-full overflow-y-auto">{children}</div>
    </main>
  );
}
