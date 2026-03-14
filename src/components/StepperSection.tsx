import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Users, Smartphone, Download, Lock } from "lucide-react";

const STEPS = [
  {
    number: 1,
    title: "Entre no grupo de testadores",
    description:
      "Acesse o Google Groups e entre no grupo oficial de testadores do FitBody Pro.",
    buttonText: "Entrar no grupo de testadores",
    link: "https://groups.google.com/g/fitbody-pro-testers",
    icon: Users,
  },
  {
    number: 2,
    title: "Ative o acesso ao app",
    description:
      "Após entrar no grupo, ative o teste do aplicativo na Google Play Store. O aplicativo ficará disponível em até 24 horas.",
    buttonText: "Ativar acesso ao app na Play Store",
    // https://play.google.com/store/apps/details?id=com.twinex.fitbodypro
    link: "https://play.google.com/apps/testing/com.twinex.fitbodypro",
    icon: Smartphone,
  },
];

const StepperSection = forwardRef<HTMLElement>((_, ref) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepClick = (stepNumber: number, link: string) => {
    window.open(link, "_blank");
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps((prev) => [...prev, stepNumber]);
    }
  };

  const isStepLocked = (stepNumber: number) => {
    if (stepNumber === 1) return false;
    return !completedSteps.includes(stepNumber - 1);
  };

  const isStepComplete = (stepNumber: number) =>
    completedSteps.includes(stepNumber);

  const allComplete = completedSteps.length === STEPS.length;

  return (
    <section ref={ref} className="py-20 px-4" id="stepper">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Como <span className="text-gradient-primary">funciona</span>
          </h2>
          <p className="text-muted-foreground">
            Siga os passos abaixo para se tornar um testador oficial.
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="relative mb-12">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, hsl(190 90% 50%), hsl(100 80% 55%))",
              }}
              animate={{
                width: `${(completedSteps.length / STEPS.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {completedSteps.length} de {STEPS.length} etapas concluídas
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {STEPS.map((step) => {
            const locked = isStepLocked(step.number);
            const complete = isStepComplete(step.number);
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.number * 0.1 }}
                className={`relative rounded-2xl border p-6 transition-all duration-300 ${
                  complete
                    ? "border-accent/40 bg-accent/5"
                    : locked
                      ? "border-border/50 bg-card/50 opacity-60"
                      : "border-primary/30 bg-card"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step indicator */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg transition-all ${
                      complete
                        ? "bg-accent text-accent-foreground glow-accent"
                        : locked
                          ? "bg-secondary text-muted-foreground"
                          : "bg-primary/20 text-primary"
                    }`}
                  >
                    {complete ? (
                      <Check className="w-6 h-6" />
                    ) : locked ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Etapa {step.number}
                      </span>
                      {complete && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium"
                        >
                          Concluída ✓
                        </motion.span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {step.description}
                    </p>

                    {!complete && (
                      <motion.button
                        whileHover={!locked ? { scale: 1.02 } : {}}
                        whileTap={!locked ? { scale: 0.98 } : {}}
                        onClick={() =>
                          !locked && handleStepClick(step.number, step.link)
                        }
                        disabled={locked}
                        className={`w-full sm:w-auto px-6 py-3 rounded-xl font-display font-semibold text-sm transition-all ${
                          locked
                            ? "bg-secondary text-muted-foreground cursor-not-allowed"
                            : "bg-primary text-primary-foreground glow-primary hover:brightness-110"
                        }`}
                      >
                        {locked ? (
                          <span className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Complete a etapa anterior
                          </span>
                        ) : (
                          step.buttonText
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Success message */}
        <AnimatePresence>
          {allComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mt-8 rounded-2xl border border-accent/40 bg-accent/10 p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto mb-4"
              >
                <a
                  href="https://play.google.com/store/apps/details?id=com.twinex.fitbodypro&hl=pt-Br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  <Download className="w-8 h-8" />
                </a>
              </motion.div>
              <h3 className="font-display text-2xl font-bold mb-2">
                🎉 Tudo pronto!
              </h3>
              <p className="text-muted-foreground">
                Agora você pode instalar o FitBody Pro pela Google Play Store. O
                app estará disponível em <b>algumas horas</b>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});

StepperSection.displayName = "StepperSection";

export default StepperSection;
