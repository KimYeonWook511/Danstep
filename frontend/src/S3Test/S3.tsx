import React, { useEffect, useRef, useState, FormEvent } from 'react';
import axios from 'axios';

const JOINTS = [
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16], // 팔
  [11, 12],
  [23, 24], // 몸통
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28], // 다리
];

const PoseEstimator: React.FC = () => {
  const baseUrl = 'https://danstep-backend-container:8080';
  // const baseUrl = 'http://localhost:8080';

  const [downloadFileName, setDownloadFileName] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadContent, setUploadContent] = useState('');

  const [uploadProfileName, setUploadProfileName] = useState('');
  const [uploadProfile, setUploadProfile] = useState<File | null>(null);

  const [downloadedVideoUrl, setDownloadedVideoUrl] = useState<string | null>(null);

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const fileURL = URL.createObjectURL(file);

      video.src = fileURL;
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(fileURL);
        const duration = video.duration;
        const changeIntDuration = Math.floor(duration);
        resolve(changeIntDuration);
      };

      video.onerror = (error) => {
        URL.revokeObjectURL(fileURL);
        reject(error);
      };
    });
  };

  const uploadHandleProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && checkProfileType(e)) {
      setUploadProfile(e.target.files[0]);
      setUploadProfileName(e.target.value);
    }
  };

  function checkProfileType(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files!) {
      var file = e.target.files[0];
      var file_type = file.type;
      if (!file_type.startsWith('image/')) {
        alert('이미지가 아닌뎁쇼');
        return false;
      }
    }

    return true;
  }

  function checkFileType(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files!) {
      var file = e.target.files[0];
      var file_type = file.type;
      if (!file_type.startsWith('video/')) {
        alert('오 영상 아닌거 작동한다');
        return false;
      }
    }

    return true;
  }

  const downHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDownloadFileName(e.target.value);
  };
  const uploadHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && checkFileType(e)) {
      setUploadFile(e.target.files[0]);
      setUploadFileName(e.target.value);
      console.log('e.target ->', e.target.files[0]);
      console.log('file: ', uploadFile);
    }
  };

  const uploadTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadTitle(e.target.value);
  };

  const uploadContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUploadContent(e.target.value);
  };

  const uploadProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('\n\n\n\n\n\n\n\n\n프로필 업로드 버튼!\n\n\n\n\n\n\n\n\n');

    if (uploadProfile) {
      try {
        const formData = new FormData();
        formData.append('profile', uploadProfile!);
        console.log('\n\n\n\n\n\n\n\n\n내부입니다!\n\n\n\n\n\n\n\n\n');

        const response = await axios.post(`${baseUrl}/api/v1/s3/profile`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log(response);
        alert(response);
      } catch {
        alert('실패했다.실패했다.실패했다.실패했다.실패했다.실패했다.');
      }
    }
  };

  const uploadHandleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('업로드 버튼 클릭함!');
    if (uploadFile) {
      try {
        const duration = await getVideoDuration(uploadFile);

        // console.log(document.querySelector('#tt'));

        const formData = new FormData();
        formData.append('file', uploadFile!);
        formData.append('title', uploadTitle);
        formData.append('content', uploadContent);
        formData.append('duration', duration.toString());
        // formData.append('originalName', uploadFileName.split('.').join('.'));
        // formData.append('extension', uploadFileName.split('.').pop()!);
        console.log(duration);
        console.log(uploadFile);
        console.log(uploadTitle);
        console.log(uploadContent);
        // console.log(uploadFileName.split('.').join('.'));
        // console.log(uploadFileName.split('.').pop()!);

        const response = await axios.post(`${baseUrl}/api/v1/s3/video`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        alert('오 ㅋㅋ 업로드 성공함');
      } catch {
        console.log('실패했잖아!!!!!!');
        alert('실패! 젠장');
      }
    }
  };

  const downloadHandleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('\n\nHello World\n\n');
    if (downloadFileName) {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/s3/download/${downloadFileName}`, {
          responseType: 'blob', // 중요한 부분: 파일을 blob 형태로 받기 위해 설정
        });
        console.log(response);
        // Blob을 사용하여 파일 다운로드 처리

        const response_src = await axios.get(`${baseUrl}/api/v1/s3/getUrl/${downloadFileName}`, {
          responseType: 'text',
        });

        setDownloadedVideoUrl(response_src.data);

        //console.log(response_src);
        // console.log('url => ', url);
        // console.log('link => ', link);
        console.log('응답 데이터 타입 : ', typeof response.data);
        console.log('응답 헤더 : ', response.headers);

        const contentDisposition = response.headers['content-disposition'];
        const fileName = contentDisposition
          ? contentDisposition.split('filename=')[1].replace(/"/g, '')
          : downloadFileName;
        const mimeType = response.headers['content-type'] || 'application/octet-stream';

        const blob = new Blob([response.data], { type: mimeType });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', downloadFileName); // 파일 이름 설정
        document.body.appendChild(link);
        link.click();
        console.log(link);
        link.remove();
      } catch (error) {
        console.error('다운로드 실패했어욤', error);
      }
    } else {
      console.log('Please enter a file name.');
    }
  };

  const getUrlApi = async () => {
    try {
      const downloadFileName = "4"

      const response_src = await axios.get(`${baseUrl}/api/v1/s3/getUrl/${downloadFileName}`, {
        responseType: 'text',
      });

      console.log(response_src);
      setDownloadedVideoUrl(response_src.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{marginTop:'100px'}}>
      <form
        className='download-form'
        onSubmit={downloadHandleSubmit}
      >
        <input
          placeholder='여기다가 PK 입력'
          value={downloadFileName}
          onChange={downHandleChange}
          required
        />
        <button type='submit'>다운로드</button>
      </form>

      <br/>

      <form
        className='upload-form'
        onSubmit={uploadHandleSubmit}
        id='tt'
      >
        <input
          type='file'
          placeholder='비디오 고르기'
          value={uploadFileName}
          onChange={uploadHandleChange}
          required
          accept='video/*'
        />
        <button type='submit'>업로드</button>

        <br/>

        <input
          type='text'
          name='title'
          placeholder='제목'
          value={uploadTitle}
          onChange={uploadTitleChange}
          required
        ></input>

        <br/>

        <textarea
          name='content'
          placeholder='내용'
          value={uploadContent}
          onChange={uploadContentChange}
          required
        ></textarea>
      </form>

      <br/>

      <form
        className='img-form'
        onSubmit={uploadProfileSubmit}
      >
        <input
          type='file'
          placeholder='이미지'
          value={uploadProfileName}
          onChange={uploadHandleProfile}
          accept='.jpg, .jpeg, .png'
          required
        ></input>
        <button type='submit'>프로필 업로드</button>
      </form>

      {downloadedVideoUrl && (
        <video
          src={downloadedVideoUrl}
          controls
          width='640'
          height='480'
        />
      )}
      <div>
        <button onClick={getUrlApi}>가져오기!</button>
      </div>
    </div>
  );
};

export default PoseEstimator;
