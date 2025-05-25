import React from 'react';
import Cell from './Cell';
import { BoardType } from '@/lib/types'; // adjust if needed
import styles from '../styles/Board.module.css';

type BoardProps = {
  board: BoardType;
  onCellClick: (row: number, col: number) => void;
};

const BoardComponent: React.FC<BoardProps> = ({ board, onCellClick }) => {
  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((cell) => (
            <Cell
              key={`${cell.x}-${cell.y}`}
              cell={cell}
              onClick={() => onCellClick(cell.x, cell.y)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default BoardComponent;
