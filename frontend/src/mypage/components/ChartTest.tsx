import React, { useEffect, useState } from 'react';
import { receiveScores } from '../utils/mypageAxios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chart.js/auto'; // Ensure Chart.js is registered
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartTest: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await receiveScores();
        setData(result);
        console.log(result);

        // Extracting health values and creating labels
        const labels = result.map((item: any, index: number) => `Point ${index + 1}`);
        const values = result.map((item: any) => item.health);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Health Scores',
              data: values,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* {data ? <p>Data received: {JSON.stringify(data)}</p> : <p>Loading data...</p>} */}
      {chartData && <Line data={chartData} />}

      <div
        style={{
          display: 'flex',
          width: '100vw',
          height: '45vw',
          backgroundColor: 'black',
          padding: '50px',
        }}
      >
        {/* 마이페이지 좌측 nav */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '30%',
            height: '100%',
            backgroundColor: 'white',
            marginRight: '10px',
          }}
        >
          <div
            style={{
              height: '50%',
              backgroundColor: 'red',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '5%',
            }}
          >
            <div
              style={{
                color: 'black',
                width: '50%',
                height: '50%',
                backgroundColor: 'brown',
                textAlign: 'center',
                alignContent: 'center',
                marginTop: '15%',
              }}
            >
              여긴 프로필 이미지
            </div>
            <div style={{ color: 'black', width: '50%', height: '10%', backgroundColor: 'darkviolet' }}>yun090405</div>
          </div>
          <div
            style={{
              height: '50%',
              backgroundColor: 'fuchsia',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: '5%',
              paddingTop: '5%',
              paddingBottom: '5%',
            }}
          >
            <div
              style={{
                backgroundColor: 'blue',
                color: 'black',
                height: '50%',
                width: '50%',
                textAlign: 'center',
                alignContent: 'center',
                margin: '5px',
              }}
            >
              플레이 영상
            </div>
            <div
              style={{
                backgroundColor: 'red',
                color: 'black',
                height: '50%',
                width: '50%',
                textAlign: 'center',
                alignContent: 'center',
                margin: '5px',
              }}
            >
              프로필 수정
            </div>
            <div
              style={{
                backgroundColor: 'violet',
                color: 'black',
                height: '50%',
                width: '50%',
                textAlign: 'center',
                alignContent: 'center',
                margin: '5px',
              }}
            >
              이메일 문의
            </div>
            <div
              style={{
                backgroundColor: 'green',
                color: 'black',
                height: '50%',
                width: '50%',
                textAlign: 'center',
                alignContent: 'center',
                margin: '5px',
              }}
            >
              로그아웃
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '70%',
            height: '100%',
            backgroundColor: 'gray',
            marginLeft: '10px',
          }}
        >
          <div style={{ color: 'black' }}>프로필</div>
          <div style={{ color: 'black' }}>위 아래 구분선</div>
          <div style={{ color: 'black' }}>SELECT 버튼</div>
          <div style={{ color: 'black' }}>졸립니다</div>
          <div style={{ color: 'black' }}>졸립니다</div>
          <div style={{ color: 'black' }}>졸립니다</div>
          <div style={{ color: 'black' }}>졸립니다</div>
          <div style={{ color: 'black' }}>졸립니다</div>
          <div style={{ color: 'black' }}>졸립니다</div>
        </div>
      </div>
      {/* <button
        onClick={async () => {
          console.log('실행');

          try {
            const response = await axios.get('https://i11a406.p.ssafy.io/api/v1/games/1');
            console.log(response);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        버어튼
      </button> */}
    </div>
  );
};

export default ChartTest;
