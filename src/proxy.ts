import { NextRequest, NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
import { getNewTokensWithRefreshToken } from "./services/auth.service";



async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
  try {
    const refresh = await getNewTokensWithRefreshToken(refreshToken);
    if (!refresh) return false;
    return true;
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const pathWithQuery = `${pathname}${request.nextUrl.search}`;

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const decodedAccessToken =
      accessToken &&
      jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      ).data;

    const isValidAccessToken =
      accessToken &&
      jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
        .success;

    let userRole: UserRole | null = null;


    if (decodedAccessToken) {
      userRole = decodedAccessToken.role as UserRole;
    }

    const routeOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // Proactively refresh token if expiring soon
    if (isValidAccessToken && refreshToken && (await isTokenExpiringSoon(accessToken))) {
      const requestHeaders = new Headers(request.headers);
      const response = NextResponse.next({ request: { headers: requestHeaders } });

      try {
        const refreshed = await refreshTokenMiddleware(refreshToken);
        if (refreshed) {
          requestHeaders.set("x-token-refreshed", "1");
        }
        return NextResponse.next({
          request: { headers: requestHeaders },
          headers: response.headers,
        });
      } catch (error) {
        console.error("Error refreshing token:", error);
      }

      return response;
    }
   

    // Rule 1 — Logged in users should not access auth pages
    if (isAuth && isValidAccessToken) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)
      );
    }

    if (pathname === "/dashboard") {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)
        );
    }

    // Rule 2 — Public routes → allow
    if (routeOwner === null) {
      return NextResponse.next();
    }

    // Rule 3 — Not logged in but accessing protected route → redirect to login
    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathWithQuery);
      return NextResponse.redirect(loginUrl);
    }

    if(accessToken && isValidAccessToken && decodedAccessToken && decodedAccessToken?.emailVarified === false){
      return NextResponse.redirect(
        new URL("/verify-email?email="+decodedAccessToken.email+"", request.url)
      )
    }

    // Rule 4 — Common protected routes → allow any logged in user
    if (routeOwner === "COMMON") {
      return NextResponse.next();
    }

 

    // Rule 5 — Role based routes → redirect if wrong role
    if (routeOwner === "ADMIN" || routeOwner === "USER") {
      if (routeOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in proxy middleware:", error);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};