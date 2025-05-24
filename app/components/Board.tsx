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
  const [clicks, setClicks] = useState(0);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initializeBoard = () => {
    const newBoard = createEmptyBoard(ROWS, COLS);
    placeMines(newBoard, MINES);
    calculateAdjacents(newBoard);
    setBoard(newBoard);
    setGameOver(false);
    setClicks(0);
    setTime(0);
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    initializeBoard();
    const stored = localStorage.getItem('minesweeper-highscore');
    if (stored) setHighScore(parseInt(stored));
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const revealCell = (x: number, y: number) => {
    if (gameOver || board[y][x].isRevealed) return;

    if (!isTimerRunning) setIsTimerRunning(true);

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    const reveal = (x: number, y: number) => {
      const cell = newBoard[y]?.[x];
      if (!cell || cell.isRevealed || cell.isFlagged) return;
      cell.isRevealed = true;

      if (cell.isMine) {
        setGameOver(true);
        bombSound?.play();
        setIsTimerRunning(false);
        return;
      }

      clickSound?.play();
      setClicks(prev => prev + 1);

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

    const allRevealed = newBoard.flat().filter(cell => !cell.isMine && !cell.isRevealed).length === 0;
    if (allRevealed) {
      setGameOver(true);
      setIsTimerRunning(false);
      if (!highScore || clicks < highScore) {
        localStorage.setItem('minesweeper-highscore', String(clicks));
        setHighScore(clicks);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.infoBar}>
        <p>🕒 Time: {formatTime(time)}</p>
        <p>👆 Clicks: {clicks}</p>
        {highScore !== null && <p>🏆 Best Score: {highScore}</p>}
      </div>

      <div className={styles.board}>
        {board.map((row, y) => (
          <div key={y} className={styles.row}>
            {row.map(cell => (
              <Cell key={`${cell.x}-${cell.y}`} cell={cell} onClick={revealCell} />
            ))}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className={styles.overlay}>
          <div>
            <p>{board.flat().some(c => c.isMine && c.isRevealed) ? '💥 Game Over' : '🎉 You Win!'}</p>
            <button className={styles.restartButton} onClick={initializeBoard}>Restart</button>
            <p>⏱️ Final Time: {formatTime(time)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
