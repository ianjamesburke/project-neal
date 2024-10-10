"use client";

import { SIDEBAR_ITEMS } from "@/lib/constants/sidebar-items";
import { cn } from "@/lib/utils/cn";

import Image from "next/image";

export async function Sidebar() {
  const active = "Splice AI";
  return (
    <aside className="flex flex-col  w-16 border-r border-neutral-800 items-center text-xs font-medium text-center text-white text-opacity-60 max-md:hidden h-full">
      <nav>
        <ul className="flex flex-col items-center flex-grow overflow-y-auto">
          {SIDEBAR_ITEMS.map((item, index) => {
            return (
              <li key={index}>
                <button
                  className={cn(
                    `flex flex-col border-r group border-neutral-800 gap-1.5 h-16 w-16 p-3 items-center whitespace-nowrap transition-colors overflow-hidden`,
                    "hover:bg-dark-800 hover:border-neutral-800 ",
                    active === item.label && "!bg-dark-700 !border-neutral-800 "
                  )}
                  onClick={() => {
                    /* Add click handler here */
                  }}
                >
                  <Image
                    src={item.icon}
                    alt={item.icon}
                    width={20}
                    height={20}
                    className="invert opacity-40 group-hover:opacity-100"
                  />
                  <span className="text-[10px] group-hover:text-white">
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col items-center space-y-4 pb-8 px-3">
        <button
          className="flex flex-col gap-1.5 items-center bg-transparent border-none"
          onClick={() => {
            /* Add click handler for settings */
          }}
        >
          <Image
            loading="lazy"
            src="/assets/icons/settings.svg"
            className="invert cursor-pointer"
            alt="Settings"
            width={20}
            height={20}
          />
          <div className="text-white text-[10px]">Settings</div>
        </button>

        <div className="bg-purple p-3 rounded-full">
          <Image
            loading="lazy"
            src="/assets/icons/faq.svg"
            alt="FAQ"
            className="invert cursor-pointer"
            width={20}
            height={20}
          />
        </div>
      </div>
    </aside>
  );
}
