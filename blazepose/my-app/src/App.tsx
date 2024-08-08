import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import Ranking from './components/Ranking';
import Neon from './GameMode/neon/Neon';
import GamePage from './components/GamePage';
import Loading from './components/Loading';
import './fonts/font.css';

const App: React.FC = () => {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/neon" element={<Neon />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
};

export default App;
