"use client";

import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";

export default function InsightAndStory() {
  const [showPopup, setShowPopup] = useState(false);

  const handleSubscribe = () => {
    setShowPopup(true);
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <section
      className="w-full bg-cover bg-center bg-no-repeat py-16 px-4 sm:px-8 lg:px-16 rounded-2xl"
      style={{ backgroundImage: "url('/bg/bg3.png')" }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-5xl font-mono text-gray-800">
          Latest Insights & Stories
        </h2>
        <p className="text-gray-700 mt-2 max-w-2xl mx-auto">
          Discover how AI, innovation, and data are shaping the future of
          garment manufacturing.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        {/* Main Blog */}
        <div className="flex flex-col h-full">
          <div className="flex flex-col h-full">
            <Link
              href="/blogs"
              className="aspect-[3/2] w-full relative rounded-lg overflow-hidden group"
            >
              <Image
                src="/bg/blog-cover1.png"
                alt="Main Blog Cover"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <Link href="/blogs">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">
                The Impact of AI on the Fashion Industry
              </h3>
            </Link>
            <p className="text-sm sm:text-base text-gray-700 mt-2">
              How artificial intelligence is transforming fashion design and
              production........
            </p>
            <Link href="/blogs">
              <button className="mt-3 text-sm font-semibold text-black flex items-center gap-1 group w-fit">
                Read More{" "}
                <span className="transform group-hover:translate-x-1 transition">
                  →
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* Sidebar Blogs */}
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-6 flex-grow">
            {/* Blog 2 */}
            <div className="flex gap-4 items-start">
              <Link
                href="/blogs"
                className="aspect-[4/3] w-[40%] relative rounded-lg overflow-hidden group"
              >
                <Image
                  src="/bg/blog-cover2.png"
                  alt="Blog 2"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-col justify-between w-[60%]">
                <Link href="/blogs">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                    Innovative Technologies in Apparel Production
                  </h4>
                </Link>
                <p className="text-sm text-gray-700 mt-1 leading-tight">
                  Exploring the latest advancements in garment manufacturing.
                </p>
                <Link href="/blogs">
                  <button className="mt-1 text-sm font-semibold text-black flex items-center gap-1 group w-fit">
                    Read More{" "}
                    <span className="transform group-hover:translate-x-1 transition">
                      →
                    </span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Blog 3 */}
            <div className="flex gap-4 items-start">
              <Link
                href="/blogs"
                className="aspect-[4/3] w-[40%] relative rounded-lg overflow-hidden group"
              >
                <Image
                  src="/bg/blog-cover3.png"
                  alt="Blog 3"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-col justify-between w-[60%]">
                <Link href="/blogs">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                    Data-Driven Decision Making in Manufacturing
                  </h4>
                </Link>
                <p className="text-sm text-gray-700 mt-1 leading-tight">
                  Leveraging data to optimize processes and drive efficiency.
                </p>
                <Link href="/blogs">
                  <button className="mt-1 text-sm font-semibold text-black flex items-center gap-1 group w-fit">
                    Read More{" "}
                    <span className="transform group-hover:translate-x-1 transition">
                      →
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Explore All */}
          <div className="mt-6">
            <Link href="/blogs">
              <button className="w-full px-6 py-3 border border-gray-400 rounded-md text-black bg-white font-semibold hover:bg-gray-200 transition">
                Explore All Blogs
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="mt-16 flex justify-center">
        <div className="bg-[#1c1e22] text-white rounded-2xl px-6 py-8 w-[90%] sm:w-[80%] lg:w-[70%] text-center flex flex-col items-center gap-4">
          <h3 className="text-xl sm:text-2xl font-bold">
            Subscribe to Our{" "}
            <span className="text-[#f2f827]">Monthly Insights</span>
          </h3>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full">
            <input
              type="email"
              placeholder="Enter your email address"
              className="px-4 py-2 rounded-md text-black bg-[#d9d9d9] w-full sm:w-80"
              suppressHydrationWarning={true}
            />
            <Button className="w-full sm:w-40" onClick={handleSubscribe}>
              Subscribe
            </Button>
          </div>

          <p className="text-sm text-[#a8b0b7]">
            Get exclusive trends and tips straight to your inbox — no spam
          </p>

          <div className="text-center text-xs text-[#ffffff] mt-5">
            &ldquo;Read by 500+ garment industry leaders across Bangladesh.&rdquo;
          </div>

          {showPopup && (
            <div className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-md animate-fadeIn">
              Thank you for subscribing!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
