import React from 'react';

const Timeline: React.FC = () => {
  return (
    <>
      <div className="flex gap-5 justify-between items-center mt-2.5 mr-4 text-xs font-medium text-white whitespace-nowrap max-md:mr-2.5">
        <div className="flex gap-8 self-stretch my-auto">
          <span>00:00</span>
          <span>00:05</span>
          <span>00:10</span>
          <span>00:15</span>
          <span>00:30</span>
          <span>00:35</span>
          <span>00:40</span>
          <span>00:45</span>
          <span>00:50</span>
          <span>00:55</span>
          <span>01:00</span>
        </div>
      </div>
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff8ec43f06abb4bd47592dd853bbfee2ad7c92e3ceee4991ee9b15d0e8860e0b?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4" alt="Video timeline" className="object-contain mt-2.5 rounded-none aspect-[23.26] w-[750px] max-md:max-w-full" />
      <div className="flex flex-wrap gap-1 mt-1 max-md:max-w-full">
        <button aria-label="Toggle audio">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0931d74cf02cde574e1c388ab1bae81dd09b9ff1fcef5f1474c66fea62975221?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4" alt="" className="object-contain shrink-0 w-8 rounded-none aspect-square" />
        </button>
        <div className="flex shrink-0 h-8 rounded-lg bg-neutral-800 w-[51px]"></div>
        <button aria-label="Add audio track" className="flex flex-col justify-center items-start px-2 py-2.5 rounded-lg border border-indigo-400 border-solid bg-indigo-400 bg-opacity-20 max-md:pr-5 max-md:max-w-full">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/cec8a37156bff22674bc0314cbf3700b890805b8f22f1e312b405678fa31c69c?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4" alt="" className="object-contain w-4 aspect-[1.14]" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1 mt-1 max-md:max-w-full">
        <button aria-label="Toggle video">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/cdbf3053fedfeb27b017ced2c04cba4cf55a4cffcab03110545659ce43cb4d61?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4" alt="" className="object-contain shrink-0 w-8 rounded-none aspect-square" />
        </button>
        <div className="flex shrink-0 h-8 rounded-lg bg-neutral-800 w-[122px]"></div>
        <button aria-label="Add video track" className="flex flex-col justify-center items-start px-2.5 py-2.5 bg-indigo-400 rounded-lg max-md:pr-5">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/7a8af2284f4343ec2c60d583b6ebf14e8b401e7dff3d49455dcf4e8a460bbfe2?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4" alt="" className="object-contain w-3 aspect-square" />
        </button>
        <div className="flex shrink-0 max-w-full h-8 rounded-lg bg-neutral-800 w-[395px]"></div>
      </div>
    </>
  );
};

export default Timeline;