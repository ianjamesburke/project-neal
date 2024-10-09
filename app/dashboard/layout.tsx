"use client";

import Header from "@/layouts/header";
import Sidebar from "@/layouts/sidebar";
import React from "react";

export default function SpliceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-950">
      <Header />
      <div className="h-px border-b border-neutral-800" />
      <div className="flex flex-grow overflow-hidden">
        <Sidebar />
        <main className="flex-grow overflow-auto p-6 hidden md:block">
          {children}
        </main>
        <div className="flex-grow flex items-center justify-center md:hidden">
          <h1 className="text-center text-white mx-24">
            {" "}
            We're sorry, but our app is currently not optimized for mobile.
            Please come back and visit us on a desktop.
          </h1>
        </div>
      </div>
    </div>
  );
}
