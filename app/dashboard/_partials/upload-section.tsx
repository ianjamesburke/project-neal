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
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="h-full space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 text-white" />
        <Input
          placeholder="Search uploads by keyword, tags, color..."
          className="h-[48px] rounded-lg border-dark-700 py-3 pl-11 text-white  ring-offset-purple placeholder:text-gray-dark focus:outline-none focus:ring-purple focus:ring-offset-2"
        />
      </div>

      <div className="flex h-full flex-col  ">
        <Button
          className="h-12 w-full gap-0 "
          variant={"purple"}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <span className="w-full">Upload Files</span>
          <Ellipsis className="ml-auto h-6 w-6" />
        </Button>
        <input type="file" id="file-input" className="hidden" />
        <Tabs
          defaultValue={selectedTab}
          className="w-full overflow-hidden  !p-0"
        >
          <TabsList className="mb-8 !h-12 w-full bg-transparent p-0">
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
          <TabsContent value="this" className="h-[calc(100%)] ">
            <ScrollArea className="h-full p-4">
              <div className="columns-1 gap-4 space-y-4 sm:columns-2 md:columns-2 lg:columns-2 xl:columns-3">
                {thisData.map((src, index) => (
                  <div key={index} className="mb-4 break-inside-avoid">
                    <Image
                      className="h-auto w-full rounded-lg"
                      width={0}
                      height={0}
                      src={src}
                      sizes="100vw"
                      alt={`Gallery Image ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="all">
            <ScrollArea className="h-full p-4">
              <div className="columns-1 gap-4 space-y-4 sm:columns-2 md:columns-2 lg:columns-2 xl:columns-3">
                {allData.map((src, index) => (
                  <div key={index} className="mb-4 break-inside-avoid">
                    <Image
                      className="h-auto w-full rounded-lg"
                      width={0}
                      height={0}
                      src={src}
                      sizes="100vw"
                      alt={`Gallery Image ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
