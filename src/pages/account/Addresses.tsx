import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, MapPin, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Address } from "@/types/account";
import { formatCEP, isValidCEP } from "@/lib/validators";
import { toast } from "@/hooks/use-toast";
import { useCheckoutDraft } from "@/hooks/use-checkout-draft";
import { motion } from "framer-motion";
import {
  getMyAddresses,
  createAddress,
  updateAddress as apiUpdateAddress,
  deleteAddress as apiDeleteAddress,
  setDefaultAddress as apiSetDefaultAddress,
  getAddressByCep,
  type BackendAddress,
} from "@/lib/api";
import { handleAuthError } from "@/lib/auth-guard";

/** Adapta BackendAddress (street/number) ↔ Address legado (addressLine1) */
function fromBackend(a: BackendAddress): Address {
  const addressLine1 = `${a.street}, ${a.number}`.trim();
  return {
    id: a.id,
    label: a.label,
    cep: a.cep,
    street: a.street,
    number: a.number,
    complement: a.complement ?? undefined,
    addressLine1,
    addressLine2: a.complement ?? undefined,
    neighborhood: a.neighborhood,
    city: a.city,
    state: a.state,
    reference: a.reference ?? undefined,
    isDefault: a.isDefault,
    name: a.name ?? undefined,
    phone: a.phone ?? undefined,
    document: a.document ?? undefined,
  };
}

interface AddressFormState {
  label: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  reference: string;
}

