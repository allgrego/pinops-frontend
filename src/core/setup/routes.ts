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
  | "dashboard"
  | "login"
  | "operations"
  | "clients"
  | "carriers"
  | "partners"

  // API
  // None

  // Backend API
  | "backend-login"
  | "backend-clients-get-all"
  | "backend-clients-create"
  | "backend-clients-by-id-get"
  | "backend-clients-by-id-update"
  | "backend-clients-by-id-delete"
  | "backend-carriers-types-get-all"
  | "backend-carriers-types-by-id-get"
  | "backend-carriers-get-all"
  | "backend-carriers-create"
  | "backend-carriers-by-id-get"
  | "backend-carriers-by-id-update"
  | "backend-carriers-by-id-delete";

/**
 * NextJS and other routes
 */
export const routes: Record<RouteAlias, string> = {
  /**
   * Pages
   */
  index: "/",
  dashboard: "/app/dashboard",
  // Auth
  login: "/auth/login",
  // Operations
  operations: "/app/operations",
  // Clients
  clients: "/app/clients",
  // Carriers
  carriers: "/app/carriers",
  // Partners
  partners: "/app/partners",

  /**
   * Next.js API
   */
  // None

  /**
   * Backend API
   */
  // Auth
  "backend-login": `${BACKEND_BASE_URL}/auth/login`,
  // Clients
  "backend-clients-get-all": `${BACKEND_BASE_URL}/clients`,
  "backend-clients-create": `${BACKEND_BASE_URL}/clients`,
  "backend-clients-by-id-get": `${BACKEND_BASE_URL}/clients/:client_id/`,
  "backend-clients-by-id-update": `${BACKEND_BASE_URL}/clients/:client_id/`,
  "backend-clients-by-id-delete": `${BACKEND_BASE_URL}/clients/:client_id/`,
  // Carriers
  "backend-carriers-types-get-all": `${BACKEND_BASE_URL}/carriers/types`,
  "backend-carriers-types-by-id-get": `${BACKEND_BASE_URL}/carriers/types/:type_id/`,

  "backend-carriers-get-all": `${BACKEND_BASE_URL}/carriers`,
  "backend-carriers-create": `${BACKEND_BASE_URL}/carriers`,
  "backend-carriers-by-id-get": `${BACKEND_BASE_URL}/carriers/:carrier_id`,
  "backend-carriers-by-id-update": `${BACKEND_BASE_URL}/carriers/:carrier_id`,
  "backend-carriers-by-id-delete": `${BACKEND_BASE_URL}/carriers/:carrier_id`,
};
