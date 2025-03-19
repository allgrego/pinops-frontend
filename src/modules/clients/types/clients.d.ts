/**
 * - - - - Client
 */

// Backend
export interface ClientBaseBackend {
  name: string;
}

export interface ClientBackend extends ClientBaseBackend {
  client_id: string;
}

export interface ClientCreateBackend extends ClientBaseBackend {
  name: string;
}

export interface ClientUpdateBackend extends ClientBaseBackend {
  name: string;
}

// Internal
export interface ClientBase {
  name: ClientBaseBackend["name"];
}

export interface Client extends ClientBase {
  client_id: ClientBackend["client_id"];
}

export interface ClientCreate extends ClientBase {
  name: ClientCreateBackend["name"];
}

export interface ClientUpdate extends ClientBase {
  name: ClientUpdateBackend["name"];
}
