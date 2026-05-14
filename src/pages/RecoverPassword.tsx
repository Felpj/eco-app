import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";

/**
 * Slice 4 — Recuperação de senha
 *
 * Pendência backend: o endpoint de recover password ainda não existe.
 * Esta tela apenas comunica isso ao usuário e direciona pro WhatsApp/Login.
 * NÃO chama nenhuma API.
 */
const RecoverPassword = () => {
  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Funcionalidade em desenvolvimento"
    >
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center">
          <span className="text-primary text-2xl">⏳</span>
        </div>

        <div className="space-y-3">
          <p className="text-foreground font-body">
            A recuperação de senha estará disponível em breve.
          </p>
          <p className="text-sm text-muted-foreground font-body">
            Enquanto isso, se você perdeu o acesso à sua conta, fale com a gente
            pelo WhatsApp que ajudamos manualmente.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="gold" size="lg" className="w-full" asChild>
            <a
              href="https://wa.me/5518996718769?text=Ol%C3%A1!%20Preciso%20recuperar%20o%20acesso%20%C3%A0%20minha%20conta."
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
          </Button>
          <Link
            to="/entrar"
            className="text-sm text-primary hover:underline font-body"
          >
            Voltar para login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RecoverPassword;
