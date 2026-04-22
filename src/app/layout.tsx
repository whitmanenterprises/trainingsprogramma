import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bewegen — Trainingsprogramma',
  description: 'Knie mobiliteit, houding en balans',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
