// src/PuzzleBoard.js
import { useState } from "react";
import "./PuzzleBoard.css";

const shuffle = (array) => {
  // Implement Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generatePuzzle = () => {
  const arr = Array.from({ length: 16 }, (_, i) => i);
  return shuffle(arr);
};

const isSolvable = (tiles) => {
  // Implement logic to check if the puzzle is solvable
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) inversions++;
    }
  }
  const emptyRow = Math.floor(tiles.indexOf(0) / 4) + 1;
  return (inversions % 2 === 0) === (emptyRow % 2 !== 0);
};

const PuzzleBoard = () => {
  const [tiles, setTiles] = useState(generatePuzzle());
  const [message, setMessage] = useState("");

  const shuffleTiles = () => {
    const shuffledTiles = shuffle([...tiles]);
    setTiles(shuffledTiles);
    setMessage(isSolvable(shuffledTiles) ? "" : "Not solvable");
  };

  const findEmptyTileIndex = (tiles) => tiles.indexOf(0);

  const canMove = (tileIndex, emptyIndex) => {
    const adjacentIndices = [
      emptyIndex - 1,
      emptyIndex + 1,
      emptyIndex - 4,
      emptyIndex + 4,
    ];
    return (
      adjacentIndices.includes(tileIndex) &&
      !(emptyIndex % 4 === 0 && tileIndex === emptyIndex - 1) &&
      !(emptyIndex % 4 === 3 && tileIndex === emptyIndex + 1)
    );
  };

  const handleTileClick = (index) => {
    const emptyIndex = findEmptyTileIndex(tiles);
    if (canMove(index, emptyIndex)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [
        newTiles[index],
        newTiles[emptyIndex],
      ];
      setTiles(newTiles);
      setMessage("");
    }
  };

  const helpMe = () => {
    const emptyIndex = findEmptyTileIndex(tiles);
    const bestMove = findBestMove(tiles, emptyIndex);
    if (bestMove !== -1) {
      handleTileClick(bestMove);
    }
  };

  const manhattanDistance = (index, value) => {
    if (value === 0) return 0; // Ignore the empty tile
    const targetX = (value - 1) % 4;
    const targetY = Math.floor((value - 1) / 4);
    const currentX = index % 4;
    const currentY = Math.floor(index / 4);
    return Math.abs(targetX - currentX) + Math.abs(targetY - currentY);
  };
  
  const calculateTotalManhattanDistance = (tiles) => {
    return tiles.reduce((sum, value, index) => sum + manhattanDistance(index, value), 0);
  };
  
  const findBestMove = (tiles, emptyIndex) => {
    const possibleMoves = [emptyIndex - 1, emptyIndex + 1, emptyIndex - 4, emptyIndex + 4].filter(
      (index) => index >= 0 && index < 16 && canMove(index, emptyIndex)
    );
  
    let bestMove = -1;
    let minDistance = calculateTotalManhattanDistance(tiles);
  
    possibleMoves.forEach((move) => {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[move]] = [newTiles[move], newTiles[emptyIndex]];
      const distance = calculateTotalManhattanDistance(newTiles);
      if (distance < minDistance) {
        minDistance = distance;
        bestMove = move;
      }
    });
  
    return bestMove;
  };

  return (
    <div>
      <div className="puzzle-board">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`tile ${tile === 0 ? "empty" : ""}`}
            onClick={() => handleTileClick(index)}
          >
            {tile !== 0 && tile}
          </div>
        ))}
      </div>
      <button onClick={shuffleTiles}>Shuffle</button>
      <button onClick={helpMe}>Help me</button>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default PuzzleBoard;
