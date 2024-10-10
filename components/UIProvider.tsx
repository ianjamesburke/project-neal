"use client";

import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserData {
  user_id: number | undefined;
  video_url: string | undefined;
}

// Update the context type
export const UserDataContext = createContext<{
  data: UserData;
  setData: Dispatch<SetStateAction<UserData>>;
}>({
  data: { user_id: undefined, video_url: undefined },
  setData: () => {},
});

const UIProvider = ({ children }: { children: React.ReactNode }) => {
  /** State to store the data fetched from the database */
  const [data, setData] = useState<UserData>({
    user_id: undefined,
    video_url: undefined,
  });

  /** grabs data from database */
  const getData = async () => {
    const response = await fetch("/api/db", { method: "GET" });
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      console.error("Error fetching data");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await getData();
        setData(rawData);
      } catch (error) {
        console.error("Error fetching or parsing data:", error);
        // Handle the error appropriately (e.g., set an error state)
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <KindeProvider>
        <UserDataContext.Provider value={{ data, setData }}>
          {children}
        </UserDataContext.Provider>
      </KindeProvider>
    </div>
  );
};

/** This lets other child components to set the edited files subdirectory folder */
export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a userDataProvider");
  }
  return context;
}

export default UIProvider;
