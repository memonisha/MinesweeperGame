'use client';

import React from 'react';
import { CellType } from '../types';
import './Cell.css';

interface Props {
  cell: CellType;
  onClick: (x: number, y: number) => void;
}

const Cell: React.FC<Props> = ({ cell, onClick }) => {
  const getClass = () => {
    if (cell.isRevealed && cell.isMine) return 'cell revealed bomb';
    if (cell.isRevealed) return 'cell revealed';
    return 'cell';
  };

  return (
    <div className={getClass()} onClick={() => onClick(cell.x, cell.y)}>
      {cell.isRevealed
        ? cell.isMine
          ? '💣'
          : cell.adjacentMines > 0
            ? cell.adjacentMines
            : ''
        : ''}
    </div>
  );
};

export default Cell;
