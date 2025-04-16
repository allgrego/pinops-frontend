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
  | "backend-carriers-by-id-delete"
  | "backend-carriers-contacts-get-all"
  | "backend-carriers-contacts-create"
  | "backend-carriers-contacts-by-id-get"
  | "backend-carriers-contacts-by-id-update"
  | "backend-carriers-contacts-by-id-delete"
  | "backend-carriers-by-id-contacts-get"
  | "backend-partners-types-get-all"
  | "backend-partners-types-by-id-get"
  | "backend-partners-get-all"
  | "backend-partners-create"
  | "backend-partners-by-id-get"
  | "backend-partners-by-id-update"
  | "backend-partners-by-id-delete"
  | "backend-partners-contacts-get-all"
  | "backend-partners-contacts-create"
  | "backend-partners-contacts-by-id-get"
  | "backend-partners-contacts-by-id-update"
  | "backend-partners-contacts-by-id-delete"
  | "backend-partners-by-id-contacts-get"
  | "backend-geodata-countries-get-all"
  | "backend-geodata-countries-by-id-get"
  | "backend-geodata-countries-by-iso-get";

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
  // Geodata
  "backend-geodata-countries-get-all": `${BACKEND_BASE_URL}/geodata/countries`,
  "backend-geodata-countries-by-id-get": `${BACKEND_BASE_URL}/geodata/countries/:country_id/`,
  "backend-geodata-countries-by-iso-get": `${BACKEND_BASE_URL}/geodata/countries/iso/:iso_code/`,
  // Clients
  "backend-clients-get-all": `${BACKEND_BASE_URL}/clients`,
  "backend-clients-create": `${BACKEND_BASE_URL}/clients`,
  "backend-clients-by-id-get": `${BACKEND_BASE_URL}/clients/:client_id/`,
  "backend-clients-by-id-update": `${BACKEND_BASE_URL}/clients/:client_id/`,
  "backend-clients-by-id-delete": `${BACKEND_BASE_URL}/clients/:client_id/`,
  // Carriers types
  "backend-carriers-types-get-all": `${BACKEND_BASE_URL}/carriers/types`,
  "backend-carriers-types-by-id-get": `${BACKEND_BASE_URL}/carriers/types/:type_id/`,
  // Carriers
  "backend-carriers-get-all": `${BACKEND_BASE_URL}/carriers`,
  "backend-carriers-create": `${BACKEND_BASE_URL}/carriers`,
  "backend-carriers-by-id-get": `${BACKEND_BASE_URL}/carriers/:carrier_id`,
  "backend-carriers-by-id-update": `${BACKEND_BASE_URL}/carriers/:carrier_id`,
  "backend-carriers-by-id-delete": `${BACKEND_BASE_URL}/carriers/:carrier_id`,
  // Carriers contacts
  "backend-carriers-contacts-get-all": `${BACKEND_BASE_URL}/carriers/contacts`,
  "backend-carriers-contacts-create": `${BACKEND_BASE_URL}/carriers/contacts`,
  "backend-carriers-contacts-by-id-get": `${BACKEND_BASE_URL}/carriers/contacts/:contact_id/`,
  "backend-carriers-contacts-by-id-update": `${BACKEND_BASE_URL}/carriers/contacts/:contact_id/`,
  "backend-carriers-contacts-by-id-delete": `${BACKEND_BASE_URL}/carriers/contacts/:contact_id/`,
  "backend-carriers-by-id-contacts-get": `${BACKEND_BASE_URL}/carriers/contacts/carrier/:carrier_id/`,
  // Partners types
  "backend-partners-types-get-all": `${BACKEND_BASE_URL}/partners/types`,
  "backend-partners-types-by-id-get": `${BACKEND_BASE_URL}/partners/types/:type_id/`,
  // Partners
  "backend-partners-get-all": `${BACKEND_BASE_URL}/partners`,
  "backend-partners-create": `${BACKEND_BASE_URL}/partners`,
  "backend-partners-by-id-get": `${BACKEND_BASE_URL}/partners/:carrier_id`,
  "backend-partners-by-id-update": `${BACKEND_BASE_URL}/partners/:carrier_id`,
  "backend-partners-by-id-delete": `${BACKEND_BASE_URL}/partners/:carrier_id`,
  // Partners contacts
  "backend-partners-contacts-get-all": `${BACKEND_BASE_URL}/partners/contacts`,
  "backend-partners-contacts-create": `${BACKEND_BASE_URL}/partners/contacts`,
  "backend-partners-contacts-by-id-get": `${BACKEND_BASE_URL}/partners/contacts/:contact_id/`,
  "backend-partners-contacts-by-id-update": `${BACKEND_BASE_URL}/partners/contacts/:contact_id/`,
  "backend-partners-contacts-by-id-delete": `${BACKEND_BASE_URL}/partners/contacts/:contact_id/`,
  "backend-partners-by-id-contacts-get": `${BACKEND_BASE_URL}/partners/contacts/partners/:partner_id/`,
};
