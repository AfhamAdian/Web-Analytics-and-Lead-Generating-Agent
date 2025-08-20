"use client";

import Image from "next/image";

function BlogsPage() {
  return (
    <div className="w-full min-h-screen bg-[#13191d] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">

        {/* ── Blog 1 ── */}
        <article className="space-y-6">
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src="/blogs-cover/blog1.png"
              alt="Supply Chain Insights Cover"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-[#f2f827]">
            Supply Chain Insights: Enhancing Efficiency in Bangladesh’s RMG Industry
          </h1>
          <p className="text-lg italic text-white/80">
            Is Bangladesh&apos;s RMG Supply Chain Ready for the Next Decade?
          </p>
          <div className="space-y-4 text-base sm:text-lg leading-relaxed">
            <p>
              The Ready-Made Garments (RMG) industry is the lifeblood of Bangladesh’s economy, contributing over 80% of total exports and employing nearly 4 million workers. However, inefficiencies in supply chain management (SCM) are hindering growth, raising concerns about sustainability and competitiveness in the global market.
            </p>
            <p>
              With global buyers now prioritizing lead time, compliance, and sustainability over just cost, the time has come for the Bangladesh RMG sector to rethink its supply chain strategies.
            </p>
            <h2 className="text-xl font-semibold text-[#f2f827]">The Current Landscape: Bangladesh’s RMG Supply Chain</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>🔹 Lead time for exports from Bangladesh: 90–120 days vs. China (40–50 days), India (50–70 days), and Sri Lanka (19–45 days).</li>
              <li>🔹 Over 70% of raw materials (fabrics, accessories) are imported, increasing delays and costs.</li>
              <li>🔹 Compliance requirements after Rana Plaza & Tazreen Fashion disasters have raised production costs.</li>
            </ul>
            <h2 className="text-xl font-semibold text-[#f2f827]">Key Challenges & Solutions</h2>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>🚨 <strong>Challenge 1:</strong> Long Lead Times  
                <br /><strong>Solution:</strong> Investing in local textile and accessories manufacturing to strengthen backward linkages.</li>
              <li>⚙️ <strong>Challenge 2:</strong> Low Adoption of SCM Technologies  
                <br /><strong>Solution:</strong> Implementing ERP systems, AI-driven demand forecasting, and real-time tracking.</li>
              <li>🔗 <strong>Challenge 3:</strong> Weak Supply Chain Collaboration  
                <br /><strong>Solution:</strong> Data-sharing platforms and collaborative planning to enhance coordination and reduce inefficiencies.</li>
              <li>🛑 <strong>Challenge 4:</strong> Rising Compliance Costs & Safety Concerns  
                <br /><strong>Solution:</strong> Implementing workplace safety programs, automation, and energy-efficient processes.</li>
              <li>🚢 <strong>Challenge 5:</strong> Inefficient Logistics & Port Congestion  
                <br /><strong>Solution:</strong> Expanding inland logistics (rail, river transport) and automating port operations.</li>
              <li>🔄 <strong>Challenge 6:</strong> Lack of Product Innovation & Diversification  
                <br /><strong>Solution:</strong> Encouraging fashion innovation, high-value apparel (sportswear, technical textiles), and sustainable products.</li>
            </ul>
            <h2 className="text-xl font-semibold text-[#f2f827]">Future Outlook: Transforming Bangladesh’s SCM for Global Competitiveness</h2>
            <p>
              The global fashion industry is undergoing rapid digitalization, and buyers are demanding shorter lead times, better compliance, and eco-friendly production. Bangladesh must embrace supply chain transformation to stay competitive.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>✔️ AI and Machine Learning for demand forecasting and automated inventory management.</li>
              <li>✔️ Blockchain for supply chain transparency and ensuring compliance.</li>
              <li>✔️ Green manufacturing initiatives to attract sustainability-focused brands.</li>
              <li>✔️ Smart factories & IoT-enabled production for efficiency improvements.</li>
            </ul>
            <p>
              By reducing lead times, improving compliance, and integrating technology, Bangladesh’s RMG sector can reach its $50 billion export target and sustain long-term global competitiveness.
            </p>
            <p className="font-semibold text-[#f2f827]">
              💡 Drop your insights in the comments!
            </p>
          </div>
        </article>

        <hr className="border-gray-600" />

        {/* ── Blog 2 ── */}
        <article className="space-y-6">
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src="/blogs-cover/blog2.png"
              alt="Garib & Garib Fire Safety Cover"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-[#f2f827]">
            15 Years After the Garib & Garib Factory Fire: How AI Can Revolutionize Fire Safety in Bangladesh’s RMG Industry
          </h2>
          <div className="space-y-4 text-base sm:text-lg leading-relaxed">
            <h3 className="text-xl font-semibold text-[#f2f827]">Introduction</h3>
            <p>
              On February 26, 2010, a devastating fire broke out at the Garib & Garib Sweater Factory in Gazipur, Bangladesh, claiming the lives of at least 21 workers due to toxic smoke inhalation and the lack of proper emergency exits. This tragedy was one of many industrial disasters that exposed the fire hazards in garments and the dire need for better textile factory safety regulations.
            </p>
            <p>
              Fifteen years later, Bangladesh&apos;s Ready-Made Garment (RMG) industry has made significant progress in improving workplace safety, yet fire risks remain a major concern. Advances in AI fire prevention in RMG, IoT-based fire detection, and smart automation now present a game-changing opportunity to prevent such disasters.
            </p>
            <h3 className="text-xl font-semibold text-[#f2f827]">The Incident: What Happened on February 26, 2010?</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Location:</strong> Gazipur, Bangladesh</li>
              <li><strong>Casualties:</strong> 21+ workers perished due to smoke inhalation and blocked exits</li>
              <li><strong>Cause:</strong> Electrical short circuit near highly flammable materials</li>
              <li><strong>Safety Failures:</strong> No advanced fire detection systems, blocked stairways and locked exits, lack of worker fire safety training, absence of fire suppression equipment</li>
            </ul>
            <h3 className="text-xl font-semibold text-[#f2f827]">Other Major Industrial Disasters in Bangladesh</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Tazreen Fashions Fire (2012):</strong> 117 deaths, caused by inadequate fire exits.</li>
              <li><strong>Rana Plaza Collapse (2013):</strong> 1,100+ deaths, a structural failure due to poor factory conditions.</li>
            </ul>
            <h3 className="text-xl font-semibold text-[#f2f827]">Why Did This Happen? (Root Causes)</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Poor infrastructure & outdated safety systems</li>
              <li>Lack of proper fire detection & suppression systems</li>
              <li>Blocked or insufficient emergency exits</li>
              <li>Weak regulatory enforcement & compliance failures</li>
            </ul>
            <h3 className="text-xl font-semibold text-[#f2f827]">The Aftermath & Industry Reforms</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Accord on Fire and Building Safety (2013):</strong> 38,000+ factory inspections and enforced safety improvements.</li>
              <li><strong>Alliance for Bangladesh Worker Safety (2013):</strong> Fire safety, emergency training, and compliance enforcement.</li>
              <li><strong>RMG Sustainability Council (2020):</strong> National body ensuring ongoing compliance with safety standards.</li>
            </ul>
            <h3 className="text-xl font-semibold text-[#f2f827]">The Role of AI & Modern Technology</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>AI-Powered Fire Detection & Prevention:</strong> Thermal cameras & IoT sensors detect faults early.</li>
              <li><strong>Smart Fire Suppression Systems:</strong> AI-controlled sprinklers and robotic firefighters.</li>
              <li><strong>AI-Optimized Evacuation & Safety:</strong> Wearable IoT alerts and digital twin simulations.</li>
              <li><strong>AI for Compliance & Training:</strong> CCTV-based audits and VR fire drills.</li>
            </ul>
            <p>
              To prevent future tragedies, Bangladesh’s garment industry must fully integrate AI-powered safety systems, digital twin technology, and smart automation into its fire prevention strategies.
            </p>
            <p className="font-semibold text-[#f2f827]">
              💡 How do you think AI can revolutionize fire safety in factories? Let’s discuss in the comments!
            </p>
          </div>
        </article>

        <hr className="border-gray-600" />

        {/* ── Blog 3 ── */}
        <article className="space-y-6">
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src="/blogs-cover/blog3.png"
              alt="Yarn Import Suspension Cover"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-[#f2f827]">
            Bangladesh&apos;s Suspension of Yarn Imports from India: Causes, Implications, and Path Forward
          </h2>
          <div className="space-y-4 text-base sm:text-lg leading-relaxed">
            <p>
              Bangladesh&apos;s National Board of Revenue (NBR) has suspended the import of yarn from India through land ports effective April 15, 2025. This decision marks a significant shift in the textile trade dynamics between the two neighboring countries and highlights the ongoing tensions between protecting domestic industries and ensuring a competitive manufacturing sector.
            </p>
            <h3 className="text-xl font-semibold text-[#f2f827]">Motivations Behind the Suspension</h3>
            <p>
              The primary driver was advocacy from the Bangladesh Textile Mills Association (BTMA), backed by a recommendation from the Trade and Tariff Commission to halt land‑port imports and bolster domestic yarn usage.
            </p>
            <h3 className="text-xl font-semibold text-[#f2f827]">Price Disparities & Under‑Invoicing Concerns</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Price gap: 20–25 cents per kilogram favoring imported yarn</li>
              <li>Under‑invoicing at Chattogram Customs House raising evasion concerns</li>
            </ul>
            <h3 className="text-xl font-semibold text-[#f2f827]">Supply Chain Dynamics</h3>
            <p>
              Indian yarn is warehoused in Kolkata and shipped via land ports, offering speed and cost advantages that undercut local producers.
            </p>
            <h3 className="text-xl font-semibold text-[#f2f827]">Historical Evolution of Yarn Imports</h3>
            <p>
              Imports rose to 12.15 lakh tonnes in 2024 (31.45% ↑ from 2023), valued at $3 billion, with January 2025 figures hitting 36,735 M BDT.
            </p>
            <h3 className="text-xl font-semibold text-[#f2f827]">Impact on SMEs</h3>
            <p>
              Smaller exporters rely on land‑port flexibility; the ban threatens their supply agility and cost structure.
            </p>
            <h3 className="text-xl font-semibold text-[#f2f827]">Comparative Quality & Strategic Responses</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Diversify sources via sea/air—China, Turkey, Uzbekistan</li>
              <li>Invest in domestic infrastructure—power, gas, modern equipment</li>
              <li>Explore vertical integration into spinning capacity</li>
              <li>Leverage automation and digital monitoring for efficiency</li>
            </ul>
            <p>
              Balancing protection with competitiveness will determine the long‑term success of Bangladesh’s textile sector.
            </p>
            <p className="font-semibold text-[#f2f827]">
              🧐 What strategies should Bangladesh prioritize next?
            </p>
          </div>
        </article>

        <hr className="border-gray-600" />

        {/* ── Blog 4 ── */}
        <article className="space-y-6">
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src="/blogs-cover/blog4.png"
              alt="Digital Presence Financial Impact Cover"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-[#f2f827]">
            Financial Impact of Digital Presence and Website Availability on Bangladesh&apos;s RMG and Buying House Industries: A Comprehensive Analysis
          </h2>
          <div className="space-y-4 text-base sm:text-lg leading-relaxed">
            <p>
              The ready-made garments (RMG) sector and buying houses in Bangladesh face significant financial challenges due to limited digital presence and website adoption. With the RMG sector contributing approximately 83% of Bangladesh&apos;s total export earnings and generating $38.48 billion in 2024, the lack of comprehensive digital transformation presents substantial missed opportunities.
            </p>
            <h3 className="text-xl font-semibold text-[#f2f827]">Financial Importance of Websites for RMG Factories</h3>
            <h4 className="font-semibold">Revenue Generation and Market Access</h4>
            <p>
              Digital marketing and website presence offer significant ROI advantages for textile manufacturers. Studies indicate that digital marketing provides better return on investment compared to traditional advertising methods, with data-driven insights helping track performance and refine strategies.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Global Market Reach: Access virtual markets worth $308 billion by 2026.</li>
              <li>Direct-to-Consumer Models: Higher profit margins and branding control.</li>
              <li>Enhanced Brand Building: 75% of buyers judge credibility by website quality.</li>
              <li>Cost-Effective Marketing: Up to 200% higher conversion rates, 62% increase in lead gen.</li>
            </ul>
            <h4 className="font-semibold">Operational Efficiency Benefits</h4>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Supply Chain Optimization via ERP and real-time tracking.</li>
              <li>Quality Control Enhancement with digital inspection and ML.</li>
              <li>Data-Driven Decision Making using analytics tools.</li>
            </ul>
            <h3 className="text-xl font-semibold text-[#f2f827]">Annual Financial Losses</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Direct Production Losses: $400 million during labor unrest (≃$1 million/factory).</li>
              <li>Market Share Erosion: $2 billion in shifted orders (5–6% of exports).</li>
              <li>Operational Costs: 50% production cost increase; 40% factories at loss.</li>
            </ul>
            <h3 className="text-xl font-semibold text-[#f2f827]">Financial Impact on Buying Houses</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>High Client Acquisition Costs without websites.</li>
              <li>Lost Business: 24/7 storefront absence reduces opportunities.</li>
              <li>Communication Inefficiencies: No digital collaboration tools.</li>
            </ul>
            <h3 className="text-xl font-semibold text-[#f2f827]">Comparative Analysis: Digital Adoption</h3>
            <p>
              Bangladesh’s digital adoption lags behind Vietnam, India, and China, which leverage advanced e‑commerce, Industry 4.0, and live‑stream commerce to gain market share.
            </p>
            <h3 className="text-xl font-semibold text-[#f2f827]">Recommendations</h3>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Immediate Website Development & SEO investment.</li>
              <li>ERP & Analytics Tool Adoption for efficiency.</li>
              <li>Participation in Global B2B Platforms (e.g., Alibaba).</li>
            </ul>
            <p className="font-semibold text-[#f2f827]">
              🚀 Digital transformation is no longer optional.
            </p>
          </div>
        </article>

        <hr className="border-gray-600" />

        {/* ── Blog 5 ── */}
<article className="space-y-6">
  <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
    <Image
      src="/blogs-cover/blog5.png"
      alt="Attracting Top Buyers Cover"
      fill
      className="object-cover"
      priority
    />
  </div>
  <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-[#f2f827]">
    Key Strategies for Attracting Top International Buyers in the RMG Sector
  </h2>
  <div className="space-y-4 text-base sm:text-lg leading-relaxed">
    <p>
      In today’s fast-evolving global apparel market, standing out to top international buyers is
      more challenging—and more vital—than ever. Whether you’re a seasoned manufacturer or an
      emerging player in the Ready-Made Garment (RMG) sector, here’s how you can make your
      business irresistible to the world’s leading brands.
    </p>
    <ol className="list-decimal list-inside ml-4 space-y-4">
      <li>
        <strong className="text-[#f2f827]">Diversify and Upgrade Your Product Portfolio</strong>
        <p className="mt-2">
          International buyers are looking for more than just basics. Expand your offerings to
          include value-added, innovative, and sustainable products. Focus on quality enhancements
          and introduce collections that align with global fashion trends.
        </p>
      </li>
      <li>
        <strong className="text-[#f2f827]">Prioritize Sustainability and Compliance</strong>
        <p className="mt-2">
          Sustainability isn’t just a buzzword—it’s a business imperative. Invest in eco‑friendly
          materials, achieve recognized certifications, and ensure ethical labor practices
          throughout your supply chain. Transparent operations and compliance with international
          standards build trust and open doors to premium buyers.
        </p>
      </li>
      <li>
        <strong className="text-[#f2f827]">Deliver Fast, Reliable, and Flexible Service</strong>
        <p className="mt-2">
          Buyers value partners who can meet tight deadlines and adapt to changing requirements.
          Streamline your operations for efficiency, ensure consistent on‑time delivery, and be
          ready to accommodate last‑minute requests. Reliability is a key differentiator.
        </p>
      </li>
      <li>
        <strong className="text-[#f2f827]">Embrace Digital Transformation</strong>
        <p className="mt-2">
          Digitize your processes to enhance transparency and buyer confidence. Offer real‑time
          order tracking, digital sampling, and even virtual factory tours. Use digital platforms—
          especially LinkedIn—to showcase your capabilities and connect directly with
          decision‑makers.
        </p>
      </li>
      <li>
        <strong className="text-[#f2f827]">Build a Strong Global Brand</strong>
        <p className="mt-2">
          Invest in B2B marketing and create a professional, engaging online presence. Share your
          success stories, certifications, and unique selling points through targeted content.
          Participate in international trade fairs and industry events to increase visibility and
          credibility.
        </p>
      </li>
      <li>
        <strong className="text-[#f2f827]">Foster Long-Term Relationships</strong>
        <p className="mt-2">
          Trust is built over time. Be transparent in your communications, offer stable pricing,
          and provide exceptional customer service. Collaborate on product development and stay
          proactive in addressing buyer needs. Long‑term partnerships yield consistent business
          and growth.
        </p>
      </li>
      <li>
        <strong className="text-[#f2f827]">Stay Ahead of Regulatory and Market Trends</strong>
        <p className="mt-2">
          Understand the latest trade policies, regulatory requirements, and market shifts.
          Proactively address compliance issues and keep your buyers informed. Being a
          knowledgeable and reliable partner makes you indispensable.
        </p>
      </li>
      <li>
        <strong className="text-[#f2f827]">Invest in Workforce Skills and Infrastructure</strong>
        <p className="mt-2">
          Highlight your skilled workforce and robust infrastructure. Continuous training and
          investment in technology not only improve productivity but also assure buyers of your
          capability to deliver at scale and quality.
        </p>
      </li>
    </ol>
    <p className="font-semibold text-[#f2f827]">
      Final Thought: Attracting top international buyers requires more than competitive pricing—it
      demands innovation, reliability, and a commitment to excellence. By focusing on these
      strategies, RMG manufacturers can position themselves as preferred partners in the global
      apparel supply chain.
    </p>
    <p className="font-semibold text-[#f2f827]">
      What strategies have worked best for your business? Share your experiences below!
    </p>
  </div>
</article>
      </div>
    </div>
  );
}

export default BlogsPage;
