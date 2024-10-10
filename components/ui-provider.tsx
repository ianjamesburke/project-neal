"use client";

import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useState } from "react";

interface Data {
  // Define the data structure here
}

export default function UIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /** State to store the data fetched from the database */
  const [data, setData] = useState<Data | undefined>(undefined);
  /** grabs data from database */
  const getData = async () => {
    const response = await fetch("/api/db", { method: "GET" });
    if (response.ok) {
      const result = await response.json();
      return result;

      // do something with the data
      // This is where you would store the data in a state and pass it down to the children using react hooks
    } else {
      console.error("Error fetching data");
    }
  };

  useEffect(() => {
    // This react hook makes sure the data fetched into managed state stays synced with the page rendering
    // The dependency is currently set to initial render only
    setData(getData());
  }, []);

  return (
    <div>
      <KindeProvider>{children}</KindeProvider>
    </div>
  );
}
