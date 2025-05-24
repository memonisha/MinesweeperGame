// app/layout.tsx

import '@/app/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
export const metadata = {
  title: 'Minesweeper 💣',
  description: 'A simple Minesweeper game for fun !!!!',
};