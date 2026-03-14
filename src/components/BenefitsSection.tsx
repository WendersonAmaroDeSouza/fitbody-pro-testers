import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Zap } from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "Acesso antecipado",
    description: "Experimente novas funcionalidades antes do lançamento oficial.",
  },
  {
    icon: MessageSquare,
    title: "Influencie o app",
    description: "Seu feedback ajuda a moldar o futuro do FitBody Pro.",
  },
  {
    icon: Zap,
    title: "Melhorias exclusivas",
    description: "Receba atualizações e correções antes do público geral.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Por que ser um{" "}
            <span className="text-gradient-accent">testador</span>?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
