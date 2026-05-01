export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  nome?: string;
}

export interface RegisterRequest {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
}
