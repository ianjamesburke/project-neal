"use client";

import { Button } from "@/components/ui/button";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function TestPage() {
  const { user, getUser } = useKindeBrowserClient();
  const alsoUser = getUser();
  console.log(user);
  console.log(user?.id);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-y-5">
      <div className="flex flex-col items-center justify-center w-full gap-y-5">
        <div className="flex flex-col items-center justify-center">
          <LoginLink>
            <Button>Log In</Button>
          </LoginLink>
          <LogoutLink>
            <Button>Log Out</Button>
          </LogoutLink>
        </div>
        <h2 className="text-lg font-bold mb-4">User Data</h2>
        {user ? (
          <pre>{JSON.stringify(user, null, 2)}</pre>
        ) : (
          <p>No user logged in</p>
        )}
      </div>
    </div>
  );
}
