"use client";

import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Button } from "./ui/button";


export default function LandingPageContent() {
  const { isAuthenticated, user } = useKindeAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      {isAuthenticated ? (
        <div className="flex flex-col items-center space-y-4"> {/* Changed to flex-col, items-center and space-y-4 for vertical spacing and centering */}
          <Link href="/dashboard">
            <Button>Enter Dashboard</Button>
          </Link>
          <LogoutLink>
            <Button>Sign out</Button>
          </LogoutLink>
        </div>
      ) : (
        <div className="flex space-x-4"> {/* Added flex and space-x-4 for spacing */}
          <LoginLink>
            <Button>Sign in</Button>
          </LoginLink>
        </div>
      )}
    </>
  );
}
