import Image from "next/image";
import React from "react";

export const Timeline = () => {
  return (
    <div className="px-4">
      <div className=" mr-4 mt-2.5 flex items-center justify-between gap-5 whitespace-nowrap text-xs font-medium text-white max-md:mr-2.5">
        <div className="my-auto flex gap-8 self-stretch">
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
      <Image
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff8ec43f06abb4bd47592dd853bbfee2ad7c92e3ceee4991ee9b15d0e8860e0b?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4.svg"
        alt="Video timeline"
        className="mt-2.5 aspect-[23.26] rounded-none object-contain max-md:max-w-full"
        width={750}
        height={750}
      />
      <div className="mt-1 flex flex-wrap gap-1 max-md:max-w-full">
        <button aria-label="Toggle audio">
          <Image
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0931d74cf02cde574e1c388ab1bae81dd09b9ff1fcef5f1474c66fea62975221?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4.svg"
            alt=""
            className="aspect-square shrink-0 rounded-none object-contain"
            width={32}
            height={32}
          />
        </button>
        <div className="flex h-8 w-[51px] shrink-0 rounded-lg bg-neutral-800"></div>
        <button
          aria-label="Add audio track"
          className="flex flex-col items-start justify-center rounded-lg border border-solid border-indigo-400 bg-indigo-400/20 px-2 py-2.5 max-md:max-w-full max-md:pr-5"
        >
          <Image
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/cec8a37156bff22674bc0314cbf3700b890805b8f22f1e312b405678fa31c69c?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4.svg"
            alt=""
            className="aspect-[1.14] w-4 object-contain"
            width={16}
            height={16}
          />
        </button>
      </div>
      <div className="mt-1 flex flex-wrap gap-1 max-md:max-w-full">
        <button aria-label="Toggle video">
          <Image
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/cdbf3053fedfeb27b017ced2c04cba4cf55a4cffcab03110545659ce43cb4d61?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4.svg"
            alt=""
            className="aspect-square shrink-0 rounded-none object-contain"
            width={32}
            height={32}
          />
        </button>
        <div className="flex h-8 w-[122px] shrink-0 rounded-lg bg-neutral-800"></div>
        <button
          aria-label="Add video track"
          className="flex flex-col items-start justify-center rounded-lg bg-indigo-400 p-2.5 max-md:pr-5"
        >
          <Image
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7a8af2284f4343ec2c60d583b6ebf14e8b401e7dff3d49455dcf4e8a460bbfe2?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4.svg"
            alt=""
            className="aspect-square w-3 object-contain"
            width={12}
            height={12}
          />
        </button>
        <div className="flex h-8 w-[395px] max-w-full shrink-0 rounded-lg bg-neutral-800"></div>
      </div>
    </div>
  );
};
