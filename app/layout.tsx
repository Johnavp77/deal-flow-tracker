import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Deal Flow Tracker',
  description: 'Track your deals efficiently'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
