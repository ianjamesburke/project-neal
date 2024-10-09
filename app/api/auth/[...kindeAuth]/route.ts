import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export const GET = async () => {
  try {
    handleAuth();
  } catch (e) {
    console.error(e);
    new Response("Internal Server Error", { status: 500 });
  }
};
