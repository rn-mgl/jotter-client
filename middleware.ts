import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const userToken = req.nextauth.token?.user.token;
    const response = NextResponse.rewrite(new URL("/login", req.url));

    if (!userToken) {
      return response;
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token?.user.token;
      },
    },
  }
);

export const config = { matcher: ["/jotter/:path*"] };
