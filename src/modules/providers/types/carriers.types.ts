/**
 * - - - - Carrier
 */

export const CarrierTypes = {
  SHIPPING_LINE: "shipping_line",
  AIRLINE: "airline",
  ROAD_FREIGHT_COMPANY: "road_freight_company",
  RAILWAY_COMPANY: "railway_company",
} as const;

export type CarrierTypeKey = keyof typeof CarrierTypes;

export type CarrierType = (typeof CarrierTypes)[CarrierTypeKey];

// Backend
export interface CarrierBaseBackend {
  name: string;
  type: CarrierType; // "shipping_line" | "airline"
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
}

// Same as Public
export interface CarrierBackend extends CarrierBaseBackend {
  carrier_id: string;

  created_at: string;
}

export interface CarrierCreateBackend extends CarrierBaseBackend {
  name: string;
  type: CarrierType;
}

export type CarrierUpdateBackend = Partial<CarrierBaseBackend>;

// Internal
export interface CarrierBase {
  name: CarrierBaseBackend["name"];
  type: CarrierBaseBackend["type"];
  contactName?: CarrierBaseBackend["contact_name"];
  contactEmail?: CarrierBaseBackend["contact_email"];
  contactPhone?: CarrierBaseBackend["contact_phone"];
}

// Same as Public
export interface Carrier extends CarrierBase {
  carrierId: CarrierBackend["carrier_id"];
  createdAt: CarrierBackend["created_at"];
}

export interface CarrierCreate extends CarrierBase {
  name: CarrierCreateBackend["name"];
  type: CarrierCreateBackend["type"];
}

export type CarrierUpdate = Partial<CarrierBase>;
