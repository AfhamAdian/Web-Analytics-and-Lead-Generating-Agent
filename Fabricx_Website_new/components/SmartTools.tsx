import Image from "next/image";

export default function SmartTools() {
  const tools = [
    {
      title: "Automated Buyer Communication",
      description: "AI agents send multilingual, personalized emails and follow-ups.",
      icon: "/icons/mail.svg",
    },
    {
      title: "Real time Production Tracking",
      description: "Live updates on order milestones & progress.",
      icon: "/icons/chart.svg",
    },
    {
      title: "Data-Driven Decision Making",
      description: "Built-in insights to guide better business outcomes.",
      icon: "/icons/bar-chart.svg",
    },
    {
      title: "Scalable & Secure Platform",
      description: "Enterprise-level security and seamless growth.",
      icon: "/icons/shield.svg",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-t from-[#363a3d] to-[#a5adb4] rounded-3xl px-4 sm:px-8 md:px-16 py-16 text-white shadow-lg" id="features">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#13191d] font-mono">
        Smart Tools for Smarter Operations
      </h2>
      <p className="text-[#13191d] text-center mb-12 max-w-3xl mx-auto">
        Leverage AI-powered solutions designed specifically for the RGM manufacturing industry.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        {tools.map((tool, idx) => {
          const extraMargin =
            idx === 0 ? "ml-0" : idx === tools.length - 1 ? "mr-0" : "";

          return (
            <div
              key={idx}
              className={`w-full max-w-[300px] h-[260px] ${extraMargin} 
                group bg-[#242a30] border border-yellow-400/50 rounded-xl 
                p-6 flex flex-col justify-start relative overflow-hidden
                transition-transform duration-300 ease-in-out hover:scale-105
                hover:bg-[linear-gradient(to_bottom_right,_rgba(242,248,39,0.22),_rgba(242,248,39,0))]
              `}
            >
              <div className="w-14 h-14 rounded-full bg-[#34383b] flex items-center justify-center mb-4">
                <Image
                  src={tool.icon}
                  alt={`${tool.title} Icon`}
                  width={24}
                  height={24}
                />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-[#f2f827] mb-2">
                {tool.title}
              </h3>
              <p
                className="
                  absolute bottom-6 left-6 right-6 text-sm text-[#d1d5db] 
                  opacity-0 translate-y-4 
                  group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-300 ease-in-out
                "
              >
                {tool.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
