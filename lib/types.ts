// lib/types.ts

export type CellState = {
  x: number;
  y: number;
  isRevealed: boolean;
  isMine: boolean;
  adjacentMines: number;
  isFlagged: boolean;
};

export type BoardType = CellState[][];
