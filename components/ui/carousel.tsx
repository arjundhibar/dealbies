import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, MoveDiagonal, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function Carousel({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);
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

  const handleEnlarge = () => {
    setIsEnlarged(true);
  };

  const handleCloseEnlarged = () => {
    setIsEnlarged(false);
  };

  // Snap to active thumbnail
  React.useEffect(() => {
    if (thumbListRef.current) {
      const thumb = thumbListRef.current.querySelectorAll('[data-thumb]')[active] as HTMLElement;
      if (thumb) thumb.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    }
  }, [active]);

  // Auto-scroll to active thumbnail in sheet carousel
  React.useEffect(() => {
    if (isEnlarged) {
      const sheetThumb = document.querySelector(`[data-sheet-thumb="${active}"]`) as HTMLElement;
      if (sheetThumb) {
        sheetThumb.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
      }
    }
  }, [active, isEnlarged]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full min-h-[228px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Image src="/placeholder.svg?height=400&width=400" alt="No image" width={400} height={228} className="object-cover" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Thumbnails */}
        <div
          ref={thumbListRef}
          className="flex md:flex-col flex-row md:w-20 w-full md:h-full h-20 md:overflow-y-auto overflow-x-auto md:overflow-x-hidden md:snap-y snap-x md:snap-mandatory -mr-2 gap-2"
          style={{ maxHeight: '100%' }}
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
                width={54}
                height={54}
                className="object-fill w-full h-full"
              />
            </button>
          ))}
        </div>
        {/* Main image + arrows */}
        <div className="relative flex-1 flex items-center justify-center h-full min-h-[228px]">
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
            className="object-cover max-h-[378px] rounded-lg"
            sizes="(max-width: 768px) 1000vw, 342px"
          />
          <button
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/40 rounded-full p-1 hover:bg-white dark:hover:bg-black shadow"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Enlarge button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-2 right-2 rounded-[50vh] border border-[#dfe1e4] hover:border-[#d7d9dd] active:border-[#ced0d3] hover:bg-[#f3f5f7] active:bg-[#eceef0] text-[#6b6d70] hover:text-[#76787b] active:text-[#818386] cursor-pointer h-9 px-4 font-bold text-[0.875rem] whitespace-nowrap overflow-hidden text-ellipsis bg-white"
            onClick={handleEnlarge}
          >
            <MoveDiagonal className="h-4 w-4 mr-1" />
            Enlarge
          </Button>
        </div>
      </div>

      {/* Enlarged Image Bottom Sheet */}
      <Sheet open={isEnlarged} onOpenChange={setIsEnlarged}>
        <SheetContent side="bottom" className="h-[100vh] p-0">
          <SheetHeader className="absolute top-4 right-4 z-20">
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseEnlarged}
              className="h-10 w-10 rounded-full bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black shadow"
            >
              <X className="h-5 w-5" />
            </Button> */}
          </SheetHeader>
          
          {/* Main enlarged image with navigation arrows */}
          <div className="relative w-full h-full flex items-center justify-center pb-24">
            <Image
              src={images[active] || "/placeholder.svg?height=800&width=800"}
              alt={`Enlarged image ${active + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
            
            {/* Navigation arrows on main image */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="absolute border left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white hover:bg-[#f3f5f7] text-[#6b6d70] hover:text-[#76787b] backdrop-blur-sm"
              disabled={images.length <= 1}
            >
              <ChevronLeft  />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute border right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white hover:bg-[#f3f5f7] text-[#6b6d70] hover:text-[#76787b] backdrop-blur-sm"
              disabled={images.length <= 1}
            >
              <ChevronRight className="" />
            </Button>
          </div>

          {/* Bottom carousel navigation */}
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
            <div className="flex items-center justify-center max-w-4xl mx-auto">
              {/* Horizontal thumbnail carousel */}
              <div className="flex-1 overflow-x-auto scrollbar-hide">
                <div className="flex gap-1 sm:gap-2 justify-center min-w-max">
                  {images.map((img, idx) => (
                    <button
                      key={`sheet-thumb-${idx}`}
                      data-sheet-thumb={idx}
                      className={`flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                        idx === active 
                          ? "border-white scale-110 shadow-lg" 
                          : "border-white/30 hover:border-white/60 hover:scale-105"
                      }`}
                      onClick={() => setActive(idx)}
                    >
                      <Image
                        src={img || "/placeholder.svg?height=60&width=60"}
                        alt={`Thumbnail ${idx + 1}`}
                        width={60}
                        height={60}
                        className="object-cover w-12 h-12 sm:w-15 sm:h-15"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