const Addresses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateDraft } = useCheckoutDraft();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getMyAddresses()
      .then((list) => setAddresses(list.map(fromBackend)))
      .catch((err) => {
        if (!handleAuthError(err, navigate, location.pathname)) {
          console.error("[Addresses] load failed", err);
          toast({
            title: "Erro ao carregar endereços",
            description: err instanceof Error ? err.message : "Tente novamente.",
            variant: "destructive",
          });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUseInCheckout = (address: Address) => {
    updateDraft({
      delivery: {
        cep: address.cep,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        shippingMethodId: "STANDARD",
      },
    });
    navigate("/checkout");
    toast({
      title: "Endereço selecionado",
      description: "O endereço foi pré-preenchido no checkout.",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este endereço?")) return;
    setBusyId(id);
    try {
      await apiDeleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast({ title: "Endereço removido" });
    } catch (err) {
      if (!handleAuthError(err, navigate, location.pathname)) {
        toast({
          title: "Erro ao remover",
          description: err instanceof Error ? err.message : "Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setBusyId(id);
    try {
      await apiSetDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id })),
      );
      toast({ title: "Endereço padrão atualizado" });
    } catch (err) {
      if (!handleAuthError(err, navigate, location.pathname)) {
        toast({
          title: "Erro ao definir padrão",
          description: err instanceof Error ? err.message : "Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleSave = async (form: AddressFormState, isDefault: boolean) => {
    const payload = {
      label: form.label,
      cep: form.cep.replace(/\D/g, ""),
      street: form.street.trim(),
      number: form.number.trim(),
      complement: form.complement.trim() || undefined,
      neighborhood: form.neighborhood.trim(),
      city: form.city.trim(),
      state: form.state.trim().toUpperCase(),
      reference: form.reference.trim() || undefined,
      isDefault,
    };

    try {
      if (editing) {
        const updated = await apiUpdateAddress(editing.id, payload);
        setAddresses((prev) =>
          prev.map((a) => (a.id === updated.id ? fromBackend(updated) : a)),
        );
        toast({ title: "Endereço atualizado" });
      } else {
        const created = await createAddress(payload);
        setAddresses((prev) => {
          // se backend marcou default, os outros viram false
          const newList = created.isDefault
            ? prev.map((a) => ({ ...a, isDefault: false }))
            : prev;
          return [...newList, fromBackend(created)];
        });
        toast({ title: "Endereço adicionado" });
      }
      setIsDialogOpen(false);
      setEditing(null);
    } catch (err) {
      if (!handleAuthError(err, navigate, location.pathname)) {
        toast({
          title: "Erro ao salvar endereço",
          description: err instanceof Error ? err.message : "Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            to="/conta"
            className="inline-flex items-center gap-2 text-muted-foreground/60 hover:text-gold
              transition-colors duration-200 mb-8 font-body text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Voltar para conta
          </Link>

          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Meus Endereços
            </h1>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) setEditing(null);
              }}
            >
              <DialogTrigger asChild>
                <button
                  onClick={() => setEditing(null)}
                  className="shine-effect flex items-center gap-2 bg-gradient-gold text-[#080808]
                    font-body font-bold py-2.5 px-5 rounded-xl text-sm
                    hover:-translate-y-0.5 hover:shadow-gold-sm
                    transition-all duration-250 ease-expo-out"
                >
                  <Plus className="w-4 h-4" />
                  Novo Endereço
                </button>
              </DialogTrigger>
              <DialogContent className="glass border-[var(--glass-border)] max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl font-bold text-foreground">
                    {editing ? "Editar Endereço" : "Novo Endereço"}
                  </DialogTitle>
                </DialogHeader>
                <AddressForm
                  address={editing}
                  onSave={handleSave}
                />
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-5">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-5 border border-[var(--glass-border)] animate-pulse h-40"
                />
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl glass border border-[var(--glass-border)]
                flex items-center justify-center">
                <MapPin className="w-9 h-9 text-muted-foreground/30" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                Nenhum endereço cadastrado
              </h2>
              <p className="text-muted-foreground/60 font-body text-sm mb-8">
                Adicione um endereço para facilitar suas compras
              </p>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="inline-flex items-center gap-2 shine-effect bg-gradient-gold text-[#080808]
                  font-body font-bold py-3 px-6 rounded-xl text-sm
                  hover:-translate-y-0.5 hover:shadow-gold-md
                  transition-all duration-250 ease-expo-out"
              >
                <Plus className="w-4 h-4" />
                Adicionar Primeiro Endereço
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {addresses.map((address, i) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.07,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="glass rounded-xl p-5 border border-[var(--glass-border)] relative"
                >
                  {address.isDefault && (
                    <span className="absolute top-4 right-4 text-[10px] font-body font-bold
                      text-gold border border-gold/30 bg-gold/10 px-2.5 py-0.5 rounded-full">
                      Padrão
                    </span>
                  )}
                  <h3 className="font-display text-base font-semibold text-foreground mb-2">
                    {address.label}
                  </h3>
                  <div className="space-y-0.5 text-sm text-muted-foreground font-body mb-4">
                    <p className="text-foreground/80">
                      {address.street}, {address.number}
                      {address.complement && ` - ${address.complement}`}
                    </p>
                    <p>
                      {address.neighborhood}, {address.city} - {address.state}
                    </p>
                    <p>CEP: {formatCEP(address.cep)}</p>
                    {address.reference && (
                      <p className="text-muted-foreground/60">
                        Ref: {address.reference}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        disabled={busyId === address.id}
                        className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5 text-xs font-body
                          font-medium text-muted-foreground/60 border border-[var(--glass-border)]
                          hover:border-gold/30 hover:text-gold transition-all duration-200
                          disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" />
                        Tornar padrão
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditing(address);
                        setIsDialogOpen(true);
                      }}
                      className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5 text-xs font-body
                        font-medium text-muted-foreground/60 border border-[var(--glass-border)]
                        hover:border-gold/30 hover:text-gold transition-all duration-200"
                    >
                      <Edit className="w-3 h-3" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      disabled={busyId === address.id}
                      className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5 text-xs font-body
                        font-medium text-muted-foreground/60 border border-[var(--glass-border)]
                        hover:border-red-500/30 hover:text-red-400 transition-all duration-200
                        disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remover
                    </button>
                    <button
                      onClick={() => handleUseInCheckout(address)}
                      className="flex items-center gap-1.5 bg-gradient-gold text-[#080808]
                        rounded-lg px-3 py-1.5 text-xs font-body font-bold
                        hover:shadow-gold-sm transition-all duration-200"
                    >
                      Usar no checkout
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

interface AddressFormProps {
  address?: Address | null;
  onSave: (form: AddressFormState, isDefault: boolean) => Promise<void> | void;
}

const inputClass = `w-full glass rounded-xl px-4 py-2.5 text-sm font-body text-foreground
  placeholder:text-muted-foreground/40
  focus:border-gold/30 focus:ring-2 focus:ring-gold/10 focus:outline-none
  transition-all duration-200 mt-1.5`;

const AddressForm = ({ address, onSave }: AddressFormProps) => {
  const [formData, setFormData] = useState<AddressFormState>({
    label: address?.label || "Casa",
    cep: address?.cep ? formatCEP(address.cep) : "",
    street: address?.street || address?.addressLine1?.split(",")[0]?.trim() || "",
    number:
      address?.number ||
      address?.addressLine1?.split(",")[1]?.trim() ||
      "",
    complement: address?.complement || address?.addressLine2 || "",
    neighborhood: address?.neighborhood || "",
    city: address?.city || "",
    state: address?.state || "",
    reference: address?.reference || "",
  });
  const [cepLoading, setCepLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDefault, setIsDefault] = useState<boolean>(address?.isDefault || false);

  const handleCepBlur = async () => {
    const clean = formData.cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await getAddressByCep(clean);
      setFormData((prev) => ({
        ...prev,
        street: prev.street || res.street,
        neighborhood: prev.neighborhood || res.neighborhood,
        city: prev.city || res.city,
        state: prev.state || res.state,
      }));
    } catch {
      // silent — usuário preenche manualmente
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidCEP(formData.cep)) {
      toast({
        title: "CEP inválido",
        description: "Digite um CEP válido.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.street || !formData.number) {
      toast({
        title: "Rua e número obrigatórios",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      await onSave(formData, isDefault);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
          Tipo *
        </Label>
        <Select
          value={formData.label}
          onValueChange={(v) => setFormData({ ...formData, label: v })}
        >
          <SelectTrigger className="glass rounded-xl border-[var(--glass-border)] mt-1.5 text-sm font-body">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass border-[var(--glass-border)]">
            <SelectItem value="Casa">Casa</SelectItem>
            <SelectItem value="Trabalho">Trabalho</SelectItem>
            <SelectItem value="Outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
          CEP * {cepLoading && <span className="text-gold/70">(buscando…)</span>}
        </Label>
        <input
          type="tel"
          value={formData.cep}
          onChange={(e) =>
            setFormData({ ...formData, cep: formatCEP(e.target.value) })
          }
          onBlur={handleCepBlur}
          className={inputClass}
          placeholder="00000-000"
          maxLength={9}
          required
        />
      </div>

      <div className="grid grid-cols-[1fr_120px] gap-4">
        <div>
          <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
            Rua *
          </Label>
          <input
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            className={inputClass}
            placeholder="Av. / Rua"
            required
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
            Número *
          </Label>
          <input
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            className={inputClass}
            placeholder="100"
            required
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
          Complemento
        </Label>
        <input
          value={formData.complement}
          onChange={(e) =>
            setFormData({ ...formData, complement: e.target.value })
          }
          className={inputClass}
          placeholder="Apto, Bloco, etc."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
            Bairro *
          </Label>
          <input
            value={formData.neighborhood}
            onChange={(e) =>
              setFormData({ ...formData, neighborhood: e.target.value })
            }
            className={inputClass}
            required
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
            Cidade *
          </Label>
          <input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
          Estado (UF) *
        </Label>
        <input
          value={formData.state}
          onChange={(e) =>
            setFormData({ ...formData, state: e.target.value.toUpperCase() })
          }
          className={`${inputClass} uppercase`}
          placeholder="SP"
          maxLength={2}
          required
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
          Referência
        </Label>
        <input
          value={formData.reference}
          onChange={(e) =>
            setFormData({ ...formData, reference: e.target.value })
          }
          className={inputClass}
          placeholder="Ponto de referência"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer text-sm font-body text-foreground/80">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="accent-gold"
        />
        Definir como endereço padrão
      </label>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="shine-effect bg-gradient-gold text-[#080808] font-body font-bold
            py-3 px-6 rounded-xl text-sm
            hover:-translate-y-0.5 hover:shadow-gold-sm
            transition-all duration-250 ease-expo-out
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? "Salvando…"
            : address
              ? "Salvar Alterações"
              : "Adicionar Endereço"}
        </button>
      </div>
    </form>
  );
};

export default Addresses;
