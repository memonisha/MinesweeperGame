export type CellType = {
  value: number | '💣';
  revealed: boolean;
  flagged: boolean;
};

export type BoardType = CellType[][];
