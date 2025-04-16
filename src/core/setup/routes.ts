/**
 * Configuration related to Next.js and others routes setup and handling
 *
 * @author Gregorio Alvarez <galvarez@cbpi.com.mx>
 *
 */

/**
 *
 * - - - - -  How to add a new route
 *
 * 1. Add the alias on "RouteAlias" type below (on corresponding group: Pages, Internal API, Backend)
 * Note there is a convention on names based on group.
 *
 * 2. Map the established alias with its corresponding route in "routes" object below
 *
 * 3. Now you can use your route with the getRoute() helper
 */

// The backend base URLs are obtained from environment variables
export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

if (!BACKEND_BASE_URL) {
  console.error("Backend URL basepath is not set in env variables");
  throw new Error("Backend URL basepath is not set in env variables");
}

/**
 * Unique alias of each route
 */
export type RouteAlias =
  // Pages
  | "index"
  | "login"
  | "operations"

  // API
  // None

  // Backend API
  | "backend-login";

/**
 * NextJS and other routes
 */
export const routes: Record<RouteAlias, string> = {
  /**
   * Pages
   */
  index: "/",
  // Auth
  login: "/auth/login",
  operations: "/app/operations",

  /**
   * Next.js API
   */
  // None

  /**
   * Backend API
   */
  // Auth
  "backend-login": `${BACKEND_BASE_URL}/auth/login`,
};
