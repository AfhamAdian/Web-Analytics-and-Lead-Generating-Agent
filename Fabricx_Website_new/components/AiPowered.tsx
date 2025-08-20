"use client";

import { Button } from "flowbite-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import EarlyBirdForm from "./EarlyBirdForm";

interface FeatureItem {
  title: string;
  description: string;
}

interface AiPoweredProps {
  activeTab: "brm" | "pi";
  setActiveTab: (tab: "brm" | "pi") => void;
}

const FeatureCard = ({ title, description }: FeatureItem) => (
  <div
    className={`
      group relative bg-gray-800/50 backdrop-blur-sm border border-yellow-400/50 
      rounded-2xl text-center overflow-hidden 
      transition-all duration-300 ease-in-out transform hover:scale-105
      h-[180px] hover:h-[350px] w-full max-w-xs mx-auto
      hover:bg-[linear-gradient(to_bottom_right,_rgba(242,248,39,0.22),_rgba(242,248,39,0))]`}
  >
    <div className="w-full h-full px-6 py-4 relative">
      <h3 className="text-xl md:text-2xl font-bold text-[#F2F827] whitespace-pre-line absolute inset-0 flex items-center justify-center text-center group-hover:static group-hover:mb-4 transition-all duration-300">
        {title}
      </h3>
      <p className="text-base md:text-lg text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out whitespace-pre-line">
        {description}
      </p>
    </div>
  </div>
);

