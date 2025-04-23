/**
 * - - - - Partner types (logistics operator, customs broker, insurer, etc)
 */

import { Country, CountryBackend } from "@/modules/geodata/types/countries";

// Backend
export interface PartnerTypeBaseBackend {
  name: string;
  description?: string | null;
}

// Same as Public
export interface PartnerTypeBackend extends PartnerTypeBaseBackend {
  partner_type_id: string;
}

export interface PartnerTypeCreateBackend extends PartnerTypeBaseBackend {
  name: string;
  description?: string | null;
}

export type PartnerTypeUpdateBackend = Partial<PartnerTypeBaseBackend>;

// Internal
export interface PartnerTypeBase {
  name: PartnerTypeBaseBackend["name"];
  description?: PartnerTypeBaseBackend["description"];
}

// Same as Public
export interface PartnerType extends PartnerTypeBase {
  partnerTypeId: PartnerTypeBackend["partner_type_id"];
}

export interface PartnerTypeCreate extends PartnerTypeBase {
  name: PartnerTypeCreateBackend["name"];
  description?: PartnerTypeCreateBackend["description"];
}

export type PartnerTypeUpdate = Partial<PartnerTypeBase>;

/**
 * - - - - Partner
 */

// Backend
export interface PartnerBaseBackend {
  name: string;
  tax_id?: string | null;
  webpage?: string | null;
  disabled?: boolean | null;
}

// Same as Public
export interface PartnerBackend extends PartnerBaseBackend {
  partner_id: string;

  created_at: string;
  updated_at: string;

  partner_type: PartnerTypeBackend;
  country: CountryBackend | null;
  partner_contacts: PartnerContactBackend[];
}

export interface PartnerCreateBackend extends PartnerBaseBackend {
  partner_type_id: string;
  country_id: number | null;
  initial_contacts: PartnerContactCreateBaseBackend[];
}

export type PartnerUpdateBackend = Partial<
  Omit<PartnerCreateBackend, "initial_contacts"> & {
    partner_type_id: string | null;
    partner_contacts: PartnerContactCreateBaseBackend[];
  }
>;

// Internal
export interface PartnerBase {
  name: PartnerBaseBackend["name"];
  taxId?: PartnerBaseBackend["tax_id"];
  webpage?: PartnerBaseBackend["webpage"];
  disabled?: PartnerBaseBackend["disabled"];
}

// Same as Public
export interface Partner extends PartnerBase {
  partnerId: PartnerBackend["partner_id"];

  createdAt: PartnerBackend["created_at"];
  updatedAt: PartnerBackend["updated_at"];

  partnerType: PartnerType;

  country: Country | null;
  contacts: PartnerContact[];
}

export interface PartnerCreate extends PartnerBase {
  partnerTypeId: PartnerCreateBackend["partner_type_id"];
  countryId: PartnerCreateBackend["country_id"];
  contacts: PartnerContactCreateBase[];
}

export type PartnerUpdate = Partial<
  PartnerCreate & {
    partnerTypeId: string | null;
  }
>;

/**
 * - - - - Partner contacts
 */

// Backend
export interface PartnerContactBaseBackend {
  name: string;
  position?: string | null;
  email?: string | null;
  mobile?: string | null;
  phone?: string | null;
  disabled?: boolean;
}

// Same as Public
export interface PartnerContactBackend extends PartnerContactBaseBackend {
  partner_contact_id: string;
  partner_id: string;
  created_at: string;
  updated_at: string;
}

export type PartnerContactCreateBaseBackend = PartnerContactBaseBackend;

export interface PartnerContactCreateBackend
  extends PartnerContactCreateBaseBackend {
  partner_id: string;
  // Rest from base
}

export type PartnerContactUpdateBackend = Partial<PartnerContactCreateBackend>;

// Internal
export interface PartnerContactBase {
  name: PartnerContactBaseBackend["name"];
  position?: PartnerContactBaseBackend["position"];
  email?: PartnerContactBaseBackend["email"];
  mobile?: PartnerContactBaseBackend["mobile"];
  phone?: PartnerContactBaseBackend["phone"];
  disabled?: PartnerContactBaseBackend["disabled"];
}

// Same as Public
export interface PartnerContact extends PartnerContactBase {
  partnerContactId: PartnerContactBackend["partner_contact_id"];
  partnerId: PartnerContactBackend["partner_id"];
  createdAt: PartnerContactBackend["created_at"];
  updatedAt: PartnerContactBackend["updated_at"];
}

export type PartnerContactCreateBase = PartnerContactBase;

export interface PartnerContactCreate extends PartnerContactCreateBase {
  partnerId: PartnerContactCreateBackend["partner_id"];
}

export type PartnerContactCreateWithoutPartnerId = PartnerContactBase;

export type PartnerContactUpdate = Partial<PartnerContactCreate>;
