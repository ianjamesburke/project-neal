import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const { isAuthenticated } = getKindeServerSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      {(await isAuthenticated()) ? (
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
    </div>
  );
}
