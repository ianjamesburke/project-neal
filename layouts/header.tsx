"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

  // States
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsAuthChecked(true);
    }
  }, [isLoading]);

  return (
    <header className="flex items-center justify-between h-16">
      <div className="flex justify-center gap-10 w-[64px] h-16 border-r border-neutral-800">
        <Image
          loading="lazy"
          src="/assets/icons/logo.svg"
          alt="Logo"
          width={32}
          height={32}
        />
      </div>
      <div className="">
        <span>File</span>
        <span>Edit</span>
        <span>Resources</span>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex gap-2 text-base font-medium text-right text-white">
          <Image
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d8a793d7610b9154de873802f6f0ca44596cdf510e3968ecafd646a4ed61a7f9?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4.svg"
            alt=""
            className="object-contain shrink-0 self-start aspect-[1.18]"
            width={20}
            height={20}
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

        <Image
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd4368c4193fe4718cfa135c8756b207c6c60327fb1b953e7cc4b74b0e20c21b?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4"
          alt="User avatar"
          className="object-contain shrink-0 rounded-full aspect-square"
          width={40}
          height={40}
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
