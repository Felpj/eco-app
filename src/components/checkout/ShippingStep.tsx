import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCEP, isValidCEP } from "@/lib/validators";
import { Truck, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAddressByCep, ApiError } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const shippingSchema = z.object({
  cep: z.string().refine(isValidCEP, "CEP inválido"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  shippingMethod: z.enum(["express", "normal"]),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingStepProps {
  data?: ShippingFormData;
  onSubmit: (data: ShippingFormData) => void;
}

const shippingOptions = [
  {
    id: "express",
    label: "Expresso 24/48h",
    description: "Entrega rápida em até 48 horas",
    price: 15,
    icon: Truck,
  },
  {
    id: "normal",
    label: "Normal",
    description: "Entrega em 5 a 7 dias úteis",
    price: 10,
    icon: Package,
  },
];

export const ShippingStep = ({ data, onSubmit }: ShippingStepProps) => {
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: data || {
      cep: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      shippingMethod: "express",
    },
  });

  const shippingMethod = watch("shippingMethod");

  const handleSearchCEP = async (rawCep?: string) => {
    const cep = (rawCep ?? watch("cep") ?? "").replace(/\D/g, "");
    if (cep.length !== 8) return;

    setIsLoadingCEP(true);
    try {
      const addr = await getAddressByCep(cep);
      setValue("address", addr.street || "", { shouldValidate: true });
      setValue("neighborhood", addr.neighborhood || "", { shouldValidate: true });
      setValue("city", addr.city || "", { shouldValidate: true });
      setValue("state", (addr.state || "").toUpperCase(), { shouldValidate: true });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.status === 404
            ? "CEP não encontrado"
            : err.message
          : "Não foi possível buscar o CEP.";
      toast({ title: "CEP inválido", description: message, variant: "destructive" });
    } finally {
      setIsLoadingCEP(false);
    }
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setValue("cep", formatted, { shouldValidate: true });
    const digits = formatted.replace(/\D/g, "");
    if (digits.length === 8) {
      void handleSearchCEP(digits);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* CEP Search */}
      <div>
        <Label htmlFor="cep" className="text-foreground font-body">
          CEP *
        </Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="cep"
            type="tel"
            {...register("cep")}
            onChange={handleCEPChange}
            className="flex-1 bg-secondary border-border"
            placeholder="00000-000"
            maxLength={9}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSearchCEP()}
            disabled={isLoadingCEP}
          >
            {isLoadingCEP ? "Buscando..." : "Buscar"}
          </Button>
        </div>
        {errors.cep && (
          <p className="mt-1 text-sm text-destructive font-body">
            {errors.cep.message}
          </p>
        )}
      </div>

      {/* Address Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="address" className="text-foreground font-body">
            Endereço *
          </Label>
          <Input
            id="address"
            {...register("address")}
            className="mt-2 bg-secondary border-border"
            placeholder="Rua, Avenida, etc."
          />
          {errors.address && (
            <p className="mt-1 text-sm text-destructive font-body">
              {errors.address.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="number" className="text-foreground font-body">
            Número *
          </Label>
          <Input
            id="number"
            {...register("number")}
            className="mt-2 bg-secondary border-border"
            placeholder="123"
          />
          {errors.number && (
            <p className="mt-1 text-sm text-destructive font-body">
              {errors.number.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="complement" className="text-foreground font-body">
            Complemento
          </Label>
          <Input
            id="complement"
            {...register("complement")}
            className="mt-2 bg-secondary border-border"
            placeholder="Apto, Bloco, etc."
          />
        </div>

        <div>
          <Label htmlFor="neighborhood" className="text-foreground font-body">
            Bairro *
          </Label>
          <Input
            id="neighborhood"
            {...register("neighborhood")}
            className="mt-2 bg-secondary border-border"
            placeholder="Bairro"
          />
          {errors.neighborhood && (
            <p className="mt-1 text-sm text-destructive font-body">
              {errors.neighborhood.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="city" className="text-foreground font-body">
            Cidade *
          </Label>
          <Input
            id="city"
            {...register("city")}
            className="mt-2 bg-secondary border-border"
            placeholder="Cidade"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-destructive font-body">
              {errors.city.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="state" className="text-foreground font-body">
            Estado *
          </Label>
          <Input
            id="state"
            {...register("state")}
            className="mt-2 bg-secondary border-border uppercase"
            placeholder="SP"
            maxLength={2}
          />
          {errors.state && (
            <p className="mt-1 text-sm text-destructive font-body">
              {errors.state.message}
            </p>
          )}
        </div>
      </div>

      {/* Shipping Method */}
      <div>
        <Label className="text-foreground font-body mb-4 block">
          Método de Entrega *
        </Label>
        <RadioGroup
          value={shippingMethod}
          onValueChange={(value) =>
            setValue("shippingMethod", value as "express" | "normal")
          }
          className="space-y-3"
        >
          {shippingOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = shippingMethod === option.id;

            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                )}
                onClick={() => setValue("shippingMethod", option.id as "express" | "normal")}
              >
                <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <Label
                      htmlFor={option.id}
                      className="font-body font-semibold text-foreground cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    <span className="text-primary font-body font-bold">
                      R$ {option.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-body">
                    {option.description}
                  </p>
                </div>
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>
            );
          })}
        </RadioGroup>
        {errors.shippingMethod && (
          <p className="mt-1 text-sm text-destructive font-body">
            {errors.shippingMethod.message}
          </p>
        )}
      </div>

      <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
        <p className="text-sm text-foreground font-body">
          <strong>Observação:</strong> Envio em até 24h após confirmação do
          pagamento.
        </p>
      </div>

      <button type="submit" className="hidden" />
    </form>
  );
};
