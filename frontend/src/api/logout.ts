import api from './api';

export const logout = async () => {
  try {
    const response = await api.post(
      '/users/logout',
      {},
      {
        withCredentials: true, // 쿠키를 포함하여 요청
      }
    );
    if (response.status === 200) {
      localStorage.removeItem('accessToken');
      return response.status;
    }
  } catch (error:any) {
    return error.response.status;
  }
};
