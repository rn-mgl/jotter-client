import { NextRequest } from "next/server";
import axios from "axios";

export async function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("jotter")?.value;
  const jotterToken = request.cookies.get("XSRF-TOKEN")?.value;

  try {
    const { data: user } = await axios.get(`http://localhost:8000/get_user`, {
      withCredentials: true,
      headers: {
        user: currentUser,
      },
    });
    if (!user.valid) {
      return Response.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    return Response.redirect(new URL("/login", request.url));
  }

  if (
    !jotterToken ||
    (!currentUser && request.nextUrl.pathname.startsWith("/jotter"))
  ) {
    return Response.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/jotter/:path*"],
};
