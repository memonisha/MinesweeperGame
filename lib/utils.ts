// lib/utils.ts

import { BoardType, CellState } from './types';

export const createEmptyBoard = (rows: number, cols: number): BoardType => {
  return Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x): CellState => ({
      x,
      y,
      isRevealed: false,
      isMine: false,
      adjacentMines: 0,
      isFlagged: false,
    }))
  );
};

export const placeMines = (board: BoardType, mineCount: number): void => {
  let placed = 0;
  const rows = board.length;
  const cols = board[0].length;

  while (placed < mineCount) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    if (!board[y][x].isMine) {
      board[y][x].isMine = true;
      placed++;
    }
  }
};

export const calculateAdjacents = (board: BoardType): void => {
  const directions = [-1, 0, 1];

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      if (board[y][x].isMine) continue;

      let count = 0;
      directions.forEach(dy => {
        directions.forEach(dx => {
          if (dx === 0 && dy === 0) return;
          const ny = y + dy;
          const nx = x + dx;
          if (board[ny]?.[nx]?.isMine) count++;
        });
      });

      board[y][x].adjacentMines = count;
    }
  }
};
