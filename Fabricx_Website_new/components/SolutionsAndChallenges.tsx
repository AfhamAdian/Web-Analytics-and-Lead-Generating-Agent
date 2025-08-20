import { Button } from "flowbite-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import RequestDemoForm from "./RequestDemoForm";
import EarlyBirdForm from "./EarlyBirdForm";

export default function SolutionsAndChallenges() {
  const solutions = [
    {
      title: "AI-driven Communication",
      description:
        "Automated, multilingual communication ensures clear and timely information exchange.",
      icon: "/icons/soluiton1.svg",
    },
    {
      title: "Automated Data Entry",
      description:
        "AI-powered data extraction and processing eliminates manual work and errors.",
      icon: "/icons/solution2.svg",
    },
    {
      title: "Predictive Analytics",
      description:
        "Data-driven forecasting helps optimize production planning and resource allocation.",
      icon: "/icons/solution3.svg",
    },
    {
      title: "Live Dashboards",
      description:
        "Real-time visibility into production status and performance metrics.",
      icon: "/icons/solution4.svg",
    },
  ];

  const challenges = [
    {
      title: "Poor Communication Delays Orders",
      description:
        "Miscommunication leads to costly production delays and buyer dissatisfaction.",
      icon: "/icons/challenge1.svg",
    },
    {
      title: "Manual Data Processes",
      description:
        "Time-consuming paperwork and error-prone manual data entry waste resources.",
      icon: "/icons/challenge2.svg",
    },
    {
      title: "Unreliable Forecasting",
      description:
        "Lack of data-driven insights leads to poor planning and resource allocation.",
      icon: "/icons/challenge3.svg",
    },
    {
      title: "No Real-time Status",
      description:
        "Inability to track production progress in real-time creates blind spots.",
      icon: "/icons/challenge4.svg",
    },
  ];

  return (
    <section className="w-screen bg-gradient-to-t from-[#13191d] to-[#1e2529] rounded-t-3xl py-16 text-white font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#f2f827]">
            Solving RMG Industry&apos;s Biggest Challenges
          </h2>
          <p className="text-gray-400 mt-2 text-base sm:text-lg">
            Transform your RMG operations with AI-powered solutions.
          </p>
        </div>

        {/* Solutions and Challenges Block */}
        <div className="flex flex-col md:flex-row justify-center items-start gap-10 md:gap-20 mb-12 max-w-[1200px] mx-auto w-full">
          {/* Solutions */}
          <div className="flex flex-col w-full md:max-w-[500px]">
            <div className="bg-[#34383b] hover:bg-[#2a2d30] rounded-xl p-6 sm:p-8 w-full hover:scale-105 transform transition-all duration-300">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#f2f827] mb-6">
                Solutions
              </h3>
              <ul className="space-y-5">
                {solutions.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#1a2025] rounded-full flex items-center justify-center flex-shrink-0">
                      <Image src={item.icon} alt="" width={20} height={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row self-center gap-4 mt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <div>
                    <Button>
                      Request a Demo
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

          {/* Challenges */}
          <div className="w-full md:max-w-[550px] min-h-[500px] rounded-xl border border-white hover:bg-[#0f141a] hover:scale-105 transform transition-all duration-300 p-6 sm:p-10 flex flex-col justify-between">
            <div className="flex flex-col gap-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#f2f827]">
                Challenges
              </h3>
              <ul className="flex flex-col gap-8">
                {challenges.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#34383b] rounded-full flex items-center justify-center flex-shrink-0">
                      <Image
                        src={item.icon}
                        alt=""
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#f2f827]">{item.title}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
