"use client";

import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function LandingPageContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useKindeBrowserClient();

  // This useEffect hook is where you would apply logic to check if the user is authenticated or not and set the isLoading state accordingly.
  useEffect(() => {
    setIsLoading(false);
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      {user?.id ? (
        <div className="flex flex-col items-center space-y-4">
          {/* Changed to flex-col, items-center and space-y-4 for vertical spacing and centering */}
          <Link href="/dashboard">
            <Button>Enter Dashboard</Button>
          </Link>
          <LogoutLink>
            <Button>Sign out</Button>
          </LogoutLink>
        </div>
      ) : (
        <div className="flex space-x-4">
          {/* Added flex and space-x-4 for spacing */}
          <LoginLink>
            <Button>Sign in</Button>
          </LoginLink>
        </div>
      )}
    </>
  );
}
