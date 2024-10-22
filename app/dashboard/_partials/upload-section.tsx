"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Button } from "../../../components/ui/button";
import { Ellipsis, Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";

export const UploadSection = () => {
  const [selectedTab, setSelectedTab] = useState<"this" | "all">("this");

  const [thisData, setThisData] = useState<any>([
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg",
  ]);
  const [allData, setAllData] = useState<any>([
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg",
  ]);
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-6 h-6" />
        <Input
          placeholder="Search uploads by keyword, tags, color..."
          className="pl-11 py-3 h-[48px] border-dark-700 rounded-lg placeholder:text-gray-dark  focus:ring-offset-2 ring-offset-purple focus:ring-purple focus:outline-none text-white"
        />
      </div>

      <div className="flex flex-col">
        <Button
          className="w-full h-12 gap-0 "
          variant={"purple"}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <span className="w-full">Upload Files</span>
          <Ellipsis className="ml-auto w-6 h-6" />
        </Button>
        <input type="file" id="file-input" className="hidden" />
        <Tabs defaultValue={selectedTab} className="w-full !p-0  ">
          <TabsList className="w-full p-0 bg-transparent mb-8 !h-12">
            <TabsTrigger
              className={cn(
                "w-full !bg-transparent rounded-none border-transparent border-b-2 data-[state=active]:border-purple transition-none !py-3 data-[state=active]:text-white",
                "transition-all duration-300"
              )}
              value="this"
            >
              This Project
            </TabsTrigger>
            <TabsTrigger
              className={cn(
                "w-full !bg-transparent rounded-none border-transparent border-b-2 data-[state=active]:border-purple transition-none !py-3 data-[state=active]:text-white",
                "transition-all duration-300"
              )}
              value="all"
            >
              All Projects
            </TabsTrigger>
          </TabsList>
          <TabsContent value="this">
            <div className="columns-1 sm:columns-2 md:columns-2 lg:columns-2 xl:columns-3 gap-4 space-y-4">
              {thisData.map((src, index) => (
                <div key={index} className="mb-4 break-inside-avoid">
                  <Image
                    className="w-full h-auto rounded-lg"
                    width={0}
                    height={0}
                    src={src}
                    sizes="100vw"
                    alt={`Gallery Image ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="all">
            <div className="columns-1 sm:columns-2 md:columns-2 lg:columns-2 xl:columns-3 gap-4 space-y-4">
              {allData.map((src, index) => (
                <div key={index} className="mb-4 break-inside-avoid">
                  <Image
                    className="w-full h-auto rounded-lg"
                    width={0}
                    height={0}
                    src={src}
                    sizes="100vw"
                    alt={`Gallery Image ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
