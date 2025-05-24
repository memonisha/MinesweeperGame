// app/game/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import BoardComponent from '../../components/Board';
import { Board } from '../../lib/types';   
import { createEmptyBoard, placeMines, revealCell } from '../../lib/utils';


const ROWS = 8;
const COLS = 8;
const MINES = 10;

export default function GamePage() {
  const [board, setBoard] = useState<Board>([]);

  useEffect(() => {
    let newBoard = createEmptyBoard(ROWS, COLS);
    newBoard = placeMines(newBoard, MINES);
    setBoard(newBoard);
  }, []);

  const handleCellClick = (row: number, col: number) => {
    const updatedBoard = revealCell(board, row, col);
    setBoard(updatedBoard);
  };

  return (
    <div>
      <h1>Minesweeper</h1>
      <BoardComponent board={board} onCellClick={handleCellClick} />
    </div>
  );
}
