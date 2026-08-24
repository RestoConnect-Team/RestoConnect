import Carousel from "./Carousel";
import { useState } from "react";
import getWelcomeSlides from "./utils/getWelcomeSlides";

export default function WelcomePage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const slides = getWelcomeSlides(currentSlideIndex, setCurrentSlideIndex);

  return (
    <div className="absolute top-0 left-0 w-screen h-screen z-999">
      <div
        className={`w-full h-full ${slides[currentSlideIndex].bgColor} flex flex-col items-end transition duration-500`}
      >
        <div className="flex-1 w-full flex flex-col items-center">
          <div className="h-15 w-full flex justify-end">
            <button className="cursor-pointer text-white/50 hover:text-white transition px-8">
              Passer
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            {slides[currentSlideIndex].img}
          </div>
        </div>
        <section className="flex justify-center bg-white w-full h-[35%] rounded-t-[40px]">
          <div className="flex flex-col w-[40%] justify-between p-5">
            <Carousel
              currentIndex={currentSlideIndex}
              setCurrentIndex={setCurrentSlideIndex}
              length={slides.length}
            />
            {slides[currentSlideIndex].node}
          </div>
        </section>
      </div>
    </div>
  );
}
