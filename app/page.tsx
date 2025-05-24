import React from 'react';
import Board from './components/Board';
import './styles/home.css';

export default function HomePage() {
  return (
    <main className="gradient">
      <h1 className="floating-title">Minesweeper 💣</h1>
      <Board />
    </main>
  );
}
