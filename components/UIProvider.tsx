"use client";

import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";

export default function UIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div><KindeProvider>{children}</KindeProvider></div>;
}
