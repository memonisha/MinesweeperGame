// app/components/Cell.tsx
"use client";

import React from 'react';
import { CellState } from '../../lib/types';
import styles from '../styles/Board.module.css';


type Props = {
  cell: CellState;
  onClick: (x: number, y: number) => void;
};

export default function Cell({ cell, onClick }: Props) {
  const handleClick = () => {
    onClick(cell.x, cell.y);
  };

  const getDisplay = () => {
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.adjacentMines > 0) return cell.adjacentMines;
    return '';
  };

  return (
    <div
      className={`${styles.cell} ${cell.isRevealed ? styles.revealed : ''}`}
      onClick={handleClick}
    >
      {getDisplay()}
    </div>
  );
}
