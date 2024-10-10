import { InteractiveButton } from "@/components/InteractiveButton";
import LandingPageContent from "@/components/LandingPageContent";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-y-5">
      <InteractiveButton />
      <LandingPageContent />
    </div>
  );
}
