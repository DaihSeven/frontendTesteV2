"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  registerValidation,
  RegisterValidation,
} from "@/utils/registerValidation";
import { registerUser } from "@/services/auth";
import { TipoUsuario } from "@/types/user";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterValidation>({
    resolver: zodResolver(registerValidation),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      tipo_usuario: undefined,
      senha_admin: ""
    }
  });

  const router = useRouter();
  const tipo_usuario = watch("tipo_usuario");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const onSubmit = async (data: RegisterValidation) => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      console.log("=== INICIANDO CADASTRO ===");
      console.log("Dados do formulário:", {
        ...data,
        senha: "***",
        senha_admin: data.senha_admin ? "***" : undefined
      });
      
      await registerUser(
        data.nome,
        data.email,
        data.senha,
        data.tipo_usuario as TipoUsuario,
        data.senha_admin
      );
      
      setSuccess("Cadastro realizado com sucesso! Redirecionando para o login...");
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (error: any) {
      console.error("=== ERRO NO CADASTRO ===", error);
      setError(error.message || "Erro ao realizar cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-user">
      <h1 className="text-5xl">Cadastro</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-2 w-full max-w-md"
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full text-center text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 w-full text-center text-sm">
            {success}
          </div>
        )}
        
        <input
          {...register("nome")}
          placeholder="Nome completo"
          className="input-base"
          disabled={isLoading}
          autoComplete="name"
        />
        {errors.nome && <p className="text-red-500 text-sm w-full">{errors.nome.message}</p>}
        
        <input
          {...register("email")}
          type="email"
          placeholder="seu@email.com"
          className="input-base"
          disabled={isLoading}
          autoComplete="email"
        />
        {errors.email && <p className="text-red-500 text-sm w-full">{errors.email.message}</p>}
        
        <input
          type="password"
          {...register("senha")}
          placeholder="Sua senha (mín. 6 caracteres)"
          className="input-base"
          disabled={isLoading}
          autoComplete="new-password"
        />
        {errors.senha && <p className="text-red-500 text-sm w-full">{errors.senha.message}</p>}
        
        <select
          {...register("tipo_usuario")}
          className="input-base"
          disabled={isLoading}
        >
          <option value="">Selecione o tipo de usuário</option>
          <option value="usuario">Usuário Comum</option>
          <option value="admin">Administrador</option>
        </select>
        {errors.tipo_usuario && <p className="text-red-500 text-sm w-full">{errors.tipo_usuario.message}</p>}
        
        {tipo_usuario === "admin" && (
          <>
            <input
              type="password"
              {...register("senha_admin")}
              placeholder="Senha de administrador do sistema"
              className="input-base"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <small className="text-gray-600 text-xs text-center w-full">
              Esta é a senha especial de administrador configurada no sistema. 
              Entre em contato com o administrador se não souber.
            </small>
            {errors.senha_admin && <p className="text-red-500 text-sm w-full">{errors.senha_admin.message}</p>}
          </>
        )}
        
        <button
          type="submit"
          className="button-form"
          disabled={isLoading}
        >
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </section>
  );
}