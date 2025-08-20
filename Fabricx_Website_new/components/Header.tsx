"use client";

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RequestDemoForm from "./RequestDemoForm";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import SendMessageForm from "./SendMessageForm";
import { VisuallyHidden } from "radix-ui";
import { Clock, MessageSquare } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 50); // Change 50 to the desired scroll threshold
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <div
        className={cn(
          "fixed hidden left-0 top-0 z-50 h-8 w-full items-center justify-between gap-8 bg-[#13191D] text-white py-3 px-24 transition-all duration-500 text-xs",
          {
            "md:flex": !isScrolled,
          }
        )}
      >
        <div className="flex gap-4">
          <div className="flex items-center gap-2 hover:text-[#f2f827]">
            {" "}
            <Image src="/icons/mail-alt.svg" alt="Mail" width={14} height={12} />{" "}
            <a href="mailto:info@fabricxai.com">info@fabricxai.com</a>
          </div>
          <div className="flex items-center gap-2 hover:text-[#f2f827]">
            {" "}
            <Image src="/icons/phone.svg" alt="Phone" width={14} height={14} /> <a href="tel:+880 1711 253751">+880 1711 253751</a>
          </div>
          <div className="flex items-center gap-2 hover:text-[#f2f827]">
            {" "}
            <Image src="/icons/pin.svg" alt="Location" width={14} height={14} />{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.google.com/maps/search/21%2BJigatola%2BDhaka/@23.74074,90.36718,14z?hl=en&entry=ttu&g_ep=EgoyMDI1MDcxMy4wIKXMDSoASAFQAw%3D%3D"
            >
              21 Jigatola, Dhaka, Bangladesh
            </a>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
            <DialogTrigger asChild>
              <button className="hover:text-[#f2f827]">Contact</button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="w-full md:max-w-5xl"
            >
              <DialogHeader>
                <VisuallyHidden.Root asChild>
                  <DialogTitle>Enter Your Details</DialogTitle>
                </VisuallyHidden.Root>
              </DialogHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <SendMessageForm className="w-2/3" />
                <div className="flex flex-col gap-4 w-1/3">
                  <div className="flex flex-col items-start justify-between w-full h-full border border-yellow-400/50 rounded-lg px-6 py-4 gap-6">
                    <div className="flex items-center justify-start w-full gap-4">
                      <div className="flex items-center justify-center p-4 bg-[#f2f827]/20 text-[#f2f827] hover:bg-[#f2f827]/40 rounded-lg">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Live Chat</h2>
                        <p className="text-sm">Chat with our AI assistant</p>
                      </div>
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 inline-block" />
                        <p className="text-sm font-light">Instant Response</p>
                      </div>
                      <Button className="w-full" onClick={() => {
                        // Chat functionality temporarily disabled
                        setShowContactDialog(false);
                      }}>Start Chat</Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-between w-full h-full border border-yellow-400/50 rounded-lg px-6 py-4 gap-6">
                    <h2 className="font-semibold text-lg">Business Hours</h2>
                    <div className="w-full text-sm">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Monday - Friday</p>
                        <p>9:00 AM - 6:00 PM</p>
                      </div>
                      <div className="flex w-full items-center justify-between">
                        <p className="font-semibold">Saturday</p>
                        <p>10:00 AM - 4:00 PM</p>
                      </div>
                      <div className="flex items-center justify-between text-yellow-400/50">
                        <p className="font-semibold">Sunday</p>
                        <p>Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <div className="flex flex-row items-center justify-center gap-6 py-4">
            <a
              href="https://www.linkedin.com/company/fabricx-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A8B0B7] hover:text-[#f2f827]"
            >
              <Image src="/icons/linkedin.svg" alt="LinkedIn" width={16} height={16} />
            </a>
            <a
              href="https://www.facebook.com/FabricXAI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A8B0B7] hover:text-[#f2f827]"
            >
              <Image src="/icons/facebook.svg" alt="Facebook" width={16} height={16} />
            </a>
            <a
              href="https://www.youtube.com/@fabricXai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A8B0B7] hover:text-[#f2f827]"
            >
              <Image src="/icons/youtube.svg" alt="YouTube" width={16} height={20} />
            </a>
          </div>
        </div>
      </div>
      <Navbar
        fluid
        className={cn("transition-all duration-500 fixed top-0 z-50", {
          "bg-[#13191D]": isScrolled,
          "md:top-8": !isScrolled,
        })}
      >
        <NavbarBrand href="#" className="m-0 p-0">
          <div className="flex items-center justify-center h-6 sm:h-9 ">
            <Image src="/icons/fabricxai.svg" alt="FabricX AI" width={120} height={36} className="h-6 sm:h-9 w-auto" />
          </div>
        </NavbarBrand>
        <div className="flex md:order-2 gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <div>
                <Button>Get a Demo</Button>
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
          {/* 
          <Button
            className="hidden md:block"
            onClick={() => window.open("https://webx.fabricxai.com", "_blank")}>
            Get started
          </Button> */}
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="#" active>
            Home
          </NavbarLink>
          <NavbarLink href="#features">Features</NavbarLink>
          <NavbarLink href="#partners">Partners</NavbarLink>
          <NavbarLink href="#solutions">Solutions</NavbarLink>
          <NavbarLink href="#faqs">FAQs</NavbarLink>
        </NavbarCollapse>
      </Navbar>
    </>
  );
}
