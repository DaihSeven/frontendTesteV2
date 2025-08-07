import { z } from "zod";

export const registerValidation = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .trim()
    .refine(val => val.length > 0, 'Nome é obrigatório'),
  
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório')
    .transform(val => val.toLowerCase().trim()),
  
  senha: z.string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres"),
  
  // ✅ CORREÇÃO: Remover o .refine() desnecessário
  tipo_usuario: z.enum(["usuario", "admin"], {
    message: "Tipo deve ser 'usuario' ou 'admin'"
  }),
  
  senha_admin: z.string().optional()
}).refine((data) => {
  if (data.tipo_usuario === 'admin') {
    return data.senha_admin && data.senha_admin.length >= 8;
  }
  return true;
}, {
  message: "Para criar conta admin, você precisa da senha de administrador do sistema (8 caracteres)",
  path: ["senha_admin"]
});

export type RegisterValidation = z.infer<typeof registerValidation>;