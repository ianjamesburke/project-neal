import { Button } from "@/components/ui/button";
import { ChevronRight, Download, Folder, TvMinimalPlay } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export async function Header() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <header className="flex h-16 items-center border-b border-dark-700">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full gap-16 pl-4 text-base text-white"></div>
        <div className="mr-4 flex w-full min-w-[798px] items-center justify-between gap-8">
          <div className="flex items-center gap-2.5  text-base font-medium text-white">
            <Folder className=" h-5 w-5 opacity-40" />
            <div className="flex items-center gap-2.5">
              <span className="text-base text-white opacity-40">
                Project Name
              </span>{" "}
              <span>
                <ChevronRight className="h-6 w-6" />
              </span>
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
                <Skeleton className="h-full w-full bg-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <Button variant="white">
              <TvMinimalPlay className="h-4 w-4" />
              Preview
            </Button>
            <Button variant="white">
              <Download className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
