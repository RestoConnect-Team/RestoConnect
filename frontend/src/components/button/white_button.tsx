export interface TextProps {
  text: string;
}

export default function WhiteButton({
  text,
}: TextProps) {
  return (
    <button className="w-full md:w-40 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
        {text}
    </button>
  );
}