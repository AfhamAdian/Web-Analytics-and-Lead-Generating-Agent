"use client";

import { useState } from "react";
import AiPowered from "@/components/AiPowered";
import Definition from "@/components/Definition";
import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import InsightAndStory from "@/components/InsightAndStory";
import Partners from "@/components/Partners";
import SeeInAction from "@/components/SeeInAction";
import SmartTools from "@/components/SmartTools";
import SolutionsAndChallenges from "@/components/SolutionsAndChallenges";
// import { Button } from "flowbite-react";
// import { MessageSquare } from "lucide-react";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import LiveChat from "@/components/LiveChat";
// import { useChat } from "@/lib/chat-context";

export default function Home() {
  // const {showChat, setShowChat} = useChat();

  const [selectedDefinition, setSelectedDefinition] = useState<"buying" | "garments">("buying");

  // Sync Definition and AiPowered tabs both ways
  const handleAiTabChange = (tab: "brm" | "pi") => {
    setSelectedDefinition(tab === "brm" ? "buying" : "garments");
  };

  return (
    <main className="relative flex w-full flex-col items-center justify-between bg-[#13191D]">
      <Hero />
      <SmartTools />
      <Partners />
      <SolutionsAndChallenges />
      <Definition selected={selectedDefinition} setSelected={setSelectedDefinition} />
      <AiPowered
        activeTab={selectedDefinition === "buying" ? "brm" : "pi"}
        setActiveTab={handleAiTabChange}
      />
      <SeeInAction />
      <InsightAndStory />
      <FAQ />

      {/* Temporarily disabled chat functionality for production build */}
      {/*
      {process.env.NODE_ENV !== 'production' && (
        <Popover modal open={showChat} onOpenChange={setShowChat}>
          <PopoverTrigger asChild>
            <Button pill className="fixed bottom-6 right-6 h-14 w-14 p-1 transition-all transform hover:scale-110"><MessageSquare /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0 bg-[#13191D]">
            <LiveChat className="w-full h-96 p-2" />
          </PopoverContent>
        </Popover>
      )}
      */}
    </main>
  );
}
