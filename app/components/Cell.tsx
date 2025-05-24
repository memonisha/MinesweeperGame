'use client';

import React from 'react';
import { CellType } from '../../lib/types';

interface Props {
  cell: CellType;
  onClick: () => void;
}

const Cell: React.FC<Props> = ({ cell, onClick }) => {
  const getClass = () => {
    if (cell.revealed) return 'cell revealed';
    return 'cell';
  };

  return (
    <div className={getClass()} onClick={onClick}>
      {cell.revealed && cell.value !== 0 ? cell.value : ''}
    </div>
  );
};

export default Cell;
