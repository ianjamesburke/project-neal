import { Button } from "@/components/ui/button";
import { Download, Folder, Share } from "lucide-react";
import Image from "next/image";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export async function Header() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isAuthenticated = !!user;

  return (
    <header className="flex items-center h-16">
      <div className="flex justify-center gap-10 min-w-[64px] h-16 border-r border-neutral-800">
        <Image
          loading="lazy"
          src="/assets/icons/logo.svg"
          alt="Logo"
          width={32}
          height={32}
        />
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-16 text-base text-white pl-16">
          <span>File</span>
          <span>Edit</span>
          <span>Resources</span>
        </div>
        <div className="flex items-center gap-8 mr-8">
          <div className="flex items-center gap-2 text-base font-medium text-right text-white">
            <Folder className="w-5 h-5  opacity-40" />
            <div className="basis-auto ">
              <span className="text-white text-base opacity-40">
                Project Title /
              </span>{" "}
              File Name
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="mr-2 cursor-pointer">
              <AvatarImage
                src={
                  user?.picture ||
                  "https://cdn.builder.io/api/v1/image/assets/TEMP/dd4368c4193fe4718cfa135c8756b207c6c60327fb1b953e7cc4b74b0e20c21b?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4"
                }
                alt="Avatar"
              />
              <AvatarFallback>
                <Skeleton className="bg-muted-foreground w-full h-full" />
              </AvatarFallback>
            </Avatar>
            <Button variant="dark">Preview</Button>
            <Button variant="share">
              <Download className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
