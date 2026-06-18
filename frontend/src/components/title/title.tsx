export interface TitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function Title({
  title,
  subtitle,
  className = "mb-12"
}: TitleProps) {
  return (
    <div className={className}>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
      {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
      <div className="h-1 w-20 bg-gradient-to-r from-[rgb(230,0,126)] to-[rgb(240,51,127)] rounded-full mt-4"></div>
    </div>
  );
}