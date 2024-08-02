import React, { Component, ReactNode } from "react";
import Carousel from "react-spring-3d-carousel";
import { v4 as uuidv4 } from "uuid";
import { config } from "react-spring";
import image1 from "../assets/images/1.png";
import image2 from "../assets/images/2.png";
import image3 from "../assets/images/3.png";
import image4 from "../assets/images/4.png";
import image5 from "../assets/images/5.png";
import image6 from "../assets/images/6.png";
import image7 from "../assets/images/7.png";
import image8 from "../assets/images/8.png";
import image9 from "../assets/images/9.png";
import image10 from "../assets/images/10.png";

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
}

export default class Example extends Component<{}, ExampleState> {
  state: ExampleState = {
    goToSlide: 0,
    offsetRadius: 3,
    showNavigation: false,
    config: config.stiff
  };

  slides: Slide[] = [
    {
      key: uuidv4(),
      content: <img src={image1} alt="1" />
    },
    {
      key: uuidv4(),
      content: <img src={image2} alt="2" />
    },
    {
      key: uuidv4(),
      content: <img src={image3} alt="3" />
    },
    {
      key: uuidv4(),
      content: <img src={image4} alt="4" />
    },
    {
      key: uuidv4(),
      content: <img src={image5} alt="5" />
    },
    {
      key: uuidv4(),
      content: <img src={image6} alt="6" />
    },
    {
      key: uuidv4(),
      content: <img src={image7} alt="7" />
    },
    {
      key: uuidv4(),
      content: <img src={image8} alt="8" />
    },
    {
      key: uuidv4(),
      content: <img src={image9} alt="9" />
    },
    {
      key: uuidv4(),
      content: <img src={image10} alt="10" />
    }
  ].map((slide, index) => {
    return { ...slide, onClick: () => this.setState({ goToSlide: index }) };
  });

  // onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   this.setState({
  //     [e.target.name]: parseInt(e.target.value, 10) || 0
  //   });
  // };

  onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState((prevState: ExampleState) => ({
      ...prevState,
      [e.target.name]: parseInt(e.target.value, 10) || 0
    }));
  };
  

  render() {
    return (
      <div style={{ width: "80%", height: "500px", margin: "0 auto" }}>
        <Carousel
          slides={this.slides}
          goToSlide={this.state.goToSlide}
          offsetRadius={this.state.offsetRadius}
          showNavigation={this.state.showNavigation}
          animationConfig={this.state.config}
        />
      </div>
    );
  }
}
