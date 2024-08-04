import React, { Component, ReactNode } from 'react';
import Carousel from 'react-spring-3d-carousel';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'react-spring';
import image1 from '../assets/images/1.png';
import image2 from '../assets/images/2.png';
import image3 from '../assets/images/3.png';
import image4 from '../assets/images/4.png';
import image5 from '../assets/images/5.png';
import image6 from '../assets/images/6.png';
import image7 from '../assets/images/7.png';
import image8 from '../assets/images/8.png';
import image9 from '../assets/images/9.png';
import image10 from '../assets/images/10.png';
import Guide from './Guide';
import PoseEstimator from '../GameMode/components/PoseEstimator';
import ChartTest from '../mypage/components/ChartTest';

interface Slide {
  key: string;
  content: ReactNode;
  onClick: () => void;
}

interface ExampleState {
  goToSlide: number;
  offsetRadius: number;
  showNavigation: boolean;
  config: typeof config.stiff;
  showGuide: boolean; // Guide 컴포넌트를 표시할지 여부를 저장하는 상태 추가
  showPoseEstimator: boolean;
}

export default class Example extends Component<{}, ExampleState> {
  state: ExampleState = {
    goToSlide: 0,
    offsetRadius: 3,
    showNavigation: false,
    config: config.stiff,
    showGuide: false, // 초기 값은 false
    showPoseEstimator: false,
  };

  slides: Slide[] = [
    {
      key: uuidv4(),
      content: <img src={image1} alt="1" />,
      onClick: () => this.setState({ showGuide: true }), // 1번 이미지를 클릭하면 showGuide를 true로 설정
    },
    {
      key: uuidv4(),
      content: <img src={image2} alt="2" />,
      onClick: () => this.setState({ goToSlide: 1 }),
    },
    {
      key: uuidv4(),
      content: <img src={image3} alt="3" />,
      onClick: () => this.setState({ goToSlide: 2 }),
    },
    {
      key: uuidv4(),
      content: <img src={image4} alt="4" />,
      onClick: () => this.setState({ goToSlide: 3 }),
    },
    {
      key: uuidv4(),
      content: <img src={image5} alt="5" />,
      onClick: () => this.setState({ goToSlide: 4 }),
    },
    {
      key: uuidv4(),
      content: <img src={image6} alt="6" />,
      onClick: () => this.setState({ goToSlide: 5 }),
    },
    {
      key: uuidv4(),
      content: <img src={image7} alt="7" />,
      onClick: () => this.setState({ goToSlide: 6 }),
    },
    {
      key: uuidv4(),
      content: <img src={image8} alt="8" />,
      onClick: () => this.setState({ goToSlide: 7 }),
    },
    {
      key: uuidv4(),
      content: <img src={image9} alt="9" />,
      onClick: () => this.setState({ goToSlide: 8 }),
    },
    {
      key: uuidv4(),
      content: <img src={image10} alt="10" />,
      onClick: () => this.setState({ goToSlide: 9 }),
    },
  ];
  // ].map((slide, index) => {
  //   return { ...slide, onClick: () => this.setState({ goToSlide: index }) };
  // });

  // onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   this.setState({
  //     [e.target.name]: parseInt(e.target.value, 10) || 0
  //   });
  // };

  onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState((prevState: ExampleState) => ({
      ...prevState,
      [e.target.name]: parseInt(e.target.value, 10) || 0,
    }));
  };

  // onShowPoseEstimator = () => {
  //   // Pose Estimator를 보여주는 로직을 여기에 추가하세요.
  //   console.log("Showing Pose Estimator");
  // };

  // onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   this.setState({
  //     [e.target.name]: parseInt(e.target.value, 10) || 0
  //   });
  // };

  onShowPoseEstimator = () => {
    this.setState({ showPoseEstimator: true });
  };

  // const [showPoseEstimator, setShowPoseEstimator] = useState(false);

  //   const handleShowPoseEstimator = () => {
  //       setShowPoseEstimator(true);
  //   };

  render() {
    return (
      <div style={{ width: '80%', height: '500px', margin: '0 auto' }}>
        {this.state.showGuide ? (
          //    <div>
          //    {!showPoseEstimator && <Guide onShowPoseEstimator={handleShowPoseEstimator} />}
          //    {showPoseEstimator && <PoseEstimator />}
          //    <h1 className="text-3xl font-bold underline">BlazePose with TensorFlow.js</h1>
          //    <ChartTest />
          //  </div>

          <div>
            {!this.state.showPoseEstimator && (
              <Guide onShowPoseEstimator={this.onShowPoseEstimator} />
            )}
            {this.state.showPoseEstimator && <PoseEstimator />}
            {/* <h1 className="text-3xl font-bold underline">BlazePose with TensorFlow.js</h1> */}
            <ChartTest />
          </div>
        ) : (
          <Carousel
            slides={this.slides}
            goToSlide={this.state.goToSlide}
            offsetRadius={this.state.offsetRadius}
            showNavigation={this.state.showNavigation}
            animationConfig={this.state.config}
          />
        )}
      </div>
    );
  }
}
