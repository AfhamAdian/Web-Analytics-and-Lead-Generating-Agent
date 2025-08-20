import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RequestDemoForm from "./RequestDemoForm";
import { Button } from "flowbite-react";
import EarlyBirdForm from "./EarlyBirdForm";

export default function Hero() {
  return (
    <section className="w-full h-screen">
      <div className="w-full h-full bg-[url(/bg/ai-and-garments-RGM-representative-image.png)] bg-cover bg-center">
        <div className="bg-transparent border-none shadow-none flex flex-col items-start justify-center h-full px-12 md:px-24">
          <div className="flex flex-col w-full md:max-w-md gap-8">
            <div className="text-white w-full">
              <h1 className="font-mono text-4xl">
                Revolutionize <span className="font-bold">RMG Business</span>{" "}
                with <span className="font-bold">AI-Driven Intelligence</span>
              </h1>
              <p className="text-sm">
                <span className="font-bold">fabricXai</span> delivers
                cutting-edge Buyer Relationship Management & Production
                Intelligence tailored for the RGM industry.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
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

              <Dialog>
                <DialogTrigger asChild>
                  <div>
                    <Button outline>Be an Early Bird</Button>
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
      </div>
    </section>
  );
}
