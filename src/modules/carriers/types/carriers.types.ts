/**
 * - - - - Carrier types (shipping line, airline, etc)
 */

// Backend
export interface CarrierTypeBaseBackend {
  name: string;
  description?: string | null;
}

// Same as Public
export interface CarrierTypeBackend extends CarrierTypeBaseBackend {
  carrier_type_id: string;
}

export interface CarrierTypeCreateBackend extends CarrierTypeBaseBackend {
  name: string;
  description?: string | null;
}

export type CarrierTypeUpdateBackend = Partial<CarrierTypeBaseBackend>;

// Internal
export interface CarrierTypeBase {
  name: CarrierTypeBaseBackend["name"];
  description?: CarrierTypeBaseBackend["description"];
}

// Same as Public
export interface CarrierType extends CarrierTypeBase {
  carrierTypeId: CarrierTypeBackend["carrier_type_id"];
}

export interface CarrierTypeCreate extends CarrierTypeBase {
  name: CarrierTypeCreateBackend["name"];
  description?: CarrierTypeCreateBackend["description"];
}

export type CarrierTypeUpdate = Partial<CarrierTypeBase>;

/**
 * - - - - Carrier
 */

// Backend
export interface CarrierBaseBackend {
  name: string;
  tax_id?: string | null;
  disabled?: boolean;
}

// Same as Public
export interface CarrierBackend extends CarrierBaseBackend {
  carrier_id: string;

  created_at: string;
  updated_at: string;

  carrier_type: CarrierTypeBackend;
  carrier_contacts: CarrierContactBackend[];
}

export interface CarrierCreateBackend extends CarrierBaseBackend {
  carrier_type_id: string;
  initial_contacts: CarrierContactCreateBaseBackend[];
}

export type CarrierUpdateBackend = Partial<
  Omit<CarrierCreateBackend, "initial_contacts"> & {
    carrier_type_id: string | null;
    carrier_contacts: CarrierContactCreateBaseBackend[];
  }
>;

// Internal
export interface CarrierBase {
  name: CarrierBaseBackend["name"];
  taxId?: CarrierBaseBackend["tax_id"];
  disabled?: CarrierBaseBackend["disabled"];
}

// Same as Public
export interface Carrier extends CarrierBase {
  carrierId: CarrierBackend["carrier_id"];

  createdAt: CarrierBackend["created_at"];
  updatedAt: CarrierBackend["updated_at"];

  carrierType: CarrierType;
  contacts: CarrierContact[];
}

export interface CarrierCreate extends CarrierBase {
  carrierTypeId: CarrierCreateBackend["carrier_type_id"];
  contacts: CarrierContactCreateBase[];
}

export type CarrierUpdate = Partial<
  CarrierCreate & {
    carrierTypeId: string | null;
  }
>;

/**
 * - - - - Carrier contacts
 */

// Backend
export interface CarrierContactBaseBackend {
  name: string;
  position?: string | null;
  email?: string | null;
  mobile?: string | null;
  phone?: string | null;
  disabled?: boolean;
}

// Same as Public
export interface CarrierContactBackend extends CarrierContactBaseBackend {
  carrier_contact_id: string;
  carrier_id: string;
  created_at: string;
  updated_at: string;
}

export type CarrierContactCreateBaseBackend = CarrierContactBaseBackend;

export interface CarrierContactCreateBackend
  extends CarrierContactCreateBaseBackend {
  carrier_id: string;
  // Rest from base
}

export type CarrierContactUpdateBackend = Partial<CarrierContactCreateBackend>;

// Internal
export interface CarrierContactBase {
  name: CarrierContactBaseBackend["name"];
  position?: CarrierContactBaseBackend["position"];
  email?: CarrierContactBaseBackend["email"];
  mobile?: CarrierContactBaseBackend["mobile"];
  phone?: CarrierContactBaseBackend["phone"];
  disabled?: CarrierContactBaseBackend["disabled"];
}

// Same as Public
export interface CarrierContact extends CarrierContactBase {
  carrierContactId: CarrierContactBackend["carrier_contact_id"];
  carrierId: CarrierContactBackend["carrier_id"];
  createdAt: CarrierContactBackend["created_at"];
  updatedAt: CarrierContactBackend["updated_at"];
}

export type CarrierContactCreateBase = CarrierContactBase;

export interface CarrierContactCreate extends CarrierContactCreateBase {
  carrierId: CarrierContactCreateBackend["carrier_id"];
}

export type CarrierContactUpdate = Partial<CarrierContactCreate>;
