import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCEP, isValidCEP } from "@/lib/validators";
import { Truck, Package, MapPin, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/money";
import { freeShippingBar } from "@/lib/free-shipping";
import {
  getAddressByCep,
  getMyAddresses,
  createAddress,
  ApiError,
  type BackendAddress,
  type ShippingQuoteOption,
} from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
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
  quotes?: ShippingQuoteOption[] | null;
  isQuoting?: boolean;
  onCepChange?: (cep: string) => void;
  freeShippingThreshold?: number | null;
  amountToFreeShipping?: number | null;
}

// Labels/ícones fixos; preço real vem da quote (fallback = flat do server).
const shippingOptions = [
  {
    id: "express" as const,
    quoteId: "EXPRESS_24H" as const,
    label: "Expresso 24/48h",
    description: "Entrega rápida em até 48 horas",
    fallbackPrice: 15,
    icon: Truck,
  },
  {
    id: "normal" as const,
    quoteId: "STANDARD" as const,
    label: "Normal",
    description: "Entrega em 5 a 7 dias úteis",
    fallbackPrice: 10,
    icon: Package,
  },
];

export const ShippingStep = ({
  data,
  onSubmit,
  quotes,
  isQuoting,
  onCepChange,
  freeShippingThreshold,
  amountToFreeShipping,
}: ShippingStepProps) => {
  const isAuthenticated = useAuthStore((s) => s.session.isAuthenticated);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);

  // Address book (só logado): lista da conta + seleção.
  const [savedAddresses, setSavedAddresses] = useState<BackendAddress[] | null>(
    null,
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [saveNewAddress, setSaveNewAddress] = useState(true);

  const freeBar = freeShippingBar(
    freeShippingThreshold ?? null,
    amountToFreeShipping ?? null,
  );

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

  const applyAddress = (a: BackendAddress) => {
    setSelectedAddressId(a.id);
    setValue("cep", formatCEP(a.cep), { shouldValidate: true });
    setValue("address", a.street, { shouldValidate: true });
    setValue("number", a.number, { shouldValidate: true });
    setValue("complement", a.complement ?? "", { shouldValidate: true });
    setValue("neighborhood", a.neighborhood, { shouldValidate: true });
    setValue("city", a.city, { shouldValidate: true });
    setValue("state", a.state.toUpperCase(), { shouldValidate: true });
    onCepChange?.(a.cep.replace(/\D/g, ""));
  };

  const startNewAddress = () => {
    setSelectedAddressId("new");
    setValue("cep", "");
    setValue("address", "");
    setValue("number", "");
    setValue("complement", "");
    setValue("neighborhood", "");
    setValue("city", "");
    setValue("state", "");
  };

  // Dispara a quote pro CEP que veio do draft (o effect do Checkout só reage
  // ao que a gente avisar por aqui).
  useEffect(() => {
    const digits = (data?.cep ?? "").replace(/\D/g, "");
    if (digits.length === 8) onCepChange?.(digits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carrega endereços salvos da conta; pré-seleciona o padrão se o form está vazio.
  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    getMyAddresses()
      .then((list) => {
        if (!active) return;
        setSavedAddresses(list);
        if (!data && list.length > 0) {
          const def = list.find((a) => a.isDefault) ?? list[0];
          applyAddress(def);
        }
      })
      .catch(() => {
        if (active) setSavedAddresses([]);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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
      onCepChange?.(digits);
      void handleSearchCEP(digits);
    }
  };

  // Salva endereço novo na conta (best-effort: falha nunca trava o checkout).
  const submitWithSave = (values: ShippingFormData) => {
    if (isAuthenticated && selectedAddressId === "new" && saveNewAddress) {
      const cepDigits = values.cep.replace(/\D/g, "");
      const isDuplicate = (savedAddresses ?? []).some(
        (a) =>
          a.cep.replace(/\D/g, "") === cepDigits &&
          a.street.trim().toLowerCase() === values.address.trim().toLowerCase() &&
          a.number.trim() === values.number.trim(),
      );
      if (!isDuplicate) {
        // label é enum no back (Casa|Trabalho|Outro)
        void createAddress({
          label: (savedAddresses ?? []).length === 0 ? "Casa" : "Outro",
          cep: cepDigits,
          street: values.address,
          number: values.number,
          complement: values.complement || undefined,
          neighborhood: values.neighborhood,
          city: values.city,
          state: values.state.toUpperCase(),
          isDefault: (savedAddresses ?? []).length === 0,
        }).catch(() => {});
      }
    }
    onSubmit(values);
  };

  const isNewAddress = selectedAddressId === "new";
  const hasSaved = (savedAddresses?.length ?? 0) > 0;

  return (
    <form onSubmit={handleSubmit(submitWithSave)} className="space-y-6">
      {/* Endereços salvos da conta */}
      {hasSaved && (
        <div>
          <Label className="text-foreground font-body mb-3 block">
            Endereço de entrega *
          </Label>
          <div className="space-y-3">
            {savedAddresses!.map((a) => {
              const isSelected = selectedAddressId === a.id;
              return (
                <div
                  key={a.id}
                  onClick={() => applyAddress(a)}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50",
                  )}
                >
                  <MapPin
                    className={cn(
                      "w-5 h-5 mt-0.5 shrink-0",
                      isSelected ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-body font-semibold text-foreground truncate">
                        {a.label}
                      </p>
                      {a.isDefault && (
                        <span className="text-[10px] uppercase tracking-wide font-body px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                          Padrão
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-body truncate">
                      {a.street}, {a.number}
                      {a.complement ? ` - ${a.complement}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground font-body">
                      {a.neighborhood}, {a.city} - {a.state} · CEP {formatCEP(a.cep)}
                    </p>
                  </div>
                </div>
              );
            })}

            <div
              onClick={startNewAddress}
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                isNewAddress
                  ? "border-primary bg-primary/10"
                  : "border-dashed border-border bg-card hover:border-primary/50",
              )}
            >
              <Plus
                className={cn(
                  "w-5 h-5",
                  isNewAddress ? "text-primary" : "text-muted-foreground",
                )}
              />
              <p className="font-body font-semibold text-foreground">
                Usar outro endereço
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form de endereço (novo, ou visitante) */}
      {(isNewAddress || !hasSaved) && (
        <>
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

          {isAuthenticated && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-address"
                checked={saveNewAddress}
                onCheckedChange={(checked) => setSaveNewAddress(checked === true)}
              />
              <Label
                htmlFor="save-address"
                className="text-sm text-foreground font-body cursor-pointer"
              >
                Salvar este endereço pra próximas compras
              </Label>
            </div>
          )}
        </>
      )}

      {/* Barra de frete grátis (só quando a loja oferece e a quote já veio) */}
      {freeBar && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          {freeBar.reached ? (
            <p className="text-sm font-body font-semibold text-primary">
              🎉 Você ganhou frete grátis!
            </p>
          ) : (
            <p className="text-sm font-body text-foreground">
              Faltam <strong>{formatMoney(freeBar.remaining)}</strong> pra ganhar
              frete grátis
            </p>
          )}
          <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.round(freeBar.progress * 100)}%` }}
            />
          </div>
        </div>
      )}

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
            const quote = quotes?.find((q) => q.id === option.quoteId);
            const price = quote?.price ?? option.fallbackPrice;

            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                )}
                onClick={() => setValue("shippingMethod", option.id)}
              >
                <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <Label
                      htmlFor={option.id}
                      className="font-body font-semibold text-foreground cursor-pointer"
                    >
                      {quote?.label ?? option.label}
                    </Label>
                    <span className="text-primary font-body font-bold">
                      {isQuoting
                        ? "..."
                        : price === 0
                          ? "Grátis"
                          : formatMoney(price)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-body">
                    {quote?.estimatedDays ?? option.description}
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
        {isQuoting && (
          <p className="mt-2 text-xs text-muted-foreground font-body">
            Calculando frete pro seu CEP...
          </p>
        )}
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
