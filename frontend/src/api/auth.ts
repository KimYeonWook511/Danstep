import api from './api';

interface LoginRequest {
  'username': string;
  'password': string;
}

interface LoginResponse {
  accessToken: string;
//   refreshToken: string;
}
interface SignUpRequest {
    nickname: string;
    username: string;
    password: string;
  }
  
  interface SignUpResponse {
    message: string; // 회원가입 성공 시 반환되는 메시지
  }
  
export const signUp = async (credentials: SignUpRequest): Promise<SignUpResponse> => {
    const response = await api.post<SignUpResponse>('/api/v1/users/join', credentials);
    return response.data;
};

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // const response = await api.post<LoginResponse>('http://localhost:8080/api/v1/users/login', credentials, {
  //   withCredentials: true,
  //   headers: {
  //     "Content-Type" : 'application/x-www-form-urlencoded',
  //   }
  // });  
  const response = await api.post<LoginResponse>('/api/v1/users/login', credentials, {
    withCredentials: true,
  });  
  const accessToken = response.headers.authorization;
  
  return {accessToken};
};
