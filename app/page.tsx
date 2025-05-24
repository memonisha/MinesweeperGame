// app/page.tsx

import React from 'react';
import Board from './components/Board';


export default function HomePage() {
  return (
    <main>
      <h1 style={{ textAlign: 'center' }}>Minesweeper</h1>
      <Board />
    </main>
  );
}
