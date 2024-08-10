import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Guide from './Guide';
import PoseEstimator from '../GameMode/components/PoseEstimator';

interface Game {
  id: number;
  title : string;
  uploadDate : string;
  playtime : number;
  thumbnailFilename : string;
  auidoFilename : string;
  poseFilename : string;
  videoFilename : string;
  backgroundFilenmae : string;
  level : number;
  thumbnailUrl: string;
  audioUrl : string;
  backgroundUrl : string;
  poseData : object;
}

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the game ID from the URL parameters
  const [game, setGame] = useState<Game | null>(null);
  const [showPoseEstimator, setShowPoseEstimator] = useState(false);

  useEffect(() => {
    // Fetch the game data using the ID from the URL
    const fetchGame = async () => {
      try {
        const response = await axios.get(`https://i11a406.p.ssafy.io/api/v1/games/${id}`);
        setGame(response.data); // Set the fetched game data to the state
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchGame();
  }, [id]); // Dependency array includes `id` to refetch if the ID changes

  const handleShowPoseEstimator = () => {
    setShowPoseEstimator(true);
  };

  return (
    <div>
      <div className='BackgroundVideo'>
        <video
          autoPlay
          loop
          muted
          className='background-video'
        >
          <source
            src={game?.backgroundUrl}
            type='video/mp4'
          />
        </video>
        {!showPoseEstimator && <Guide onShowPoseEstimator={handleShowPoseEstimator} />}
        {showPoseEstimator && game && <PoseEstimator game={game} />} {/* Pass the game data as a prop */}
      </div>
    </div>
  );
};

export default GamePage;
