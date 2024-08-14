import api from './api';

export const logout = async () => {
  const accessToken = localStorage.getItem('accessToken');

  try {
    const response = await api.post(
      '/users/logout',
      {},
      {
        withCredentials: true, // 쿠키를 포함하여 요청
      }
    );
    
    console.log(response);

    if (response.status === 200) {
      localStorage.removeItem('accessToken');
      console.log("logout.ts: accessToken 토큰 삭제!");

      return response.status;

    } else {
      console.log("로그아웃에 실패하였습니다.");
    }

  } catch (error) {
    console.log("실패로그: ", error);
  }
};
