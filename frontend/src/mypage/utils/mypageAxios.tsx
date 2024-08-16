import api from '../../api/api';
import {jwtDecode,JwtPayload} from 'jwt-decode';


interface ModifyProfileData {
    currentPassword: string;
    newPassword: string;
    nickname: string;
}

interface CustomJwtPayload extends JwtPayload {
    username: string;
}



export const getUser = async () =>{
    const accessToken = localStorage.getItem('accessToken');
    const decodedToken = jwtDecode<CustomJwtPayload>(accessToken!);
    const decodeUsername = decodedToken.username; // JWT의 페이로드에서 username 추출
    try{
    await api.get(`/users/${decodeUsername}`,{
        headers:{
            'Authorization':accessToken,
            'Content-Type': 'application/json',
        }});
    }
    catch(error){
    }

}

export const modifyProfile = async ({currentPassword, newPassword, nickname}:ModifyProfileData) => {
    const token = localStorage.getItem('accessToken');
    const decodedToken = jwtDecode<CustomJwtPayload>(token!);
    const decodeUsername = decodedToken.username; // JWT의 페이로드에서 username 추출

    const data = {
        currentPassword,
        newPassword,
        nickname
    }
    const accessToken = localStorage.getItem('accessToken');
    try{
    const response = await api.patch(`/users/${decodeUsername}`, data, {
        headers:{
        'Content-Type': 'multipart/form-data',
        'Authorization' : accessToken,
      }});
      return response;
    }
    catch (error:any) {
        return error.response;
      }
}