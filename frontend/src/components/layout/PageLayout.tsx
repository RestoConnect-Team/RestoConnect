import Title from "../title/title";

export function PageLayout({
  children,
  title,
  onClick,
  buttonLabel,
}: {
  children: React.ReactNode;
  title?: string;
  onClick?: () => void;
  buttonLabel?: string | React.ReactNode;
}) {
  return (
    <main className="flex-1 bg-[F5F5F5] min-h-[calc(100vh-14rem)] flex flex-col">
      {(onClick || title) && (
        <div className="flex w-full justify-between items-center p-6 pb-0">
          {title && <Title title={title} />}

          {onClick && (
            <button
              onClick={onClick}
              className="flex items-center justify-center gap-2 md:w-35 py-2 px-4 bg-[rgb(230,0,126)] text-white 
              font-medium rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
            >
              {buttonLabel}
            </button>
          )}
        </div>
      )}
      <div className="w-full h-full overflow-y-auto">{children}</div>
    </main>
  );
}
