import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

const paymentSchema = z.object({
  method: z.enum(["pix", "card"]),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCVC: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentStepProps {
  data?: PaymentFormData;
  onSubmit: (data: PaymentFormData) => void;
}

const paymentMethods = [
  {
    id: "pix",
    label: "PIX",
    description: "Aprovação imediata",
    icon: QrCode,
  },
  {
    id: "card",
    label: "Cartão de Crédito",
    description: "Parcelamento em até 12x",
    icon: CreditCard,
  },
];

export const PaymentStep = ({ data, onSubmit }: PaymentStepProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: data || {
      method: "pix",
    },
  });

  const paymentMethod = watch("method");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Payment Method */}
      <div>
        <Label className="text-foreground font-body mb-4 block">
          Método de Pagamento *
        </Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) =>
            setValue("method", value as "pix" | "card")
          }
          className="space-y-3"
        >
          {paymentMethods.map((option) => {
            const Icon = option.icon;
            const isSelected = paymentMethod === option.id;

            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                )}
                onClick={() => setValue("method", option.id as "pix" | "card")}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <div className="flex-1">
                  <Label
                    htmlFor={option.id}
                    className="font-body font-semibold text-foreground cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-foreground font-body">
                    {option.description}
                  </p>
                </div>
              </div>
            );
          })}
        </RadioGroup>
        {errors.method && (
          <p className="mt-1 text-sm text-destructive font-body">
            {errors.method.message}
          </p>
        )}
      </div>

      {/* Card Details (if card selected) */}
      {paymentMethod === "card" && (
        <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
            <p className="text-xs text-yellow-600 dark:text-yellow-400 font-body">
              <strong>Aviso (MVP):</strong> Pagamento será confirmado manualmente no MVP.
            </p>
          </div>
          <div>
            <Label htmlFor="cardNumber" className="text-foreground font-body">
              Número do Cartão *
            </Label>
            <Input
              id="cardNumber"
              {...register("cardNumber")}
              className="mt-2 bg-secondary border-border"
              placeholder="0000 0000 0000 0000"
              maxLength={19}
            />
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-destructive font-body">
                {errors.cardNumber.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="cardName" className="text-foreground font-body">
              Nome no Cartão *
            </Label>
            <Input
              id="cardName"
              {...register("cardName")}
              className="mt-2 bg-secondary border-border"
              placeholder="NOME COMO ESTÁ NO CARTÃO"
            />
            {errors.cardName && (
              <p className="mt-1 text-sm text-destructive font-body">
                {errors.cardName.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cardExpiry" className="text-foreground font-body">
                Validade *
              </Label>
              <Input
                id="cardExpiry"
                {...register("cardExpiry")}
                className="mt-2 bg-secondary border-border"
                placeholder="MM/AA"
                maxLength={5}
              />
              {errors.cardExpiry && (
                <p className="mt-1 text-sm text-destructive font-body">
                  {errors.cardExpiry.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cardCVC" className="text-foreground font-body">
                CVV *
              </Label>
              <Input
                id="cardCVC"
                {...register("cardCVC")}
                className="mt-2 bg-secondary border-border"
                placeholder="123"
                maxLength={4}
              />
              {errors.cardCVC && (
                <p className="mt-1 text-sm text-destructive font-body">
                  {errors.cardCVC.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <button type="submit" className="hidden" />
    </form>
  );
};
