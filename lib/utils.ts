import { BoardType } from './types';

export const createEmptyBoard = (size: number): BoardType => {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      value: 0,
      revealed: false,
      flagged: false,
    }))
  );
};

export const placeMines = (board: BoardType, numMines: number): BoardType => {
  const size = board.length;
  let placed = 0;
  while (placed < numMines) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    if (board[row][col].value !== '💣') {
      board[row][col].value = '💣';
      placed++;
    }
  }
  return board;
};

export const calculateAdjacents = (board: BoardType): BoardType => {
  const size = board.length;
  const dirs = [-1, 0, 1];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col].value === '💣') continue;

      let count = 0;
      dirs.forEach(dy => {
        dirs.forEach(dx => {
          if (dy === 0 && dx === 0) return;
          const r = row + dy;
          const c = col + dx;
          if (r >= 0 && r < size && c >= 0 && c < size && board[r][c].value === '💣') {
            count++;
          }
        });
      });
      board[row][col].value = count;
    }
  }
  return board;
};

export const revealCellRecursive = (board: BoardType, row: number, col: number): BoardType => {
  const size = board.length;
  const stack = [[row, col]];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    const key = `${r}-${c}`;
    if (visited.has(key)) continue;
    visited.add(key);
    board[r][c].revealed = true;

    if (board[r][c].value === 0) {
      [-1, 0, 1].forEach(dy => {
        [-1, 0, 1].forEach(dx => {
          const nr = r + dy;
          const nc = c + dx;
          if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
            const nextKey = `${nr}-${nc}`;
            if (!visited.has(nextKey) && !board[nr][nc].revealed) {
              stack.push([nr, nc]);
            }
          }
        });
      });
    }
  }

  return board;
};

export const checkWin = (board: BoardType): boolean => {
  for (let row of board) {
    for (let cell of row) {
      if (!cell.revealed && cell.value !== '💣') return false;
    }
  }
  return true;
};
