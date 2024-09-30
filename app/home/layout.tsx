import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function SpliceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-950">
      <Header />
      <div className="h-px border-b border-neutral-800" />
      <div className="flex flex-grow overflow-hidden">
        <Sidebar />
        <div className="w-px border-r border-neutral-800" />
        <main className="flex-grow overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
