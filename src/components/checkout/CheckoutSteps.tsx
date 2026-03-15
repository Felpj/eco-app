import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Step {
  id: string;
  label: string;
  number: number;
}

interface CheckoutStepsProps {
  currentStep: number;
  steps: Step[];
}

export const CheckoutSteps = ({ currentStep, steps }: CheckoutStepsProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center flex-1">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-body font-semibold text-sm border transition-all duration-300",
                  isCompleted && "bg-gradient-to-br from-gold to-gold-light border-gold/50 text-[#080808]",
                  isCurrent && "glass-gold border-gold/50 text-gold shadow-gold-sm",
                  !isCompleted && !isCurrent && "bg-[#111] border-[var(--glass-border)] text-muted-foreground/40"
                )}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 14, stiffness: 300 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <span>{step.number}</span>
                )}
              </motion.div>
              <span
                className={cn(
                  "mt-2 text-xs font-body text-center transition-colors duration-300",
                  isCurrent ? "text-gold font-semibold" : isCompleted ? "text-foreground font-semibold" : "text-muted-foreground/40"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="h-px flex-1 mx-2 bg-[var(--glass-border)] overflow-hidden rounded-full">
                <motion.div
                  className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
