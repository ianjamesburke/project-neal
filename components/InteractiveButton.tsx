"use client";

import { Button } from "@/components/ui/button";
import { useUserData } from "./UIProvider";

export function InteractiveButton() {
  const { data } = useUserData();
  const handleClick = () => {
    console.log(data);
  };

  return <Button onClick={handleClick}>video_url test</Button>;
}
