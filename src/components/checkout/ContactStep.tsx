import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  formatPhone,
  isValidEmail,
  isValidPhone,
  toNationalPhone,
} from "@/lib/validators";
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
          phone: toNationalPhone(profile.whatsapp || ""),
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
  const [identifier, setIdentifier] = useState("");
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // "Sim, já tenho conta" → o step vira um mini-login: só identificador + senha.
  const isLoginMode = !isAuthenticated && accountChoice === "yes";

  // Sincroniza form se o user logar/deslogar enquanto o step está montado.
  useEffect(() => {
    if (isAuthenticated && profile) {
      reset({
        name: profile.fullName,
        email: profile.email || "",
        phone: toNationalPhone(profile.whatsapp || ""),
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
    setIdentifier("");
    setIdentifierError(null);
    setPassword("");
    setPasswordError(null);
    setAuthError(null);
  };

  // Login inline no modo "já tenho conta". Depois de logar, se os dados da
  // conta já completam o contato, avança o step direto; se faltar algo
  // (ex.: conta sem email), o step re-renderiza logado com o campo editável.
  const doLogin = async () => {
    setAuthError(null);
    setIdentifierError(null);
    setPasswordError(null);

    const raw = identifier.trim();
    if (!raw) {
      setIdentifierError("Informe seu WhatsApp ou email");
      return;
    }
    const looksLikeEmail = raw.includes("@");
    if (looksLikeEmail && !isValidEmail(raw)) {
      setIdentifierError("Email inválido");
      return;
    }
    const idValue = looksLikeEmail ? raw : raw.replace(/\D/g, "");
    if (!looksLikeEmail && (idValue.length < 10 || idValue.length > 13)) {
      setIdentifierError("WhatsApp inválido");
      return;
    }
    if (!password) {
      setPasswordError("Informe sua senha");
      return;
    }

    setIsAuthLoading(true);
    try {
      const tokens = await loginCustomer({ identifier: idValue, password });
      persistAuth(tokens);
      const candidate: ContactFormData = {
        name: tokens.user.fullName,
        email: tokens.user.email ?? "",
        phone: toNationalPhone(tokens.user.whatsapp ?? ""),
        wantsWhatsAppUpdates: getValues("wantsWhatsAppUpdates") ?? false,
      };
      const parsed = contactSchema.safeParse(candidate);
      if (parsed.success) {
        onSubmit(parsed.data);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setAuthError(
          "Credenciais inválidas. Esqueceu a senha? Fale com a loja por WhatsApp."
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
  };

  const submitFlow = async (formData: ContactFormData) => {
    setAuthError(null);
    setPasswordError(null);

    // 1. Já logado → segue direto.
    if (isAuthenticated) {
      onSubmit(formData);
      return;
    }

    // 2. "Sim, já tenho conta" é tratado fora daqui (isLoginMode → doLogin).

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
    // Campo com dado válido da conta fica travado; faltante/inválido
    // (ex.: conta criada só com whatsapp) fica editável pra não bloquear.
    const emailLocked = !!profile.email && isValidEmail(profile.email);
    const phoneLocked = isValidPhone(toNationalPhone(profile.whatsapp || ""));
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
                {toNationalPhone(profile.whatsapp)}
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
            {errors.name && (
              <p className="mt-1 text-sm text-destructive font-body">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label className="text-foreground font-body">
              Email{emailLocked ? "" : " *"}
            </Label>
            <Input
              type="email"
              {...register("email")}
              readOnly={emailLocked}
              placeholder="seu@email.com"
              className={
                emailLocked
                  ? "mt-2 bg-secondary border-border cursor-not-allowed"
                  : "mt-2 bg-secondary border-border"
              }
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive font-body">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label className="text-foreground font-body">
              WhatsApp{phoneLocked ? "" : " *"}
            </Label>
            <Input
              type="tel"
              {...register("phone")}
              onChange={handlePhoneChange}
              readOnly={phoneLocked}
              placeholder="(11) 99999-9999"
              maxLength={15}
              className={
                phoneLocked
                  ? "mt-2 bg-secondary border-border cursor-not-allowed"
                  : "mt-2 bg-secondary border-border"
              }
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-destructive font-body">
                {errors.phone.message}
              </p>
            )}
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
    <form
      onSubmit={
        isLoginMode
          ? (e) => {
              e.preventDefault();
              void doLogin();
            }
          : handleSubmit(submitFlow)
      }
      className="space-y-6"
    >
      {!isLoginMode && (
        <>
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
        </>
      )}

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
              setIdentifier("");
              setIdentifierError(null);
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
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="login-identifier"
                className="text-foreground font-body"
              >
                WhatsApp ou Email *
              </Label>
              <Input
                id="login-identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="mt-2 bg-secondary border-border"
                placeholder="seu@email.com ou (11) 99999-9999"
                autoComplete="username"
              />
              {identifierError && (
                <p className="mt-1 text-sm text-destructive font-body">
                  {identifierError}
                </p>
              )}
            </div>
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
