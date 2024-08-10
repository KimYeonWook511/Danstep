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
import './MyPage.css';

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
    <div style={{ display: 'flex', width: '1200px', height: '600px' }}>
      {/* {data ? <p>Data received: {JSON.stringify(data)}</p> : <p>Loading data...</p>} */}
      {chartData && <Line data={chartData} />}

      <div
        className='red-neon red'
        style={{
          display: 'flex',
          width: '90%',
          height: '90%',
          backgroundColor: 'black',
          padding: '50px',
          margin: '50px',
          borderRadius: '5%',
          borderWidth: '1px',
          borderColor: 'black',
          border: 'none',
        }}
      >
        {/* 마이페이지 좌측 nav */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '30%',
            height: '100%',
            marginRight: '10px',
            margin: 'auto',
          }}
        >
          <div
            style={{
              height: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              margin: 'auto',
            }}
          >
            <div
              style={{
                color: 'black',
                width: '100px',
                height: '100px',
                backgroundColor: 'brown',
                textAlign: 'center',
                alignContent: 'center',
                marginTop: '15%',
                borderRadius: '50%',
              }}
            ></div>
            <div
              className='red-neon animated-text red'
              style={{
                fontFamily: 'neon-number',
                color: 'yellow',
                height: '10%',
                marginTop: '5%',
                alignContent: 'center',
                fontSize: '50px',
              }}
            >
              user_132
            </div>
          </div>
          <div
            style={{
              height: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: '5%',
              paddingBottom: '5%',
              color: 'white',
            }}
          >
            <div
              style={{
                color: 'white',
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
                color: 'white',
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
                color: 'white',
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
          className='white-neon'
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '70%',
            height: '100%',
            marginLeft: '30px',
            padding: '30px',
            borderRadius: '5%',
            backgroundColor: 'white',
            overflow: 'auto',
            scrollbarWidth: '-moz-initial',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ width: '100%', height: '100%' }}>
            {/* <select>
              <option>최근 플레이</option>
              <option>티라미수케잌</option>
              <option>슈퍼노바</option>
              <option>알파노바</option>
              <option>베타노바</option>
            </select>
            <hr style={{ marginTop: '10px', marginBottom: '10px' }}></hr>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <video
                  src='background.mp4'
                  style={{
                    width: '30%',
                    height: '100%',
                    backgroundColor: 'gray',
                    borderRadius: '15%',
                  }}
                ></video>
                <video
                  src='background.mp4'
                  style={{
                    width: '30%',
                    height: '100%',
                    backgroundColor: 'gray',
                    borderRadius: '15%',
                  }}
                ></video>
                <video
                  src='background.mp4'
                  style={{
                    width: '30%',
                    height: '100%',
                    backgroundColor: 'gray',
                    borderRadius: '15%',
                  }}
                ></video>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <video
                  src='background.mp4'
                  style={{
                    width: '30%',
                    height: '100%',
                    backgroundColor: 'gray',
                    borderRadius: '15%',
                  }}
                ></video>
                <video
                  src='background.mp4'
                  style={{
                    width: '30%',
                    height: '100%',
                    backgroundColor: 'gray',
                    borderRadius: '15%',
                  }}
                ></video>
                <video
                  src='background.mp4'
                  style={{
                    width: '30%',
                    height: '100%',
                    backgroundColor: 'gray',
                    borderRadius: '15%',
                  }}
                ></video>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <video
                  src='background.mp4'
                  style={{
                    width: '30%',
                    height: '100%',
                    backgroundColor: 'gray',
                    borderRadius: '15%',
                  }}
                ></video>
                <video
                  src='background.mp4'
                  style={{
                    width: '30%',
                    height: '100%',
                    backgroundColor: 'gray',
                    borderRadius: '15%',
                  }}
                ></video>
                <video
                  src='background.mp4'
                  style={{
                    width: '30%',
                    height: '100%',
                    backgroundColor: 'gray',
                    borderRadius: '15%',
                  }}
                ></video>
              </div>
            </div> */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
              <p style={{ width: '25%' }}>제목</p>
              <p style={{ width: '25%' }}>점수</p>
              <p style={{ width: '25%' }}>플레이한 날짜</p>
              <button style={{ width: '25%' }}>다운로드</button>
            </div>
            <hr style={{ marginTop: '10px', marginBottom: '20px' }}></hr>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              <p style={{ width: '25%' }}>와 랭킹 1위</p>
              <p style={{ width: '25%' }}>99</p>
              <p style={{ width: '25%' }}>2024/08/09</p>
              <button style={{ width: '25%' }}>다운로드</button>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              <p style={{ width: '25%' }}>와 랭킹 1위</p>
              <p style={{ width: '25%' }}>99</p>
              <p style={{ width: '25%' }}>2024/08/09</p>
              <button style={{ width: '25%' }}>다운로드</button>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              <p style={{ width: '25%' }}>와 랭킹 1위</p>
              <p style={{ width: '25%' }}>99</p>
              <p style={{ width: '25%' }}>2024/08/09</p>
              <button style={{ width: '25%' }}>다운로드</button>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              <p style={{ width: '25%' }}>와 랭킹 1위</p>
              <p style={{ width: '25%' }}>99</p>
              <p style={{ width: '25%' }}>2024/08/09</p>
              <button style={{ width: '25%' }}>다운로드</button>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              <p style={{ width: '25%' }}>와 랭킹 1위</p>
              <p style={{ width: '25%' }}>99</p>
              <p style={{ width: '25%' }}>2024/08/09</p>
              <button style={{ width: '25%' }}>다운로드</button>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              <p style={{ width: '25%' }}>와 랭킹 1위</p>
              <p style={{ width: '25%' }}>99</p>
              <p style={{ width: '25%' }}>2024/08/09</p>
              <button style={{ width: '25%' }}>다운로드</button>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              <p style={{ width: '25%' }}>와 랭킹 1위</p>
              <p style={{ width: '25%' }}>99</p>
              <p style={{ width: '25%' }}>2024/08/09</p>
              <button style={{ width: '25%' }}>다운로드</button>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              <p style={{ width: '25%' }}>와 랭킹 1위</p>
              <p style={{ width: '25%' }}>99</p>
              <p style={{ width: '25%' }}>2024/08/09</p>
              <button style={{ width: '25%' }}>다운로드</button>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              <p style={{ width: '25%' }}>와 랭킹 1위</p>
              <p style={{ width: '25%' }}>99</p>
              <p style={{ width: '25%' }}>2024/08/09</p>
              <button style={{ width: '25%' }}>다운로드</button>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              <p style={{ width: '25%' }}>와 랭킹 1위</p>
              <p style={{ width: '25%' }}>99</p>
              <p style={{ width: '25%' }}>2024/08/09</p>
              <button style={{ width: '25%' }}>다운로드</button>
            </div>
          </div>
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
