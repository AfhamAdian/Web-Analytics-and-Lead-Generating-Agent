"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  "/icons/microsoft.svg",
  "/icons/open-ai.svg",
  "/icons/nvidia.svg",
  "/icons/langchain.svg",
  "/icons/google.svg",
  "/icons/sociofi.svg",
];

export default function Partners() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = images.length;
  const visibleCount = 3;

  // Create extended array for seamless infinite loop
  const extendedImages = [...images, ...images, ...images];

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= totalImages) {
          return 0;
        }
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [totalImages]);

  // Calculate translateX - each image takes up 100/visibleCount% of container width
  const slideWidth = 100 / visibleCount;
  // Start from the middle set of images to allow seamless looping
  const translateX = -((currentIndex + totalImages) * slideWidth);

  return (
    <div className="w-full max-w-full overflow-hidden">
      <section className="bg-[#13191d] py-8 sm:py-16 px-4 sm:px-8 lg:px-16 rounded-2xl w-full max-w-full" id="partners">
        <div className="max-w-5xl mx-auto text-center text-white w-full">
          <h5 className="text-lg sm:text-xl lg:text-2xl font-medium text-[#e0e626]">
            Technology Stack
          </h5>

          <div className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold mt-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            {/* Accompanying text */}
            <span className="text-center sm:text-left leading-tight">
              Powered by Industry Leaders
            </span>
          </div>
          <p className="text-sm sm:text-base text-center sm:text-left mt-2 text-[#a8b0b7] max-w-3xl mx-auto">
            We partner with the world&apos;s leading technology companies to deliver cutting-edge AI solutions
          </p>
          <div className="mt-8 sm:mt-12 w-full overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(${translateX}%)`,
              }}
            >
              {extendedImages.map((src, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center justify-center px-2 sm:px-4"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div className="relative w-32 h-24 sm:w-40 sm:h-28 lg:w-48 lg:h-32">
                    <Image
                      src={src}
                      alt={`Partner ${(index % totalImages) + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 4rem, (max-width: 1024px) 5rem, 6rem"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}