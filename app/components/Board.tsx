// app/components/Board.tsx


"use client";


import React, { useEffect, useState } from 'react';
import Cell from './Cell';
import { BoardType } from '../../lib/types';
import { createEmptyBoard, placeMines, calculateAdjacents } from '../../lib/utils';
import styles from '../styles/Board.module.css';


const ROWS = 9;
const COLS = 9;
const MINES = 10;

const clickSound = typeof Audio !== 'undefined' ? new Audio('/sounds/click.mp3') : null;
const bombSound = typeof Audio !== 'undefined' ? new Audio('/sounds/bomb.mp3') : null;

export default function Board() {
  const [board, setBoard] = useState<BoardType>([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const newBoard = createEmptyBoard(ROWS, COLS);
    placeMines(newBoard, MINES);
    calculateAdjacents(newBoard);
    setBoard(newBoard);
  }, []);

  const revealCell = (x: number, y: number) => {
    if (gameOver || board[y][x].isRevealed) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    const reveal = (x: number, y: number) => {
      const cell = newBoard[y]?.[x];
      if (!cell || cell.isRevealed || cell.isFlagged) return;
      cell.isRevealed = true;

      if (cell.isMine) {
        setGameOver(true);
        bombSound?.play();
        return;
      }

      clickSound?.play();

      if (cell.adjacentMines === 0) {
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx !== 0 || dy !== 0) {
              reveal(x + dx, y + dy);
            }
          }
        }
      }
    };

    reveal(x, y);
    setBoard(newBoard);
  };

  return (
    <div className={styles.board}>
      {board.map((row, y) => (
        <div key={y} className={styles.row}>
          {row.map(cell => (
            <Cell key={`${cell.x}-${cell.y}`} cell={cell} onClick={revealCell} />
          ))}
        </div>
      ))}
      {gameOver && <div className={styles.overlay}>💥 Game Over</div>}
    </div>
  );
}
