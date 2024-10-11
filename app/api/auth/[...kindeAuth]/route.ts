import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  // console.log("Kinde Auth GET request received");
  try {
    // console.log("Attempting to handle Kinde Auth");
    const result = await handleAuth()(req, res);
    // console.log("Kinde Auth handled successfully");
    return result;
  } catch (error) {
    //console.error("Kinde Auth Error:", error);
    return NextResponse.json(
      { error: "Authentication Error" },
      { status: 500 }
    );
  }
};
