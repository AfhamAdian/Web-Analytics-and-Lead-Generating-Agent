"use client";

interface DefinitionProps {
  selected: "buying" | "garments";
  setSelected: React.Dispatch<React.SetStateAction<"buying" | "garments">>;
}

export default function Definition({ selected, setSelected }: DefinitionProps) {
  return (
    <section
      className="w-screen bg-cover bg-center bg-no-repeat flex items-center justify-center py-20 px-4 rounded-3xl"
      style={{
        backgroundImage: `url('/bg/bg1.png')`,
      }}
    >
      <div className="text-center">
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-10">
          What Defines You Most?
        </h2>

        <div className="flex flex-col gap-4 items-center">
          {/* Buying House */}
          <button
            onClick={() => setSelected("buying")}
            className={`relative flex items-center px-6 py-3 rounded-xl border-2 font-semibold w-[300px] justify-center bg-[#12181c] transition-transform duration-300 ease-in-out will-change-transform hover:scale-105 hover:bg-[#12181c]
              ${
                selected === "buying"
                  ? "text-[#f2f827] border-[#f2f827]"
                  : "text-white border-white"
              }`}
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          >
            <span
              className={`absolute left-4 w-5 h-5 flex items-center justify-center rounded-sm border-2
                ${
                  selected === "buying"
                    ? "border-[#f2f827] text-[#f2f827] bg-transparent"
                    : "border-white bg-white"
                }`}
            >
              {selected === "buying" && (
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>

            <span className="w-full text-center pl-6">
              Buying House
            </span>
          </button>

          {/* Garments Manufacturers */}
          <button
            onClick={() => setSelected("garments")}
            className={`relative flex items-center px-6 py-3 rounded-xl border-2 font-semibold w-[300px] justify-center bg-[#12181c] transition-transform duration-300 ease-in-out will-change-transform hover:scale-105 hover:bg-[#12181c]
              ${
                selected === "garments"
                  ? "text-[#f2f827] border-[#f2f827]"
                  : "text-white border-white"
              }`}
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          >
            <span
              className={`absolute left-4 w-5 h-5 flex items-center justify-center rounded-sm border-2
                ${
                  selected === "garments"
                    ? "border-[#f2f827] text-[#f2f827] bg-transparent"
                    : "border-white bg-white"
                }`}
            >
              {selected === "garments" && (
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
            <span className="w-full text-center pl-6">
              Garments Manufacturers
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
