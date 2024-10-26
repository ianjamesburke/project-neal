import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CopyPlus, Trash2 } from "lucide-react";

export const TopToolbar = () => {
  return (
    <div className="flex h-12 w-full items-center justify-between gap-1 p-4">
      <span className="mr-2 text-base text-gray-dark ">
        Variant File Name...
      </span>
      <div className="flex gap-2">
        <Button variant="toolbar" disabled>
          <CopyPlus />
        </Button>
        <Button variant="toolbar" disabled>
          <Trash2 className="h-5 w-5 " />
        </Button>
        <Button variant="toolbar" disabled>
          <ChevronLeft className="h-5 w-5 " />
        </Button>
        <Button variant="toolbar" disabled>
          <ChevronRight className="h-5 w-5 " />
        </Button>
      </div>
    </div>
  );
};
