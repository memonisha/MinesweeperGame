export type CellType = {
  x: number;
  y: number;
  isMine: boolean;
  adjacentMines: number;
  isRevealed: boolean;
  isFlagged: boolean;
};

export type BoardType = CellType[][];
