import { User, TipoUsuario, RegisterData } from '@/types/user';
import { api } from './api';

interface LoginResponse {
    token: string;
    usuario: User;
    message?: string;
}

interface RegisterResponse {
    usuario: User;
    message: string;
}

export const loginUser = async (email: string, senha: string): Promise<LoginResponse> => {
  try {
    console.log('Enviando dados de login:', { email, senha: '***' });
    
    const response = await api.post('/user/login', {
      email: email.trim().toLowerCase(),
      senha: senha
    });
    
    console.log('Resposta do login:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error('Erro no serviço de login:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Email ou senha incorretos');
    } else if (error.response?.status === 404) {
      throw new Error('Usuário não encontrado');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Erro no servidor. Tente novamente.');
  }
};

export const registerUser = async (
  nome: string, 
  email: string, 
  senha: string, 
  tipo_usuario: TipoUsuario, 
  senha_admin?: string
): Promise<RegisterResponse> => {
  try {
    const registerData: RegisterData = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha: senha,
      tipo_usuario: tipo_usuario
    };
    
    // Para admin, a senha_admin deve corresponder às credenciais do .env da API
    if (tipo_usuario === 'admin' && senha_admin) {
      registerData.senha_admin = senha_admin;
    }
    
    console.log('Enviando dados de registro:', { 
      ...registerData, 
      senha: '***', 
      senha_admin: senha_admin ? '***' : undefined 
    });
    
    const response = await api.post('/user/registrar', registerData);
    
    console.log('Resposta do registro:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error('Erro no serviço de registro:', error);
    
    if (error.response?.status === 409) {
      throw new Error('Email já está em uso');
    } else if (error.response?.status === 400) {
      const message = error.response?.data?.message || 'Dados inválidos';
      throw new Error(message);
    } else if (error.response?.status === 403) {
      throw new Error('Credenciais de admin inválidas. Verifique a senha de administrador.');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error('Erro no servidor. Tente novamente.');
  }
};