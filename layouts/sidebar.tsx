"use client";

import { SIDEBAR_ITEMS } from "@/lib/constants/sidebar-items";
import { cn } from "@/lib/utils/cn";

import Image from "next/image";

export async function Sidebar() {
  const active = "Splice AI";
  return (
    <aside className="flex h-full w-16 flex-col items-center border-r border-neutral-800 text-center text-xs font-medium text-white text-opacity-60 max-md:hidden">
      <nav>
        <ul className="flex grow flex-col items-center overflow-y-auto">
          {SIDEBAR_ITEMS.map((item, index) => {
            return (
              <li key={index}>
                <button
                  className={cn(
                    `group flex h-16 w-16 flex-col items-center gap-1.5 overflow-hidden whitespace-nowrap border-r border-neutral-800 p-3 transition-colors`,
                    "hover:border-neutral-800 hover:bg-dark-800",
                    active === item.label && "!border-neutral-800 !bg-dark-700"
                  )}
                  onClick={() => {
                    /* Add click handler here */
                  }}
                >
                  <Image
                    src={item.icon}
                    alt={item.icon}
                    width={24}
                    height={24}
                    className={cn(
                      "opacity-40 invert group-hover:opacity-100",
                      active === item.label && "opacity-100"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] group-hover:text-white",
                      active === item.label && "text-white"
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

      <div className="mt-auto flex flex-col items-center space-y-4 px-3 pb-8">
        <button
          className="flex flex-col items-center gap-1.5 border-none bg-transparent"
          onClick={() => {
            /* Add click handler for settings */
          }}
        >
          <Image
            loading="lazy"
            src="/assets/icons/settings.svg"
            className="cursor-pointer invert"
            alt="Settings"
            width={24}
            height={24}
          />
          <div className="text-[10px] text-white">Settings</div>
        </button>

        <div className="h-10 w-10 rounded-full bg-purple p-3">
          <Image
            loading="lazy"
            src="/assets/icons/faq.svg"
            alt="FAQ"
            className="cursor-pointer invert"
            width={16}
            height={16}
          />
        </div>
      </div>
    </aside>
  );
}
