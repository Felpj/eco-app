import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPhone, isValidEmail, isValidPhone } from "@/lib/validators";
import { useAuthStore } from "@/store/auth.store";
import {
  ApiError,
  loginCustomer,
  signupCustomer,
  type AuthTokens,
} from "@/lib/api";
import { UserCheck } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().refine(isValidEmail, "Email inválido"),
  phone: z.string().refine(isValidPhone, "Telefone inválido"),
  wantsWhatsAppUpdates: z.boolean().default(false),
});

export type ContactFormData = z.infer<typeof contactSchema>;

interface ContactStepProps {
  data?: ContactFormData;
  onSubmit: (data: ContactFormData) => void;
}

type AccountChoice = "yes" | "no" | null;

const FORGOT_PASSWORD_URL =
  "https://wa.me/5518996718769?text=" +
  encodeURIComponent("Esqueci minha senha do ESSENCE Árabe");

function persistAuth(tokens: AuthTokens) {
  const { user, accessToken, refreshToken } = tokens;
  useAuthStore.getState().login({
    profile: {
      id: user.id,
      fullName: user.fullName,
      email: user.email ?? undefined,
      whatsapp: user.whatsapp ?? "",
      createdAt: user.createdAt,
      updatedAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  });
}

export const ContactStep = ({ data, onSubmit }: ContactStepProps) => {
  const profile = useAuthStore((s) => s.profile);
  const isAuthenticated = useAuthStore((s) => s.session.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  // Pré-preenche com dados do user logado se aplicável.
  const initialDefaults: ContactFormData =
    data ||
    (isAuthenticated && profile
      ? {
          name: profile.fullName,
          email: profile.email || "",
          phone: profile.whatsapp || "",
          wantsWhatsAppUpdates: false,
        }
      : {
          name: "",
          email: "",
          phone: "",
          wantsWhatsAppUpdates: false,
        });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialDefaults,
  });

  const wantsUpdates = watch("wantsWhatsAppUpdates");

  // Estado interno auth
  const [accountChoice, setAccountChoice] = useState<AccountChoice>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Sincroniza form se o user logar/deslogar enquanto o step está montado.
  useEffect(() => {
    if (isAuthenticated && profile) {
      reset({
        name: profile.fullName,
        email: profile.email || "",
        phone: profile.whatsapp || "",
        wantsWhatsAppUpdates: getValues("wantsWhatsAppUpdates") ?? false,
      });
      setAccountChoice(null);
      setPassword("");
      setPasswordError(null);
      setAuthError(null);
    }
  }, [isAuthenticated, profile, reset, getValues]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue("phone", formatted, { shouldValidate: true });
  };

  const handleNotMe = () => {
    logout();
    reset({
      name: "",
      email: "",
      phone: "",
      wantsWhatsAppUpdates: false,
    });
    setAccountChoice(null);
    setPassword("");
    setPasswordError(null);
    setAuthError(null);
  };

  const submitFlow = async (formData: ContactFormData) => {
    setAuthError(null);
    setPasswordError(null);

    // 1. Já logado → segue direto.
    if (isAuthenticated) {
      onSubmit(formData);
      return;
    }

    // 2. "Sim, já tenho conta"
    if (accountChoice === "yes") {
      if (!password) {
        setPasswordError("Informe sua senha");
        return;
      }
      setIsAuthLoading(true);
      try {
        const identifier = formData.email || formData.phone.replace(/\D/g, "");
        const tokens = await loginCustomer({ identifier, password });
        persistAuth(tokens);
        onSubmit(formData);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          setAuthError(
            "Senha incorreta. Esqueceu? Fale com a loja por WhatsApp."
          );
        } else {
          setAuthError(
            err instanceof ApiError && err.message
              ? err.message
              : "Não foi possível entrar. Tente novamente."
          );
        }
      } finally {
        setIsAuthLoading(false);
      }
      return;
    }

    // 3. "Não tenho conta" + senha preenchida → signup
    if (accountChoice === "no" && password) {
      if (password.length < 8) {
        setPasswordError("Senha deve ter pelo menos 8 caracteres");
        return;
      }
      setIsAuthLoading(true);
      try {
        const tokens = await signupCustomer({
          fullName: formData.name,
          email: formData.email || undefined,
          whatsapp: formData.phone.replace(/\D/g, ""),
          password,
          type: "CUSTOMER",
        });
        persistAuth(tokens);
        onSubmit(formData);
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          setAuthError(
            "Já existe conta com esse contato. Mude pra 'Sim, já tenho conta'."
          );
        } else {
          setAuthError(
            err instanceof ApiError && err.message
              ? err.message
              : "Não foi possível criar a conta. Tente novamente."
          );
        }
      } finally {
        setIsAuthLoading(false);
      }
      return;
    }

    // 4. Guest checkout: sem radio escolhida, ou "no" sem senha.
    onSubmit(formData);
  };

  // ─────────────── Bypass: usuário já logado ───────────────
  if (isAuthenticated && profile) {
    return (
      <form onSubmit={handleSubmit(submitFlow)} className="space-y-6">
        <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 flex items-start gap-3">
          <UserCheck className="w-5 h-5 text-gold mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body text-foreground">
              Logado como{" "}
              <span className="font-semibold">{profile.fullName}</span>
            </p>
            {profile.email && (
              <p className="text-xs font-body text-muted-foreground truncate">
                {profile.email}
              </p>
            )}
            {profile.whatsapp && (
              <p className="text-xs font-body text-muted-foreground">
                {profile.whatsapp}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleNotMe}
            className="text-xs font-body text-muted-foreground hover:text-gold underline underline-offset-2"
          >
            Não sou eu, trocar
          </button>
        </div>

        <div className="space-y-4 opacity-90">
          <div>
            <Label className="text-foreground font-body">Nome completo</Label>
            <Input
              {...register("name")}
              readOnly
              className="mt-2 bg-secondary border-border cursor-not-allowed"
            />
          </div>
          <div>
            <Label className="text-foreground font-body">Email</Label>
            <Input
              {...register("email")}
              readOnly
              className="mt-2 bg-secondary border-border cursor-not-allowed"
            />
          </div>
          <div>
            <Label className="text-foreground font-body">WhatsApp</Label>
            <Input
              {...register("phone")}
              readOnly
              className="mt-2 bg-secondary border-border cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="whatsapp-updates"
              checked={wantsUpdates}
              onCheckedChange={(checked) =>
                setValue("wantsWhatsAppUpdates", checked === true)
              }
            />
            <Label
              htmlFor="whatsapp-updates"
              className="text-sm text-foreground font-body cursor-pointer"
            >
              Quero receber atualizações no WhatsApp
            </Label>
          </div>
          <p className="text-xs text-muted-foreground font-body ml-6">
            Vamos enviar atualizações do pedido por WhatsApp
          </p>
        </div>

        <button type="submit" className="hidden" />
      </form>
    );
  }

  // ─────────────── Form padrão (não logado) ───────────────
  return (
    <form onSubmit={handleSubmit(submitFlow)} className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-foreground font-body">
          Nome completo *
        </Label>
        <Input
          id="name"
          {...register("name")}
          className="mt-2 bg-secondary border-border"
          placeholder="Seu nome completo"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-destructive font-body">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="text-foreground font-body">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className="mt-2 bg-secondary border-border"
          placeholder="seu@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive font-body">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="phone" className="text-foreground font-body">
          WhatsApp *
        </Label>
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          onChange={handlePhoneChange}
          className="mt-2 bg-secondary border-border"
          placeholder="(11) 99999-9999"
          maxLength={15}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-destructive font-body">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="whatsapp-updates"
            checked={wantsUpdates}
            onCheckedChange={(checked) =>
              setValue("wantsWhatsAppUpdates", checked === true)
            }
          />
          <Label
            htmlFor="whatsapp-updates"
            className="text-sm text-foreground font-body cursor-pointer"
          >
            Quero receber atualizações no WhatsApp
          </Label>
        </div>
        <p className="text-xs text-muted-foreground font-body ml-6">
          Vamos enviar atualizações do pedido por WhatsApp
        </p>
      </div>

      {/* ───── Bloco "Já tem conta?" ───── */}
      <div className="pt-4 border-t border-[var(--glass-border)] space-y-4">
        <div>
          <Label className="text-foreground font-body text-sm">
            Já tem conta nesta loja?
          </Label>
          <RadioGroup
            value={accountChoice ?? ""}
            onValueChange={(v) => {
              setAccountChoice(v as AccountChoice);
              setPassword("");
              setPasswordError(null);
              setAuthError(null);
            }}
            className="mt-3 flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="account-yes" />
              <Label
                htmlFor="account-yes"
                className="text-sm font-body cursor-pointer text-foreground"
              >
                Sim, já tenho
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="account-no" />
              <Label
                htmlFor="account-no"
                className="text-sm font-body cursor-pointer text-foreground"
              >
                Não tenho
              </Label>
            </div>
          </RadioGroup>
        </div>

        {accountChoice === "yes" && (
          <div>
            <Label
              htmlFor="password-login"
              className="text-foreground font-body"
            >
              Senha *
            </Label>
            <Input
              id="password-login"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 bg-secondary border-border"
              placeholder="Sua senha"
              autoComplete="current-password"
            />
            {passwordError && (
              <p className="mt-1 text-sm text-destructive font-body">
                {passwordError}
              </p>
            )}
            <a
              href={FORGOT_PASSWORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs font-body text-muted-foreground hover:text-gold underline underline-offset-2"
            >
              Esqueci minha senha → fale por WhatsApp
            </a>
          </div>
        )}

        {accountChoice === "no" && (
          <div>
            <Label
              htmlFor="password-signup"
              className="text-foreground font-body"
            >
              Criar senha (opcional, pra acompanhar pedido depois)
            </Label>
            <Input
              id="password-signup"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 bg-secondary border-border"
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
            />
            <p className="mt-1 text-xs text-muted-foreground font-body">
              Deixe em branco pra continuar como visitante.
            </p>
            {passwordError && (
              <p className="mt-1 text-sm text-destructive font-body">
                {passwordError}
              </p>
            )}
          </div>
        )}

        {authError && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-body text-destructive">
            {authError}
          </div>
        )}

        {isAuthLoading && (
          <p className="text-xs font-body text-muted-foreground">
            Processando...
          </p>
        )}
      </div>

      <button type="submit" className="hidden" />
    </form>
  );
};
