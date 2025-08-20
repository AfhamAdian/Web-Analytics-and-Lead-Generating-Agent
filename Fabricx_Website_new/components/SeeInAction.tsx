import React from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import { Button } from "flowbite-react";
import RequestDemoForm from "./RequestDemoForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export default function SeeInAction() {
  const featureCards = [
    {
      title: "Save Time",
      description: "Automate critical workflows and focus on strategic growth.",
      icon: "/icons/time.svg",
      position: "left",
    },
    {
      title: "Win More Buyers",
      description: "Personalized, AI-powered communication to build trust.",
      icon: "/icons/meet.svg",
      position: "left",
    },
    {
      title: "Boost Profitability",
      description: "Real-time insights to cut costs and improve margins.",
      icon: "/icons/growth.svg",
      position: "right",
    },
    {
      title: "Boost Profitability",
      description: "Real-time insights to cut costs and improve margins.",
      icon: "/icons/growth.svg",
      position: "right",
    },
  ];

  // Bullet points data
  const bulletPoints = [
    "No tech skills needed.",
    "No upfront commitment.",
    "See the future of garments operations today.",
  ];

  return (
    <div className="w-full px-12 md:px-24 py-16">
      <div className="max-w-4xl mx-auto text-center mb-12 px-2 sm:px-0">
        <h1 className="text-4xl sm:text-5xl font-extrabold font-mono text-white mb-4">
          See fabricXai in Action
        </h1>
        <p className="text-lg text-[#a8b0b7]">
          Discover how you can streamline operations, build stronger buyer
          relationships & scale confidently all in one platform.
        </p>
      </div>
      <div className="flex flex-col md:flex-row w-full justify-between gap-8 md:gap-4">
        <div className="flex flex-col justify-between gap-8 w-full lg:w-1/2">
          <div className="flex flex-col lg:flex-row gap-4">
            <Image
              className="w-24 h-24"
              alt="Feature icon"
              src={featureCards[0].icon}
              width={96}
              height={96}
            />
            <div className="flex flex-col items-center justify-center rounded-3xl border-[0.5px] border-solid border-[#a8b0b7] bg-transparent px-8 py-4">
              <div className="font-semibold text-[#f2f827] text-2xl">
                {featureCards[0].title}
              </div>
              <div className="font-normal text-white text-xs">
                {featureCards[0].description}
              </div>
            </div>
            <div className="hidden lg:block w-24 h-24"></div>
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="hidden lg:block w-24 h-24"></div>
            <Image
              className="w-24 h-24"
              alt="Feature icon"
              src={featureCards[1].icon}
              width={96}
              height={96}
            />

            <div className="flex flex-col items-center justify-center rounded-3xl border-[0.5px] border-solid border-[#a8b0b7] bg-transparent px-8 py-4">
              <div className="font-semibold text-[#f2f827] text-2xl">
                {featureCards[1].title}
              </div>
              <div className="font-normal text-white text-xs">
                {featureCards[1].description}
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="hidden lg:block w-24 h-24"></div>

            <div className="flex flex-col items-center justify-center rounded-3xl border-[0.5px] border-solid border-[#a8b0b7] bg-transparent px-8 py-4">
              <div className="font-semibold text-[#f2f827] text-2xl">
                {featureCards[2].title}
              </div>
              <div className="font-normal text-white text-xs">
                {featureCards[2].description}
              </div>
            </div>
            <Image
              className="w-24 h-24"
              alt="Feature icon"
              src={featureCards[2].icon}
              width={96}
              height={96}
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-col items-center justify-center rounded-3xl border-[0.5px] border-solid border-[#a8b0b7] bg-transparent px-8 py-4">
              <div className="font-semibold text-[#f2f827] text-2xl">
                {featureCards[3].title}
              </div>
              <div className="font-normal text-white text-xs">
                {featureCards[3].description}
              </div>
            </div>
            <Image
              className="w-24 h-24"
              alt="Feature icon"
              src={featureCards[3].icon}
              width={96}
              height={96}
            />
            <div className="hidden lg:block w-24 h-24"></div>
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-1/2 gap-4">
          {/* Demo video section */}
          <div className="w-full h-96">
            {/* <video width="320" height="240" controls preload="none">
              <source src="/path/to/video.mp4" type="video/mp4" />
              <track
                src="/path/to/captions.vtt"
                kind="subtitles"
                srcLang="en"
                label="English"
              />
              Your browser does not support the video tag.
            </video> */}
            <iframe className="w-full h-full" src="https://www.youtube.com/embed/IGgANoSFWjU" allowFullScreen />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <div>
                <Button className="w-full">
                  Book Your Free Demo
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Enter Your Details</DialogTitle>
              </DialogHeader>
              <div>
                <RequestDemoForm />
              </div>
            </DialogContent>
          </Dialog>

          <div className="font-medium text-[#a8b0b7] text-sm leading-6">
            {bulletPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Check className=" w-[18px] h-[11px]" color="#a8b0b7" />
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
