export type TipoUsuario = 'admin' | 'usuario';

export interface User {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: TipoUsuario;
}

export interface JWTPayload {
  id: number | string;
  nome: string;
  email: string;
  tipo_usuario: TipoUsuario;
  exp?: number;
  iat?: number; 
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  tipo_usuario: TipoUsuario;
  senha_admin?: string;
}