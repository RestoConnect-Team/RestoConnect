export interface PinkButtonProps {
  text: string;
  onClick?: () => void;
}

export default function PinkButton({
  text,
  onClick,
}: PinkButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full md:w-40 py-2 px-4 bg-[rgb(230,0,126)] text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
    >
        {text}
    </button>
  );
}