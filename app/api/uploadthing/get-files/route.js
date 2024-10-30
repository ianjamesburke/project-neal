import { utapi } from "@/app/api/uploadthing/uploadthing.ts";
import { NextResponse } from "next/server";


export const GET = async (req, res) => {
  try {
    const files = await utapi.listFiles();
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: "Failed to list files" });
  }
};
