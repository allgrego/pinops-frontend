/**
 * - - - - Client
 */

// Backend
export interface ClientBaseBackend {
  name: string;
  tax_id?: string | null;
  address?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  disabled?: boolean;
}

export interface ClientBackend extends ClientBaseBackend {
  client_id: string;

  created_at: string;
}

export interface ClientCreateBackend extends ClientBaseBackend {
  name: string;
}

export interface ClientUpdateBackend extends ClientBaseBackend {
  name?: string;
}

// Internal
export interface ClientBase {
  name: ClientBaseBackend["name"];
  taxId?: ClientBaseBackend["tax_id"];
  address?: ClientBaseBackend["address"];
  contactName?: ClientBaseBackend["contact_name"];
  contactEmail?: ClientBaseBackend["contact_email"];
  contactPhone?: ClientBaseBackend["contact_phone"];
  disabled?: ClientBaseBackend["disabled"];
}

export interface Client extends ClientBase {
  clientId: ClientBackend["client_id"];
  createdAt: ClientBackend["created_at"];
}

export interface ClientCreate extends ClientBase {
  name: ClientCreateBackend["name"];
}

export interface ClientUpdate extends ClientBase {
  name?: ClientUpdateBackend["name"];
}
