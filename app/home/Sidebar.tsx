'use client';

import React from 'react';

interface SidebarItem {
  icon: string;
  label: string;
  isActive?: boolean;
}

const sidebarItems: SidebarItem[] = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/b19a8069d876a396171ab6f6849984dea35cddc7e84c27b518a0ec5503ae3551?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4", label: "Splice AI" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/34496a86a8cf3052ba3e1fef96730cf3dbcf95b15f4af88b9e407c2de97dd72c?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4", label: "Script" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a654b68040ca825cb62c3b0262672b74f2998cd4bcc1494d20eb545bfb97779d?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4", label: "Audio" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/5a1550be22987c625e6473afdb1519f6a3316fddc66336520d5d3b8a269b0f84?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4", label: "Format" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/e0f5e326ee7d005ac6daeed9d35d19f2e1d6fbce308261d0a697e6a03994ee23?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4", label: "Brand" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/58c017e5dfcd92a3e7dc0d3bcab14b31eff3583d6694455fa83cd71363389e00?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4", label: "Uploads" },
];

const Sidebar: React.FC = () => {
  return (
    <nav className="flex flex-col w-24 items-center text-xs font-medium text-center text-white text-opacity-60 max-md:hidden h-full py-4">
      <div className="flex flex-col items-center space-y-4 flex-grow overflow-y-auto">
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            className={`flex flex-col items-center bg-transparent border-none`}
            onClick={() => {/* Add click handler here */}}
          >
            {item.isActive ? (
              <div className="flex shrink-0 w-6 h-6 rounded-lg border-2 border-solid border-white border-opacity-40" />
            ) : (
              <img loading="lazy" src={item.icon} alt="" className="object-contain w-5 aspect-square" />
            )}
            <div className="mt-2">{item.label}</div>
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center space-y-4 pb-4">
        <button
          className="flex flex-col items-center bg-transparent border-none"
          onClick={() => {/* Add click handler for settings */}}
        >
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/a9ed9f5c6549501149f34fba36d5b112c59210bf00f9066a4163be4881ef0191?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4" alt="" className="object-contain aspect-[0.9] w-[18px]" />
          <div className="mt-1 text-white">Settings</div>
        </button>

        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/e4e43d7d8ae441c14ad5fe0c05555f7cfcf67e54bf71adcacce0a88081e5da8c?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4" alt="" className="object-contain w-8 aspect-square mb-2" />
      </div>
    </nav>
  );
};

export default Sidebar;