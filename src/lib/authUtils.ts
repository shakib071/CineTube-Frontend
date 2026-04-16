export type UserRole = "USER" | "ADMIN";

export const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  // "/verify-email",
];

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route) => route === pathname);
};

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

export const adminProtectedRoutes: RouteConfig = {
  pattern: [/^\/admin\/dashboard/],
  exact: [],
};

export const userProtectedRoutes: RouteConfig = {
  pattern: [/^\/user\/dashboard/],
  exact: [],
};

export const commonProtectedRoutes: RouteConfig = {
  exact: [
    "/profile",
    "/watchlist",
    "/subscription",
    "/purchase-history"
  ],
  pattern: [
    /^\/payment(\/.*)?$/,
  ],
};

export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig
): boolean => {
  if (routes.exact.includes(pathname)) return true;
  return routes.pattern.some((pattern) => pattern.test(pathname));
};

export const getRouteOwner = (
  pathname: string
): "ADMIN" | "USER" | "COMMON" | null => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) return "ADMIN";
  if (isRouteMatches(pathname, userProtectedRoutes)) return "USER";
  if (isRouteMatches(pathname, commonProtectedRoutes)) return "COMMON";
  return null;
};

export const getDefaultDashboardRoute = (role: UserRole): string => {
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "USER") return "/user/dashboard";
  return "/login";
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole
): boolean => {
  const sanitizedPath = redirectPath.split("?")[0] || redirectPath;
  const routeOwner = getRouteOwner(sanitizedPath);
  if (routeOwner === null || routeOwner === "COMMON") return true;
  if (routeOwner === role) return true;
  return false;
};
