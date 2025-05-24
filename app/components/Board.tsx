// app/components/Board.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
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
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (!gameOver && !gameWon) {
      timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current!);
    }

    return () => clearInterval(timerRef.current!);
  }, [gameOver, gameWon]);

  const initializeGame = () => {
    const newBoard = createEmptyBoard(ROWS, COLS);
    placeMines(newBoard, MINES);
    calculateAdjacents(newBoard);
    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
    setTimer(0);
  };

  const revealCell = (x: number, y: number) => {
    if (gameOver || gameWon || board[y][x].isRevealed) return;

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

    // Win check
    const unrevealed = newBoard.flat().filter(cell => !cell.isRevealed);
    if (unrevealed.length === MINES) {
      setGameWon(true);
      clearInterval(timerRef.current!);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>💣 Minesweeper 💣</h1>
      <p className={styles.timer}>⏱️ Time: {timer}s</p>
      <div className={styles.board}>
        {board.map((row, y) => (
          <div key={y} className={styles.row}>
            {row.map(cell => (
              <Cell key={`${cell.x}-${cell.y}`} cell={cell} onClick={revealCell} />
            ))}
          </div>
        ))}
        {(gameOver || gameWon) && (
          <div className={styles.overlay}>
            <p>{gameOver ? "💥 Game Over!" : "🎉 You Win!"}</p>
            <button onClick={initializeGame}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
}
