import { useRef, useState } from "react";
import HeroSection from "@/components/HeroSection";
import StepperSection from "@/components/StepperSection";
import BenefitsSection from "@/components/BenefitsSection";
import TutorialVideoModal from "@/components/TutorialVideoModal";

const Index = () => {
  const stepperRef = useRef<HTMLElement>(null);
  const [tutorialOpen, setTutorialOpen] = useState(true);

  const scrollToStepper = () => {
    stepperRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {tutorialOpen ? (
        <TutorialVideoModal
          open={tutorialOpen}
          onClose={() => setTutorialOpen(false)}
        />
      ) : (
        <div className="min-h-screen bg-background">
          <HeroSection onCtaClick={scrollToStepper} />
          <BenefitsSection />
          <StepperSection ref={stepperRef} />

          <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
            © 2026 Twinex Tecnologia. Todos os direitos reservados.
          </footer>
        </div>
      )}
    </>
  );
};

export default Index;
