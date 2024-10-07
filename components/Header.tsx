"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsAuthChecked(true);
    }
  }, [isLoading]);

  return (
    <header className="flex items-center justify-between w-full h-8 my-4">
      <div className="flex items-center gap-10 mx-8">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/dc4cb80a02a243578c9954e82786edefd12c5ff04884d7847e26ef6f467d0be6?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4"
          alt="Logo"
          className="w-auto h-8"
        />
      </div>
      <div className="flex items-center gap-8">
        <div className="flex gap-2 text-base font-medium text-right text-white">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d8a793d7610b9154de873802f6f0ca44596cdf510e3968ecafd646a4ed61a7f9?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4"
            alt=""
            className="object-contain shrink-0 self-start w-5 aspect-[1.18]"
          />
          <div className="basis-auto">
            <span className="text-white">Project Title /</span> File Name
          </div>
        </div>

        <div className="flex items-center gap-4 text-white">
          {isAuthChecked && isAuthenticated ? (
            <span>Hello {user?.given_name}</span>
          ) : (
            <span>THIS IS A TEST MESSAGE</span>
          )}
        </div>

        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd4368c4193fe4718cfa135c8756b207c6c60327fb1b953e7cc4b74b0e20c21b?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4"
          alt="User avatar"
          className="object-contain shrink-0 w-10 rounded-full aspect-square"
        />
        <div className="flex items-center gap-4 mx-4">
          <Button variant="secondary">Projects</Button>
          <Button variant="share">
            <Share size="icon" className="h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </header>
  );
}
