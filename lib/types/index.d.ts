export interface SidebarItem {
  icon: string;
  label:
    | "Splice AI"
    | "Script"
    | "Elements"
    | "Voice Over"
    | "Format"
    | "Brand"
    | "Uploads";
  locked?: boolean;
}