export default function AiPowered({ activeTab, setActiveTab }: AiPoweredProps) {
  const [internalTab, setInternalTab] = useState<"brm" | "pi">(activeTab);
  const [activeBottomTab, setActiveBottomTab] = useState("rmg");

  // sync internal tab with prop change (from Definition)
  useEffect(() => {
    setInternalTab(activeTab);
  }, [activeTab]);

  const handleToggleClick = (tab: "brm" | "pi") => {
    setInternalTab(tab);
    setActiveTab(tab); // sync back to parent
  };

  const brmFeatures: FeatureItem[] = [
    {
      title: "AI-Driven \nPersonalized Buyer \nCommunication",
      description:
        "Enables hyper-personalized, emotion-aware, and language-adapted communication with each buyer, improving trust and conversion rates.",
    },
    {
      title: "Production \nManagement \nSystem",
      description:
        "Streamlines lead acquisition and automates nurturing workflows to boost sample-to-order conversion, reducing manual follow-ups and errors.",
    },
    {
      title: "Automated Lead \nQualification & \nNurturing",
      description:
        "Analyzes buyer sentiment and engagement data to predict risks and opportunities, empowering proactive decision-making and higher buyer satisfaction.",
    },
  ];

  const piFeatures: FeatureItem[] = [
    {
      title: "Order Management System",
      description:
        "Centralizes all orders from Tech Pack to PP sample approval status with real-time tracking, predictive delay alerts, and automated workflow updates — empowering faster, error-free fulfillment.",
    },
    {
      title: "Inventory Management System (Coming Soon)",
      description:
        "Optimizes raw material and finished goods inventory with real-time visibility, \nAI-powered demand forecasting, and automated stock alerts to reduce waste and avoid shortages.",
    },
    {
      title: "Production Management System (Coming Soon)",
      description:
        "Streamlines production from line planning to shipment with real-time floor visibility, \nAI-driven bottleneck alerts, and data-backed efficiency optimization.",
    },
  ];

  const stychxFeatures: FeatureItem[] = [
    {
      title: "Get a free website in \nless than 15 minutes",
      description:
        "StychX guides you step-by-step to create a beautiful, conversion-ready website instantly. Just add your factory or buying house details, and you're live!",
    },
    {
      title: "Website \nMaintenance",
      description:
        "StychX handles all technical maintenance behind the scenes, ensuring your site stays fast, secure, & always on-line without extra cost.",
    },
    {
      title: "AI based SEO \nOptimization \nAssistance",
      description:
        "Our AI engine recommends keywords, optimizes product pages, and ensures your website ranks higher to attract international buyers effortlessly.",
    },
  ];

  const featuresToDisplay = internalTab === "brm" ? brmFeatures : piFeatures;

  const renderFeatureCards = (features: FeatureItem[]) => (
    <div className="w-full mb-12 px-4 sm:px-8 md:px-16">
      <div className="flex flex-col md:flex-row justify-center items-start gap-4 md:gap-6">
        {features.map((feature, idx) => (
          <div key={idx} className="flex-1 max-w-xs mx-auto">
            <FeatureCard
              title={feature.title}
              description={feature.description}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="relative w-full min-h-screen bg-no-repeat bg-cover bg-center py-16 sm:py-24"
      style={{
        backgroundImage: "url('/bg/bg2.png')",
        backgroundColor: "#13191d",
      }}
    >
      
      <section className="bg-[#13191d] py-8 sm:py-16 px-4 sm:px-8 lg:px-16 rounded-2xl w-full max-w-full" id="solutions">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
        <div className="max-w-4xl mx-auto text-center mb-12 px-2 sm:px-0">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-mono text-white mb-4">
            fabricXai&apos;s AI-Powered Solutions
          </h1>
          <p className="text-lg text-[#a8b0b7]">
            Comprehensive tools designed specifically for the RGM manufacturing
            industry.
          </p>
        </div>

        {/* Toggle Buttons (Preserved) */}
        <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-4 p-2 rounded-full max-w-fit mx-auto mb-12">
          <button
            onClick={() => handleToggleClick("brm")}
            className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-full border border-white whitespace-nowrap transition-colors duration-300 ${
              internalTab === "brm"
                ? "bg-white text-gray-900"
                : "bg-transparent text-white hover:bg-white/30"
            }`}
          >
            BRM Intelligence
          </button>
          <button
            onClick={() => handleToggleClick("pi")}
            className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-full border border-white whitespace-nowrap transition-colors duration-300 ${
              internalTab === "pi"
                ? "bg-white text-gray-900"
                : "bg-transparent text-white hover:bg-white/30"
            }`}
          >
            Production Intelligence
          </button>
        </div>

        {/* Cards */}
        {renderFeatureCards(featuresToDisplay)}

        {/* CTA */}
        <div className="flex flex-col justify-center items-center gap-4 text-center mb-12 px-4 sm:px-0">
          <div className="text-sm text-gray-300 leading-snug font-medium">
            Exclusive Offer! <span className="text-[#F2F827]">Free</span>
            <br />
            Production Intelligence for You
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-xs sm:max-w-none">
          <Button
            className="hidden md:block"
            onClick={() => window.open("https://webx.fabricxai.com", "_blank")}>
            Get Started
          </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <div>
                    <Button outline>
                      Be an Early Bird
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent showCloseButton={false}>
                  <DialogHeader>
                    <DialogTitle>Enter Your Details</DialogTitle>
                  </DialogHeader>
                  <div>
                    <EarlyBirdForm />
                  </div>
                </DialogContent>
              </Dialog>
          </div>
        </div>

        {/* Bottom Section: stychX */}
        <div className="mt-24 pt-16 border-t border-gray-700 px-4 sm:px-0">
          <div className="flex justify-center items-center gap-4 bg-gray-900/70 backdrop-blur-sm p-2 rounded-full max-w-xs mx-auto mb-12">
            <button
              onClick={() => setActiveBottomTab("rmg")}
              className={`w-full px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-colors duration-300 ${
                activeBottomTab === "rmg"
                  ? "bg-[#a8b0b7] text-gray-900"
                  : "bg-transparent text-white hover:bg-gray-700"
              }`}
            >
              For RMG
            </button>
          </div>

          <div className="text-center mb-12">
            <Image
              src="/icons/stychx.svg"
              alt="stychX Logo"
              width={160}
              height={40}
              className="mx-auto"
            />
          </div>

          {renderFeatureCards(stychxFeatures)}

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            className="hidden md:block"
            onClick={() => window.open("https://webx.fabricxai.com", "_blank")}>
            Get Started
          </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <div>
                    <Button outline>
                      Be an Early Bird
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent showCloseButton={false}>
                  <DialogHeader>
                    <DialogTitle>Enter Your Details</DialogTitle>
                  </DialogHeader>
                  <div>
                    <EarlyBirdForm />
                  </div>
                </DialogContent>
              </Dialog>
          </div>
        </div>
      </div>
      </section>
    </div>
  );
}
