"use client";

import { Button } from "@/components/ui/button";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { InteractiveButton } from "@/components/InteractiveButton";

export default function TestPage() {
  const { user, getUser } = useKindeBrowserClient();
  const alsoUser = getUser();
  console.log(user);
  console.log(user?.id);

  const [data, setData] = useState({ key: "value" }); // Example data to send

  const updateDatabase = async () => {
    try {
      const response = await fetch("/api/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Database update result:", result);
    } catch (error) {
      console.error("Error updating database:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-y-5">
      <div className="flex flex-col items-center justify-center w-full gap-y-5">
        <div className="flex flex-col items-center justify-center">
          <button onClick={updateDatabase} className="bg-blue-500 text-white p-2 rounded">
            Update Database
          </button>
          <LoginLink>
            <Button>Log In</Button>
          </LoginLink>
          <LogoutLink>
            <Button>Log Out</Button>
          </LogoutLink>
          <InteractiveButton />
        </div>
        <h2 className="text-lg font-bold mb-4">User Data</h2>
        {user ? (
          <pre>{JSON.stringify(user, null, 2)}</pre>
        ) : (
          <p>No user logged in</p>
        )}
        <h2 className="text-lg font-bold mb-4">Database User Data</h2>
        <button
          onClick={async () => {
            try {
              const response = await fetch("/api/db/", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              const result = await response.json();
              console.log("Fetched user data from database:", result);
              alert(JSON.stringify(result, null, 2));
            } catch (error) {
              console.error("Error fetching user data from database:", error);
            }
          }}
          className="bg-green-500 text-white p-2 rounded"
        >
          Fetch User Data
        </button>
      </div>
    </div>
  );
}
