import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export function Carousel({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const thumbListRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  const handleThumbClick = (idx: number) => {
    setActive(idx);
  };

  // Snap to active thumbnail
  React.useEffect(() => {
    if (thumbListRef.current) {
      const thumb = thumbListRef.current.querySelectorAll('[data-thumb]')[active] as HTMLElement;
      if (thumb) thumb.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    }
  }, [active]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[228px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Image src="/placeholder.svg?height=400&width=400" alt="No image" width={400} height={228} className="object-cover" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full h-full">
      {/* Thumbnails */}
      <div
        ref={thumbListRef}
        className="flex md:flex-col flex-row md:w-20 w-full md:h-[228px] h-20 md:overflow-y-auto overflow-x-auto md:overflow-x-hidden snap-y md:snap-y snap-x md:snap-mandatory md:gap-2 gap-2 md:mr-2"
        style={{ maxHeight: 228 }}
      >
        {images.map((img, idx) => (
          <button
            key={`${idx}-${img || 'placeholder'}`}
            data-thumb
            className={`border rounded-lg overflow-hidden flex-shrink-0 md:w-16 md:h-16 w-16 h-16 focus:outline-none transition-all duration-200 ${
              idx === active ? "border-[var(--borderAccentBrand)]" : "border-transparent"
            }`}
            onClick={() => handleThumbClick(idx)}
            aria-label={`Show image ${idx + 1}`}
            tabIndex={0}
          >
            <Image
              src={img || "/placeholder.svg?height=64&width=64"}
              alt={`Thumbnail ${idx + 1}`}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
      {/* Main image + arrows */}
      <div className="relative flex-1 flex items-center justify-center min-h-[228px]">
        <button
          onClick={handlePrev}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/40 rounded-full p-1 hover:bg-white dark:hover:bg-black shadow"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <Image
          src={images[active] || "/placeholder.svg?height=400&width=400"}
          alt={`Image ${active + 1}`}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 342px"
        />
        <button
          onClick={handleNext}
          aria-label="Next image"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/40 rounded-full p-1 hover:bg-white dark:hover:bg-black shadow"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
