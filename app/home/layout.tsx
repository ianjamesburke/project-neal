"use client"

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function SpliceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-950">
      <Header />
      <div className="h-px border-b border-neutral-800" />
      <div className="flex flex-grow overflow-hidden">
        <Sidebar />
        <div className="w-px border-r border-neutral-800" />
        <main className="flex-grow overflow-auto p-6 hidden md:block">
          {children}
        </main>
        <div className="flex-grow flex items-center justify-center md:hidden">
          <h1 className="text-center text-white mx-24"> We're sorry, but our app is currently not optimized for mobile. Please come back and visit us on a desktop.</h1>
        </div>
      </div>
    </div>
  );
}
