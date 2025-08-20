import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Deal Flow Tracker',
  description: 'Track your deals efficiently'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    
<html lang="en">
    <body className="flex">
        <aside className="w-64 min-h-screen bg-gray-100 p-4">
      <nav className="space-y-2">
        <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-200">Dashboard</a>
        <a href="/deals" className="block px-3 py-2 rounded hover:bg-gray-200">Deals</a>
        <a href="/documents" className="block px-3 py-2 rounded hover:bg-gray-200">Documents</a>
        <a href="/map" className="block px-3 py-2 rounded hover:bg-gray-200">Map</a>
      </nav>
    </aside>
    <main className="flex-1">{children}</main>
  </body>
</html
      );
}
