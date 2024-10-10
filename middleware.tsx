import { NextRequest, NextResponse } from 'next/server';

/** This is the middleware function that sets the userID in the header */
export default async function middleware(req: NextRequest) {
  const response = NextResponse.next();

  // Set the user ID in the header so it can be passed down to client components
  return response;
};