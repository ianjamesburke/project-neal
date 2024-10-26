import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import React from "react";

export default function SpliceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-950">
      <Sidebar />
      <div className="flex w-full flex-col">
        <Header />
        <main className="max-lg:hidden">{children}</main>
        <div className="flex items-center justify-center lg:hidden">
          <h1 className="mx-24 text-center text-white">
            {
              "We're sorry, but our app is currently not optimized for mobile. Please come back and visit us on a desktop."
            }
          </h1>
        </div>
      </div>
    </div>
  );
}
