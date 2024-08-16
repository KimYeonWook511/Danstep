import React, { useState, useEffect } from 'react';

interface Game {
  id: number;
  name: string;
  difficulty: number;
}

interface SearchResultProps {
  games: Game[];
}

const SearchResult: React.FC<SearchResultProps> = ({ games = [] }) => {
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');
  const [sortedGames, setSortedGames] = useState<Game[]>([...games]);

  useEffect(() => {
    const sorted = [...games].sort((a, b) => {
      return sortOrder === 'ascending' ? a.difficulty - b.difficulty : b.difficulty - a.difficulty;
    });
    setSortedGames(sorted);
  }, [sortOrder, games]);

  return (
    <div>
      <label htmlFor="difficulty">Sort by difficulty: </label>
      <select
        id="difficulty"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as 'ascending' | 'descending')}
      >
        <option value="ascending">낮은 난이도순</option>
        <option value="descending">높은 난이도순</option>
      </select>
      <ul>
        {sortedGames.map((game) => (
          <li key={game.id}>
            {game.name} - Difficulty: {game.difficulty}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResult;
