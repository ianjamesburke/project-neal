"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DebugPage() {
  // Add client-side fetch function
  const handleSyncAnalysis = async () => {
    console.log("syncing analysis...");
    try {
      const response = await fetch('/api/get-footage-analysis');
      const data = await response.json();
      console.log(data); // For testing
    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="mb-8 text-4xl font-bold">Debug</h1>
      <div className="flex flex-col items-center space-y-4">
        <Button onClick={handleSyncAnalysis}>
          Sync Analysis
        </Button>
        <Link href="/dashboard">
          <Button>Enter Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}