import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Lock, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  getCustomerMe,
  updateCustomerMe,
  changePassword,
  ApiError,
  type CustomerMe,
} from "@/lib/api";
import { handleAuthError } from "@/lib/auth-guard";
import { useAuthStore } from "@/store/auth.store";
import { formatPhone, isValidEmail, isValidPhone } from "@/lib/validators";

const categoryOptions = [
  "Doce",
  "Amadeirado",
  "Fresco",
  "Árabe intenso",
  "Floral",
  "Citrico",
  "Oriental",
];

const Preferences = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateProfile } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState<CustomerMe | null>(null);

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Profile preferences (notificações + categorias)
  const [receiveWhatsAppUpdates, setReceiveWhatsAppUpdates] = useState(true);
  const [receiveEmailUpdates, setReceiveEmailUpdates] = useState(false);
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([]);

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getCustomerMe()
      .then((res) => {
        if (!active) return;
        setMe(res);
        setFullName(res.fullName || "");
        setEmail(res.email || "");
        setWhatsapp(res.whatsapp ? formatPhone(res.whatsapp) : "");
        setReceiveWhatsAppUpdates(res.profile?.receiveWhatsAppUpdates ?? true);
        setReceiveEmailUpdates(res.profile?.receiveEmailUpdates ?? false);
        setFavoriteCategories(res.profile?.favoriteCategories ?? []);
      })
      .catch((err) => {
        if (!handleAuthError(err, navigate, location.pathname)) {
          console.error("[Preferences] load failed", err);
          toast({
            title: "Erro ao carregar preferências",
            description: err instanceof Error ? err.message : "Tente novamente.",
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = (category: string) => {
    setFavoriteCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleSave = async () => {
    // Validação leve
    if (email && !isValidEmail(email)) {
      toast({
        title: "Email inválido",
        variant: "destructive",
      });
      return;
    }
    const cleanWhatsapp = whatsapp.replace(/\D/g, "");
    if (cleanWhatsapp && !isValidPhone(cleanWhatsapp)) {
      toast({
        title: "WhatsApp inválido",
        variant: "destructive",
      });
      return;
    }
    if (!fullName.trim()) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const payload: Parameters<typeof updateCustomerMe>[0] = {
        fullName: fullName.trim(),
        receiveWhatsAppUpdates,
        receiveEmailUpdates,
        favoriteCategories,
      };
      // Só envia email/whatsapp se mudaram (anti-stomp em campos null)
      if ((me?.email ?? "") !== email.trim()) payload.email = email.trim();
      if ((me?.whatsapp ?? "") !== cleanWhatsapp) payload.whatsapp = cleanWhatsapp;

      const updated = await updateCustomerMe(payload);
      setMe(updated);
      updateProfile({
        fullName: updated.fullName,
        email: updated.email ?? undefined,
        whatsapp: updated.whatsapp ?? "",
      });
      toast({
        title: "Preferências salvas!",
        description: "Suas preferências foram atualizadas com sucesso.",
      });
    } catch (err) {
      if (!handleAuthError(err, navigate, location.pathname)) {
        toast({
          title: "Erro ao salvar",
          description: err instanceof Error ? err.message : "Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError("Informe sua senha atual.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("A nova senha deve ter ao menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("A confirmação não bate com a nova senha.");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(
        `Senha alterada. Outros dispositivos foram desconectados (${res.revokedSessions} sessões revogadas).`,
      );
      toast({
        title: "Senha alterada!",
        description: `Outros dispositivos foram desconectados (${res.revokedSessions} sessões revogadas).`,
      });
    } catch (err) {
      if (handleAuthError(err, navigate, location.pathname)) return;
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setPasswordError("Senha atual incorreta.");
        } else if (err.status === 400) {
          const body = err.body as { message?: string | string[] } | null;
          const msg = Array.isArray(body?.message)
            ? body?.message.join(" ")
            : body?.message;
          setPasswordError(
            msg || "Não foi possível alterar a senha. Tente novamente.",
          );
        } else {
          setPasswordError(
            "Não foi possível alterar a senha. Tente novamente.",
          );
        }
      } else {
        setPasswordError("Não foi possível alterar a senha. Tente novamente.");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/conta"
            className="inline-flex items-center gap-2 text-muted-foreground/60 hover:text-gold
              transition-colors duration-200 mb-8 font-body text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Voltar para conta
          </Link>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            Preferências
          </h1>

          {loading ? (
            <div className="glass rounded-2xl p-8 border border-[var(--glass-border)] animate-pulse h-96" />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-2xl p-6 md:p-8 space-y-8"
            >
              {/* Dados pessoais */}
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground mb-5">
                  Dados pessoais
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                      Nome completo
                    </Label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full glass rounded-xl px-4 py-2.5 mt-1.5 text-sm font-body text-foreground
                        focus:border-gold/30 focus:ring-2 focus:ring-gold/10 focus:outline-none
                        transition-all duration-200"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                        Email
                      </Label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full glass rounded-xl px-4 py-2.5 mt-1.5 text-sm font-body text-foreground
                          placeholder:text-muted-foreground/40
                          focus:border-gold/30 focus:ring-2 focus:ring-gold/10 focus:outline-none
                          transition-all duration-200"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                        WhatsApp
                      </Label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
                        placeholder="(11) 99999-9999"
                        maxLength={15}
                        className="w-full glass rounded-xl px-4 py-2.5 mt-1.5 text-sm font-body text-foreground
                          placeholder:text-muted-foreground/40
                          focus:border-gold/30 focus:ring-2 focus:ring-gold/10 focus:outline-none
                          transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Segurança — trocar senha */}
              <div>
                <p className="text-xs text-muted-foreground/60 font-body uppercase tracking-[0.18em] mb-2">
                  Segurança
                </p>
                <h2 className="font-display text-lg font-semibold text-foreground mb-5 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gold/70" />
                  Trocar senha
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                      Senha atual
                    </Label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full glass rounded-xl px-4 py-2.5 mt-1.5 text-sm font-body text-foreground
                        focus:border-gold/30 focus:ring-2 focus:ring-gold/10 focus:outline-none
                        transition-all duration-200"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                        Nova senha
                      </Label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        placeholder="Mínimo 8 caracteres"
                        className="w-full glass rounded-xl px-4 py-2.5 mt-1.5 text-sm font-body text-foreground
                          placeholder:text-muted-foreground/40
                          focus:border-gold/30 focus:ring-2 focus:ring-gold/10 focus:outline-none
                          transition-all duration-200"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                        Confirmar nova senha
                      </Label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        className="w-full glass rounded-xl px-4 py-2.5 mt-1.5 text-sm font-body text-foreground
                          placeholder:text-muted-foreground/40
                          focus:border-gold/30 focus:ring-2 focus:ring-gold/10 focus:outline-none
                          transition-all duration-200"
                      />
                    </div>
                  </div>

                  {passwordError && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-body text-red-300">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-body text-emerald-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={changingPassword}
                      className="shine-effect flex items-center gap-2 bg-gradient-gold text-[#080808]
                        font-body font-bold py-2.5 px-5 rounded-xl text-sm
                        hover:-translate-y-0.5 hover:shadow-gold-md
                        transition-all duration-250 ease-expo-out
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      <Lock className="w-4 h-4" />
                      {changingPassword ? "Salvando..." : "Salvar nova senha"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Notificações */}
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground mb-5">
                  Notificações
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 p-4 glass rounded-xl border border-[var(--glass-border)]">
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor="whatsapp-updates"
                        className="text-sm text-foreground font-body font-semibold cursor-pointer"
                      >
                        Receber novidades no WhatsApp
                      </Label>
                      <p className="text-xs text-muted-foreground/60 font-body mt-0.5">
                        Receba ofertas exclusivas e atualizações de pedidos
                      </p>
                    </div>
                    <Switch
                      id="whatsapp-updates"
                      checked={receiveWhatsAppUpdates}
                      onCheckedChange={setReceiveWhatsAppUpdates}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4 p-4 glass rounded-xl border border-[var(--glass-border)]">
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor="email-updates"
                        className="text-sm text-foreground font-body font-semibold cursor-pointer"
                      >
                        Receber novidades por Email
                      </Label>
                      <p className="text-xs text-muted-foreground/60 font-body mt-0.5">
                        Receba newsletters e promoções por email
                      </p>
                    </div>
                    <Switch
                      id="email-updates"
                      checked={receiveEmailUpdates}
                      onCheckedChange={setReceiveEmailUpdates}
                    />
                  </div>
                </div>
              </div>

              {/* Categorias favoritas */}
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground mb-2">
                  Categorias Favoritas
                </h2>
                <p className="text-xs text-muted-foreground/60 font-body mb-4">
                  Selecione suas categorias preferidas para receber
                  recomendações personalizadas
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {categoryOptions.map((category) => {
                    const isSelected = favoriteCategories.includes(category);
                    return (
                      <button
                        type="button"
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-body font-semibold transition-all duration-200",
                          isSelected
                            ? "bg-gradient-gold text-[#080808]"
                            : "glass border border-[var(--glass-border)] text-muted-foreground/60 hover:border-gold/30 hover:text-gold",
                        )}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[var(--glass-border)]">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="shine-effect flex items-center gap-2 bg-gradient-gold text-[#080808]
                    font-body font-bold py-3 px-6 rounded-xl text-sm
                    hover:-translate-y-0.5 hover:shadow-gold-md
                    transition-all duration-250 ease-expo-out
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Salvando..." : "Salvar Preferências"}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Preferences;
