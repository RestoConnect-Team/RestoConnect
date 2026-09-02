interface CarouselProps {
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  length: number;
}

export default function Carousel({
  currentIndex,
  setCurrentIndex,
  length,
}: CarouselProps) {
  const switchStyle = (i: number) => {
    if (i === currentIndex) {
      return "bg-[#CB006B] w-10";
    } else if (i < currentIndex) {
      return "bg-[#CB006B]/20 w-3";
    }
    return "bg-gray-200 w-3";
  };

  return (
    <nav className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className={`cursor-pointer h-3 rounded-full ${switchStyle(i)}`}
          onClick={() => setCurrentIndex(i)}
        />
      ))}
    </nav>
  );
}
