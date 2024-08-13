import axios from 'axios';

const Test: React.FC = () => {

  const url = "https://i11a406.p.ssafy.io"

  const login = async () => {

    // FormData 객체 생성
    const formData = new FormData();
    formData.append('username', "t1");
    formData.append('password', "t1");

    try {
      const res = await axios.post(`${url}/api/v1/users/login`, formData)

      console.log(res);

      localStorage.setItem("accessToken", res.headers['Authorization']);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <button onClick={() => {
        login
      }}>로그인</button>
    </div>
  );
};

export default Test;
