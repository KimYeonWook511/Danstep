import axios, { InternalAxiosRequestConfig } from 'axios';

// JWT 토큰을 저장하는 예시
let accessToken: string = localStorage.getItem('accessToken') || '';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: 'https://i11a406.p.ssafy.io/', // 백엔드 API 주소
  // baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json', // 기본 Content-Type 설정
  },
});

// 요청 인터셉터
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // 로그인 요청에 대해서만 Content-Type 변경
  if (config.url === '/api/v1/users/login') {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  } else if (accessToken) {
    // 다른 모든 요청에 대해 Authorization 헤더 추가
    config.headers['Authorization'] = `${accessToken}`;
  }
  return config;
});

// // 응답 인터셉터
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       // 토큰 갱신 요청
//       const response = await axios.post('http://localhost:8080/api/v1/users/login', {
//         refreshToken: refreshToken,
//       });

//       if (response.status === 200) {
//         // 새로운 토큰 저장
//         accessToken = response.data.accessToken;
//         localStorage.setItem('accessToken', accessToken);

//         // 요청 다시 시도
//         originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
//         return api(originalRequest);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
