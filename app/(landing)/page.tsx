import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="mb-8 text-4xl font-bold">Welcome</h1>
      <div className="flex flex-col items-center space-y-4">
        {/* Changed to flex-col, items-center and space-y-4 for vertical spacing and centering */}
        <Link href="/dashboard">
          <Button>Enter Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
