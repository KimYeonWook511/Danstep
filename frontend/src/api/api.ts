import axios, { InternalAxiosRequestConfig } from 'axios';

// 환경 변수에서 API URL 가져오기
const apiUrl = process.env.REACT_APP_API_URL;

// JWT 토큰을 저장하는 예시
let accessToken: string = localStorage.getItem('accessToken') || '';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: apiUrl, // 백엔드 API 주소
  headers: {
    'Content-Type': 'application/json', // 기본 Content-Type 설정
  },
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      const { errorCode } = error.response.data;

      if (errorCode === 'ACCESS_TOKEN_EXPIRED' && !originalRequest._retry) {
        originalRequest._retry = true;
        localStorage.removeItem("accessToken");

        // 토큰 갱신 요청
        const response = await api.post('/users/reissue', {}, {
            withCredentials: true, // 쿠키를 포함하여 요청
        });

        if (response.status === 200) {
          // 새로운 토큰 저장
          accessToken = response.headers.authorization;
          localStorage.setItem('accessToken', accessToken);
  
          // 요청 다시 시도
          originalRequest.headers['Authorization'] = accessToken;
          return await api(originalRequest);
        } else {
          return response;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
