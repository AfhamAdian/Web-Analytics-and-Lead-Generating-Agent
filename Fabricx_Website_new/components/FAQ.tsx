"use client";

import { Button } from "flowbite-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import RequestDemoForm from "./RequestDemoForm";

const faqs = [
  {
    question: "What is fabricXai?",
    answer:
      "fabricXai is an end-to-end AI-powered platform designed for garment exporters, buying houses, and apparel brands. It automates buyer lead generation, provides CRM & LinkedIn monitoring, manages production and supply chain, and offers a multilingual chatbot to streamline communication and close deals faster.",
  },
  {
    question: "How does your CRM & LinkedIn monitoring work?",
    answer:
      "fabricXai's CRM integrates with social platforms like LinkedIn, automatically fetching potential buyers based on your garment exporter profile. AI algorithms then score each lead's relevancy, allowing you to prioritize outreach. You can see real-time updates in the dashboard and set automated nurturing sequences.",
  },
  {
    question: "What languages does the chatbot support?",
    answer:
      "Our chatbot supports 40+ languages, including Bangla, Spanish, French, Chinese, and more. It can accept both text and voice inputs, translating them on-the-fly to ensure seamless communication with global buyers.",
  },
  {
    question: "How do I join the Beta Program?",
    answer:
      "Simply click 'Join Our Beta Program' on the main page or sign up in the dedicated Beta section. You'll provide your name, email, and a bit about your company. Our team will then confirm your spot and guide you through onboarding.",
  },
  {
    question: "What are the benefits of joining the Beta Program?",
    answer:
      "As a beta participant, you receive: 60% off your subscription for the first 6 months, free employee training to get started quickly, a tailored solution for your specific garment/fashion industry niche, and early access to new features and direct feedback loops with our development team.",
  },
  {
    question: "Is my data secure with fabricXai?",
    answer:
      "Absolutely. We use enterprise-grade encryption for data in transit and at rest. We also follow GDPR and other industry regulations. Your sensitive buyer data, financial information, and production metrics are fully protected.",
  },
  {
    question:
      "Can I integrate fabricXai with existing ERP or accounting software?",
    answer:
      "Yes. fabricXai offers API-based integrations with popular ERPs, CRMs, and accounting tools. Our integration team can help you seamlessly connect FabricxAi to your existing systems for a unified workflow.",
  },
  {
    question: "Do I need technical expertise to use fabricXai?",
    answer:
      "No. fabricXai is designed for user-friendliness. From lead creation to monitoring production schedules, everything is accessible via our intuitive web dashboard or chatbot. Plus, during the beta, we provide comprehensive training to ensure your team is comfortable with the platform.",
  },
  {
    question: "How does fabricXai handle buyer sentiment and retention alerts?",
    answer:
      "Our AI engine analyzes communications, emails, chat transcripts, and more to detect changes in sentiment. If it senses a risk of losing a buyer or sees negative feedback, it automatically sends an alert and suggests action items (e.g., follow-up call, special discounts) to keep that buyer engaged.",
  },
  {
    question: "What happens after the Beta Program ends?",
    answer:
      "Once the beta period finishes, your account transitions into our standard subscription model. The 60% discount remains active for the first 6 months of usage, after which normal pricing applies. We'll send reminders and offer options to upgrade your plan or continue with existing features.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className="bg-[#13191d] text-white py-16 px-4 sm:px-8 lg:px-16 rounded-2xl" id="faqs">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-4xl font-mono font-bold text-center mb-10">
          FAQs
        </h2>

        {/* Bordered Box with Padding */}
        <div className="border-4 border-[#ffffff] rounded-xl p-4 sm:p-6 lg:p-8 bg-transparent">
          <div className="divide-y divide-gray-700">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index}>
                  <button
                    onClick={() => toggleIndex(index)}
                    className="w-full text-left py-4 flex justify-between items-center hover:bg-[#22282d] transition"
                  >
                    <span className="text-base sm:text-lg font-medium">
                      {faq.question}
                    </span>
                    <span
                      className={`text-xl transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    >
                      ^
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-96 pb-4" : "max-h-0"
                      }`}
                  >
                    <p className="text-sm sm:text-base text-gray-300 pr-2">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* CTA Section with Gradient Border */}
      <div className="mt-10 flex justify-center">
        <div className="w-full max-w-4xl p-[1px] rounded-xl bg-gradient-to-b from-[#242a30] to-white">
          <div className="bg-[#242a30] rounded-xl px-6 py-6 sm:px-10 sm:py-8 text-white">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
              {/* Left Column */}
              <div className="flex-[2] text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-[#f2f827]">
                  Ready to Transform Your Operations?
                </h3>
                <p className="text-sm sm:text-base text-[#d1d5db] mt-2">
                  Get a personalized demo of fabricXai for your factory.
                </p>
              </div>

              {/* Right Column */}
              <div className="flex-[1] w-full sm:w-auto flex justify-start sm:justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <div>
                      <Button>
                        Schedule a Demo
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
