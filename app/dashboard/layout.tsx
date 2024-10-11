import { Header } from "@/layouts/header";
import { Sidebar } from "@/layouts/sidebar";
import React from "react";

export default function SpliceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col  overflow-hidden  bg-neutral-950">
      <Header />
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1">
          <main className="hidden grow md:block">{children}</main>
          <div className="flex grow items-center justify-center md:hidden">
            <h1 className="mx-24 text-center text-white">
              {
                "We're sorry, but our app is currently not optimized for mobile. Please come back and visit us on a desktop."
              }
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
