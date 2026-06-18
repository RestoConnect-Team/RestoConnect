
export interface PageErrorProps {
  page_error: string;
  className?: string;
}

export default function PageError({
  page_error,
  className = "mb-8"
}: PageErrorProps) {
  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex gap-3 ${className}`}>
      <span className="text-lg">⚠️</span>
      <span>{page_error}</span>
    </div>
  );
}
