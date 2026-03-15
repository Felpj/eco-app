import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, MapPin, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomerStore } from "@/store/customer.store";
import { Address, AddressLabel } from "@/types/account";
import { formatCEP, isValidCEP } from "@/lib/validators";
import { toast } from "@/hooks/use-toast";
import { useCheckoutDraft } from "@/hooks/use-checkout-draft";
import { motion } from "framer-motion";

const Addresses = () => {
  const navigate = useNavigate();
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useCustomerStore();
  const { updateDraft } = useCheckoutDraft();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

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
    toast({ title: "Endereço selecionado", description: "O endereço foi pré-preenchido no checkout." });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este endereço?")) {
      removeAddress(id);
      toast({ title: "Endereço removido", description: "O endereço foi removido com sucesso." });
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={() => setEditingAddress(null)}
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
                    {editingAddress ? "Editar Endereço" : "Novo Endereço"}
                  </DialogTitle>
                </DialogHeader>
                <AddressForm
                  address={editingAddress}
                  onSave={(address) => {
                    if (editingAddress) {
                      updateAddress(editingAddress.id, address);
                      toast({ title: "Endereço atualizado", description: "O endereço foi atualizado com sucesso." });
                    } else {
                      addAddress(address);
                      toast({ title: "Endereço adicionado", description: "O endereço foi adicionado com sucesso." });
                    }
                    setIsDialogOpen(false);
                    setEditingAddress(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          {addresses.length === 0 ? (
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
                  transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                      {address.addressLine1}
                      {address.addressLine2 && ` - ${address.addressLine2}`}
                    </p>
                    <p>{address.neighborhood}, {address.city} - {address.state}</p>
                    <p>CEP: {address.cep}</p>
                    {address.reference && <p className="text-muted-foreground/60">Ref: {address.reference}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(address.id)}
                        className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5 text-xs font-body
                          font-medium text-muted-foreground/60 border border-[var(--glass-border)]
                          hover:border-gold/30 hover:text-gold transition-all duration-200"
                      >
                        <Check className="w-3 h-3" />
                        Tornar padrão
                      </button>
                    )}
                    <button
                      onClick={() => { setEditingAddress(address); setIsDialogOpen(true); }}
                      className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5 text-xs font-body
                        font-medium text-muted-foreground/60 border border-[var(--glass-border)]
                        hover:border-gold/30 hover:text-gold transition-all duration-200"
                    >
                      <Edit className="w-3 h-3" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="flex items-center gap-1.5 glass rounded-lg px-3 py-1.5 text-xs font-body
                        font-medium text-muted-foreground/60 border border-[var(--glass-border)]
                        hover:border-red-500/30 hover:text-red-400 transition-all duration-200"
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
  onSave: (address: Omit<Address, "id" | "isDefault">) => void;
}

const inputClass = `w-full glass rounded-xl px-4 py-2.5 text-sm font-body text-foreground
  placeholder:text-muted-foreground/40
  focus:border-gold/30 focus:ring-2 focus:ring-gold/10 focus:outline-none
  transition-all duration-200 mt-1.5`;

const AddressForm = ({ address, onSave }: AddressFormProps) => {
  const [formData, setFormData] = useState({
    label: (address?.label || "Casa") as AddressLabel,
    cep: address?.cep || "",
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    neighborhood: address?.neighborhood || "",
    city: address?.city || "",
    state: address?.state || "",
    reference: address?.reference || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidCEP(formData.cep)) {
      toast({ title: "CEP inválido", description: "Digite um CEP válido.", variant: "destructive" });
      return;
    }
    onSave({
      label: formData.label,
      cep: formData.cep,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2 || undefined,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      reference: formData.reference || undefined,
      isDefault: address?.isDefault || false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">Tipo *</Label>
        <Select value={formData.label} onValueChange={(v) => setFormData({ ...formData, label: v as AddressLabel })}>
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
        <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">CEP *</Label>
        <input
          type="tel"
          value={formData.cep}
          onChange={(e) => setFormData({ ...formData, cep: formatCEP(e.target.value) })}
          className={inputClass}
          placeholder="00000-000"
          maxLength={9}
          required
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">Endereço *</Label>
        <input
          value={formData.addressLine1}
          onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
          className={inputClass}
          placeholder="Rua, Avenida, Número"
          required
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">Complemento</Label>
        <input
          value={formData.addressLine2}
          onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
          className={inputClass}
          placeholder="Apto, Bloco, etc."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">Bairro *</Label>
          <input
            value={formData.neighborhood}
            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">Cidade *</Label>
          <input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={inputClass}
            required
          />
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">Estado (UF) *</Label>
        <input
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
          className={`${inputClass} uppercase`}
          placeholder="SP"
          maxLength={2}
          required
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">Referência</Label>
        <input
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          className={inputClass}
          placeholder="Ponto de referência"
        />
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="shine-effect bg-gradient-gold text-[#080808] font-body font-bold
            py-3 px-6 rounded-xl text-sm
            hover:-translate-y-0.5 hover:shadow-gold-sm
            transition-all duration-250 ease-expo-out"
        >
          {address ? "Salvar Alterações" : "Adicionar Endereço"}
        </button>
      </div>
    </form>
  );
};

export default Addresses;
