import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor de requisição
api.interceptors.request.use((config) => {
  console.log('=== REQUISIÇÃO API ===');
  console.log(`${config.baseURL ?? ''}${config.url ?? ''}`)
  console.log('Method:', config.method?.toUpperCase());
  console.log('Data:', config.data);
  
  // Adicionar token se existir
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token adicionado à requisição');
    }
  }
  
  return config;
}, (error) => {
  console.error('Erro na configuração da requisição:', error);
  return Promise.reject(error);
});

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    console.log('=== RESPOSTA API SUCESSO ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    return response;
  },
  (error) => {
    console.error('=== RESPOSTA API ERRO ===');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    
    // Se token expirado, limpar localStorage
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    
    return Promise.reject(error);
  }
);