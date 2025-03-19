/**
 * - - - - Carrier
 */

export const CarrierTypes = {
  AIRLINE: "airline",
  SHIPPING_LINE: "shipping_line",
} as const;

export type CarrierTypeKey = keyof typeof CarrierTypes;

export type CarrierType = (typeof CarrierTypes)[CarrierTypeKey];

// Backend
export interface CarrierBaseBackend {
  name: string;
  type: CarrierType; // "shipping_line" | "airline"
}

export interface CarrierBackend extends CarrierBaseBackend {
  carrier_id: string;
}

export interface CarrierCreateBackend extends CarrierBaseBackend {
  name: string;
  type: CarrierType;
}

export interface CarrierUpdateBackend {
  name?: string;
  type?: CarrierType;
}

// Internal
export interface CarrierBase {
  name: CarrierBaseBackend["name"];
  type: CarrierBaseBackend["type"];
}

export interface Carrier extends CarrierBase {
  carrier_id: CarrierBackend["carrier_id"];
}

export interface CarrierCreate extends CarrierBase {
  name: CarrierCreateBackend["name"];
  type: CarrierCreateBackend["type"];
}

export interface CarrierUpdate {
  name?: CarrierUpdateBackend["name"];
  type?: CarrierUpdateBackend["type"];
}
