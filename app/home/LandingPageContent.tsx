"use client";

import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";

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
        <LogoutLink className="text-blue-500 hover:underline">
          Sign out
        </LogoutLink>
      ) : (
        <LoginLink className="text-blue-500 hover:underline">Sign in</LoginLink>
      )}
    </>
  );
}
