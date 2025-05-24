'use client';

import React, { useEffect, useState } from 'react';
import Cell from './components/Cell';
import { BoardType, CellType } from '../lib/types';
import { createEmptyBoard, placeMines, calculateAdjacents, revealCellRecursive, checkWin } from '../lib/utils';
import './globals.css';

const BOARD_SIZE = 10;
const NUM_MINES = 10;

export default function Home() {
  const [board, setBoard] = useState<BoardType>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const emptyBoard = createEmptyBoard(BOARD_SIZE);
    const minedBoard = placeMines(emptyBoard, NUM_MINES);
    const finalBoard = calculateAdjacents(minedBoard);
    setBoard(finalBoard);
    setGameOver(false);
    setGameWon(false);
    setInitialized(false);
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || gameWon) return;

    let newBoard = [...board];
    const cell = newBoard[row][col];
    if (cell.revealed || cell.flagged) return;

    if (!initialized) {
      // Ensure first click isn't a mine
      while (newBoard[row][col].value === '💣') {
        newBoard = calculateAdjacents(placeMines(createEmptyBoard(BOARD_SIZE), NUM_MINES));
      }
      setInitialized(true);
    }

    if (cell.value === '💣') {
      cell.revealed = true;
      setGameOver(true);
    } else {
      newBoard = revealCellRecursive(newBoard, row, col);
    }

    if (checkWin(newBoard)) {
      setGameWon(true);
    }

    setBoard([...newBoard]);
  };

  return (
    <main className="container">
      <h1 className="title">💣 Minesweeper 💣</h1>

      {(gameOver || gameWon) && (
        <div className="status">
          <span className={gameOver ? 'text-danger' : 'text-win'}>
            {gameOver ? '💥 Game Over' : '🎉 You Win!'}
          </span>
          <button className="restart-btn" onClick={resetGame}>Restart</button>
        </div>
      )}

      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </main>
  );
}
