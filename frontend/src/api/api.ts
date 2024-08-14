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

// 요청 인터셉터
// api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   // 로그인 요청에 대해서만 Content-Type 변경
//   // if (config.url === '/users/login') {
//   //   config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
//   // } else if (config.url === `/users/${username}`)
  
//   if (accessToken) {
//     // 다른 모든 요청에 대해 Authorization 헤더 추가
//     config.headers['Authorization'] = `${accessToken}`;
//   }

//   return config;
// });

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("api.ts: access Token 만료");
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
        console.log("api.ts: refresh Token 재발급 성공");
        originalRequest.headers['Authorization'] = accessToken;
        return api(originalRequest);
      } else {
        console.log("api.ts: refresh Token 재발급 실패!!");
        console.log("api.ts: 실패response", response);
        return response;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
