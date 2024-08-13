import axios from 'axios';
// import { login as loginApi } from '../api/auth';

export const logout = async () => {
  const accessToken = localStorage.getItem('accessToken');

  try {
    console.log(accessToken);
    console.log(document.cookie);
    const response = await axios.post(
      'https://i11a406.p.ssafy.io/api/v1/users/logout',
      // 'http://localhost:8080/api/v1/users/logout',
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


  // localStorage.removeItem('accessToken');
  // if(localStorage.getItem('accessToken')){
  //   console.log("로그아웃 실패")
  // }
  // else{
  //   console.log("로그아웃 성공")
  // }
};
