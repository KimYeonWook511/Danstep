import { login as loginApi } from '../api/auth';

interface LoginRequest {
  username: string;
  password: string;
}

export const login = async (credentials: LoginRequest): Promise<void> => {
  try {
    const {accessToken} = await loginApi(credentials);
    // 토큰 저장
    localStorage.setItem('accessToken', accessToken);
  } catch (error) {
    throw error; // 필요한 경우 에러를 다시 던질 수 있습니다.
  }
};
