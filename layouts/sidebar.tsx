"use client";

import { SIDEBAR_ITEMS } from "@/lib/constants/sidebar-items";
import { useSidebarStore } from "@/lib/store/sidebar-store";
import { SidebarItem } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { Menu } from "lucide-react";

import Image from "next/image";

export function Sidebar() {
  const { setMode, mode } = useSidebarStore();

  const onClickItem = (label: SidebarItem["label"]) => {
    setMode(label);
  };

  return (
    <aside className="flex h-full w-16 flex-col items-center border-r border-neutral-800 text-center text-xs font-medium text-white text-opacity-60 max-md:hidden">
      <nav>
        <ul className="flex grow flex-col items-center overflow-y-auto">
          <div className="flex h-16 min-w-[64px] items-center justify-center gap-10 border-r border-neutral-800">
            {/* <Image
          loading="lazy"
          src="/assets/icons/logo.svg"
          alt="Logo"
          width={32}
          height={32}
        /> */}

            <Menu className="h-6 w-6 text-white" />
          </div>
          {SIDEBAR_ITEMS.map((item, index) => {
            return (
              <li key={index}>
                <button
                  onClick={() => {
                    if (!item.locked) {
                      onClickItem(item.label);
                    }
                  }}
                  className={cn(
                    `group flex h-16 w-16 flex-col items-center gap-1.5 overflow-hidden whitespace-nowrap border-r border-neutral-800 p-3 transition-all`,
                    !item.locked &&
                      "group-hover:text-white hover:border-neutral-800 hover:bg-dark-800",
                    item.locked && "cursor-default",
                    mode === item.label && "!border-neutral-800 !bg-dark-700"
                  )}
                >
                  <Image
                    src={
                      item.locked ? "/assets/icons/lockkeyhole.svg" : item.icon
                    }
                    alt={item.icon}
                    width={24}
                    height={24}
                    className={cn(
                      "opacity-40 invert  transition-all",
                      mode === item.label && !item.locked && "opacity-100 ",
                      !item.locked && "group-hover:opacity-100"
                    )}
                  />

                  <span
                    className={cn(
                      "text-[10px] ",
                      !item.locked && "group-hover:text-white transition-all",
                      mode === item.label && "text-white"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col items-center space-y-4 px-3 pb-8 ">
        <button className="group flex flex-col items-center gap-1.5 border-none bg-transparent transition-all">
          <Image
            loading="lazy"
            src="/assets/icons/settings.svg"
            className="cursor-pointer opacity-40 invert transition-all  group-hover:opacity-100"
            alt="Settings"
            width={24}
            height={24}
          />
          <div className="text-[10px] transition-all group-hover:text-white">
            Settings
          </div>
        </button>

        <div className="h-10 w-10 rounded-full bg-purple p-3">
          <Image
            loading="lazy"
            src="/assets/icons/faq.svg"
            alt="FAQ"
            className="cursor-pointer invert "
            width={16}
            height={16}
          />
        </div>
      </div>
    </aside>
  );
}
