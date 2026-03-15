import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCustomerStore } from "@/store/customer.store";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  const { preferences, updatePreferences } = useCustomerStore();
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    updatePreferences(localPreferences);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Preferências salvas!", description: "Suas preferências foram atualizadas com sucesso." });
    }, 500);
  };

  const toggleCategory = (category: string) => {
    setLocalPreferences((prev) => {
      const categories = prev.favoriteCategories.includes(category)
        ? prev.favoriteCategories.filter((c) => c !== category)
        : [...prev.favoriteCategories, category];
      return { ...prev, favoriteCategories: categories };
    });
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

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-2xl p-6 md:p-8 space-y-8"
          >
            {/* Notifications */}
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-5">
                Notificações
              </h2>
              <div className="space-y-4">
                {[
                  {
                    id: "whatsapp-updates",
                    label: "Receber novidades no WhatsApp",
                    description: "Receba ofertas exclusivas e atualizações de pedidos",
                    checked: localPreferences.receiveWhatsAppUpdates,
                    onChange: (checked: boolean) =>
                      setLocalPreferences((prev) => ({ ...prev, receiveWhatsAppUpdates: checked })),
                  },
                  {
                    id: "email-updates",
                    label: "Receber novidades por Email",
                    description: "Receba newsletters e promoções por email",
                    checked: localPreferences.receiveEmailUpdates,
                    onChange: (checked: boolean) =>
                      setLocalPreferences((prev) => ({ ...prev, receiveEmailUpdates: checked })),
                  },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 p-4
                    glass rounded-xl border border-[var(--glass-border)]">
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={item.id} className="text-sm text-foreground font-body font-semibold cursor-pointer">
                        {item.label}
                      </Label>
                      <p className="text-xs text-muted-foreground/60 font-body mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <Switch
                      id={item.id}
                      checked={item.checked}
                      onCheckedChange={item.onChange}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Categories */}
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-2">
                Categorias Favoritas
              </h2>
              <p className="text-xs text-muted-foreground/60 font-body mb-4">
                Selecione suas categorias preferidas para receber recomendações personalizadas
              </p>
              <div className="flex flex-wrap gap-2.5">
                {categoryOptions.map((category) => {
                  const isSelected = localPreferences.favoriteCategories.includes(category);
                  return (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-body font-semibold transition-all duration-200",
                        isSelected
                          ? "bg-gradient-gold text-[#080808]"
                          : "glass border border-[var(--glass-border)] text-muted-foreground/60 hover:border-gold/30 hover:text-gold"
                      )}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-end pt-4 border-t border-[var(--glass-border)]">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="shine-effect flex items-center gap-2 bg-gradient-gold text-[#080808]
                  font-body font-bold py-3 px-6 rounded-xl text-sm
                  hover:-translate-y-0.5 hover:shadow-gold-md
                  transition-all duration-250 ease-expo-out
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Salvando..." : "Salvar Preferências"}
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Preferences;
