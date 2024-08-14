import { login as loginApi } from '../api/auth';

interface LoginRequest {
  username: string;
  password: string;
}

export const login = async (credentials: LoginRequest): Promise<void> => {
  try {
    const {accessToken} = await loginApi(credentials);
    console.log(accessToken);
    // 토큰 저장
    localStorage.setItem('accessToken', accessToken);
    // localStorage.setItem('refreshToken', refreshToken);

    // 이후 필요한 로직 추가 (예: 사용자 상태 업데이트)
    console.log('Login successful');
  } catch (error) {
    console.error('Login failed:', error);
    throw error; // 필요한 경우 에러를 다시 던질 수 있습니다.
  }
};
