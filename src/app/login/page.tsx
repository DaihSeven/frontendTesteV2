'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginValidation, LoginValidation } from "@/utils/loginValidation";
import { loginUser } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginValidation>({
    resolver: zodResolver(loginValidation),
  });

  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const onSubmit = async (data: LoginValidation) => {
    setIsLoading(true);
    setError("");
    
    try {
      console.log("=== INICIANDO LOGIN ===");
      console.log("Email:", data.email);
      
      const response = await loginUser(data.email, data.senha);
      
      console.log("Login bem-sucedido:", response.usuario);
      
      // Usar a função login do contexto
      login(response.token, response.usuario);
      
      // Redirecionar baseado no tipo de usuário
      if (response.usuario?.tipo_usuario === 'admin') {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
      
    } catch (error: any) {
      console.error("=== ERRO NO LOGIN ===", error);
      setError(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-user">
      <h1 className="text-5xl">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form-user">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-md text-center text-sm">
            {error}
          </div>
        )}
        
        <input 
          {...register("email")} 
          type="email"
          placeholder="seu@email.com"  
          className="input-base"
          disabled={isLoading}
          autoComplete="email"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        
        <input 
          type="password" 
          {...register("senha")} 
          placeholder="Sua senha"  
          className="input-base"
          disabled={isLoading}
          autoComplete="current-password"
        />
        {errors.senha && <p className="text-red-500 text-sm">{errors.senha.message}</p>}
        
        <button 
          type="submit" 
          className="button-form"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}