import React, { useState, useEffect } from 'react';
import './MainPage.css';
import Example from "./example";
import SearchBar from './SearchBar';
import SearchResult from './SearchResult';

// 이미지 파일을 동적으로 가져오는 설정
// const imageModules = import.meta.glob('../assets/images/*.{jpg,jpeg,png,gif}');

interface Game {
  id: number;
  name: string;
  difficulty: number;
}

const MainPage: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const games: Game[] = [
    { id: 1, name: 'Game A', difficulty: 3 },
    { id: 2, name: 'Game B', difficulty: 1 },
    { id: 3, name: 'Game C', difficulty: 2 },
    { id: 4, name: 'Game D', difficulty: 4 },
  ];

  // useEffect(() => {
  //   const loadImages = async () => {
  //     const loadedImages = await Promise.all(
  //       Object.values(imageModules).map(async (module: any) => {
  //         const mod = await module();
  //         return mod.default;
  //       })
  //     );
  //     setImages(loadedImages);
  //   };

  //   loadImages();
  // }, []);

  return (
    <div className="image-grid">
      {/* {images.map((src, index) => (
        <img key={index} src={src} alt={`Image ${index}`} className="image-item" />
      ))} */}
      <Example />
      <SearchBar />
      <SearchResult games={games} />
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
      <div>test</div>
    </div>
  );
};

export default MainPage;
