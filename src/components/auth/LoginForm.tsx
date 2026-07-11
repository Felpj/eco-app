import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { loginCustomer, ApiError } from "@/lib/api";
import { safeInternalPath } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const loginSchema = z.object({
  identifier: z.string().min(1, "Campo obrigatório"),
  password: z.string().min(1, "Campo obrigatório"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Normaliza identifier: se parecer telefone, manda só os dígitos
      const rawId = data.identifier.trim();
      const looksLikeEmail = rawId.includes("@");
      const identifier = looksLikeEmail ? rawId : rawId.replace(/\D/g, "") || rawId;

      const res = await loginCustomer({ identifier, password: data.password });

      login({
        profile: {
          id: res.user.id,
          fullName: res.user.fullName,
          email: res.user.email ?? undefined,
          whatsapp: res.user.whatsapp ?? "",
          createdAt: res.user.createdAt,
          updatedAt: res.user.createdAt,
        },
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      });

      toast({
        title: "Login realizado!",
        description: `Bem-vindo de volta${res.user.fullName ? `, ${res.user.fullName.split(" ")[0]}` : ""}.`,
      });

      const next = safeInternalPath(
        searchParams.get("next") || searchParams.get("from"),
      );
      navigate(next);
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 0;
      const description =
        status === 401
          ? "Credenciais inválidas."
          : err instanceof Error
            ? err.message
            : "Não foi possível entrar agora.";
      toast({
        title: "Erro ao entrar",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="identifier" className="text-foreground font-body">
          WhatsApp ou Email *
        </Label>
        <Input
          id="identifier"
          type="text"
          {...register("identifier")}
          className="mt-2 bg-secondary border-border"
          placeholder="seu@email.com ou (11) 99999-9999"
        />
        {errors.identifier && (
          <p className="mt-1 text-sm text-destructive font-body">
            {errors.identifier.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="password" className="text-foreground font-body">
          Senha *
        </Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          className="mt-2 bg-secondary border-border"
          placeholder="Sua senha"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-destructive font-body">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Link
          to="/recuperar-senha"
          className="text-sm text-primary hover:underline font-body"
        >
          Esqueci minha senha
        </Link>
      </div>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground font-body">
          Não tem uma conta?{" "}
          <Link to="/criar-conta" className="text-primary hover:underline font-body">
            Criar conta
          </Link>
        </p>
      </div>
    </form>
  );
};
