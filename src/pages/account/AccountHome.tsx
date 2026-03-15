import { Link } from "react-router-dom";
import { LogOut, Package, MapPin, Ticket, Users, Settings, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { useCustomerStore } from "@/store/customer.store";
import { motion } from "framer-motion";
import { formatMoney } from "@/lib/money";

const AccountHome = () => {
  const navigate = useNavigate();
  const { profile, logout } = useAuthStore();
  const { orders } = useCustomerStore();

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  const recentOrders = orders.slice(0, 3);
  const totalOrders = orders.length;

  const menuItems = [
    {
      title: "Meus Pedidos",
      description: `${totalOrders} pedido${totalOrders !== 1 ? "s" : ""}`,
      icon: Package,
      href: "/conta/pedidos",
    },
    {
      title: "Endereços",
      description: "Gerenciar endereços de entrega",
      icon: MapPin,
      href: "/conta/enderecos",
    },
    {
      title: "Cupons",
      description: "Cupons disponíveis",
      icon: Ticket,
      href: "/conta/cupons",
    },
    {
      title: "Indicações",
      description: "Indique e ganhe",
      icon: Users,
      href: "/conta/indicacoes",
    },
    {
      title: "Preferências",
      description: "Configurações da conta",
      icon: Settings,
      href: "/conta/preferencias",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  const firstName = profile?.fullName?.split(" ")[0] || "Cliente";

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Aurora */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="aurora-blob"
          style={{ width: 400, height: 400, right: "10%", top: "15%", background: "var(--aurora-gold)", opacity: 0.5 }}
        />
      </div>

      <main className="relative pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-start justify-between mb-10">
              <div>
                <p className="text-muted-foreground/60 font-body text-sm mb-1">Bem-vindo de volta</p>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Olá, {firstName}!
                </h1>
              </div>
              <button
                onClick={handleLogout}
                className="group glass rounded-xl px-4 py-2.5 text-sm font-body font-medium
                  text-muted-foreground/60 border border-[var(--glass-border)]
                  hover:border-red-500/30 hover:text-red-400
                  flex items-center gap-2
                  transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </motion.div>

            {/* Recent Orders */}
            {recentOrders.length > 0 && (
              <motion.div variants={itemVariants} className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Pedidos Recentes
                  </h2>
                  <Link
                    to="/conta/pedidos"
                    className="text-sm text-gold/70 hover:text-gold font-body transition-colors flex items-center gap-1"
                  >
                    Ver todos
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {recentOrders.map((order, index) => (
                    <motion.div
                      key={order.orderCode}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        to={`/conta/pedidos/${order.orderCode}`}
                        className="block glass rounded-xl p-5 border border-[var(--glass-border)]
                          hover:border-gold/25 transition-all duration-200 group"
                      >
                        <p className="font-display font-semibold text-foreground text-sm mb-1 group-hover:text-gold transition-colors">
                          {order.orderCode}
                        </p>
                        <p className="text-xs text-muted-foreground/60 font-body mb-3">
                          {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-body text-muted-foreground/50">
                            {order.status.replace("_", " ")}
                          </span>
                          <span className="font-display font-bold text-gold text-sm">
                            {formatMoney(order.total)}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Menu Cards */}
            <motion.div variants={itemVariants}>
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Minha Conta
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        to={item.href}
                        className="flex items-center gap-4 glass rounded-xl p-5 border border-[var(--glass-border)]
                          hover:border-gold/25 transition-all duration-200 group"
                      >
                        <div className="w-11 h-11 rounded-xl glass-gold border border-gold/20
                          flex items-center justify-center shrink-0
                          group-hover:border-gold/40 transition-colors duration-200">
                          <Icon className="w-5 h-5 text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-semibold text-foreground text-sm group-hover:text-gold transition-colors duration-200">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground/60 font-body mt-0.5">
                            {item.description}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-gold/50 transition-all duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AccountHome;
