import { getRoute } from "@/core/lib/routes";

import type {
  Client,
  ClientBackend,
  ClientCreate,
  ClientCreateBackend,
  ClientUpdate,
  ClientUpdateBackend,
} from "@/modules/clients/types/clients";

/**
 * Transform client from backend schema into internal schema
 *
 * @param {ClientBackend} clientBackend
 *
 * @returns {Client}
 */
export const serializeClient = (client: ClientBackend): Client => {
  const serializedClient: Client = {
    clientId: client?.client_id || "",
    name: client?.name || "",
    taxId: client?.tax_id || null,
    address: client?.address || null,
    contactEmail: client?.contact_email || null,
    contactName: client?.contact_name || null,
    contactPhone: client?.contact_phone || null,
    disabled: client?.disabled || false,
    createdAt: client?.created_at || "",
  };

  return serializedClient;
};

/**
 * Get all clients
 *
 * @return {Client[]}
 */
export const getAllClients = async (): Promise<Client[]> => {
  try {
    const url = getRoute("backend-clients-get-all");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: ClientBackend[] | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema

    const clients: Client[] = jsonResponse.map((client) =>
      serializeClient(client)
    );

    return clients;
  } catch (error) {
    console.error("Failure getting all clients", error);
    throw error;
  }
};

/**
 * Create a new client
 *
 * @param {ClientCreate} newClientData
 *
 * @return {Client}
 */
export const createClient = async (
  newClientData: ClientCreate
): Promise<Client> => {
  try {
    if (!newClientData) throw new Error("Data not found");

    // Transform into backend schema
    const backendPayload: ClientCreateBackend = {
      name: newClientData?.name,
      tax_id: newClientData?.taxId,
      contact_email: newClientData?.contactEmail,
      contact_name: newClientData?.contactName,
      contact_phone: newClientData?.contactPhone,
      address: newClientData?.address,
      disabled: newClientData?.disabled,
    };

    const url = getRoute("backend-clients-create");

    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: ClientBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const newClient: Client = serializeClient(jsonResponse);

    return newClient;
  } catch (error) {
    console.error("Failure creating a client", error);
    return Promise.reject(`${error}`);
  }
};

/**
 * Update a client
 *
 * @param {string} clientId
 * @param {ClientUpdate} newClientData
 *
 * @return {Client}
 */
export const updateClient = async (
  clientId: string,
  newClientData: ClientUpdate
): Promise<Client> => {
  try {
    if (!newClientData) throw new Error("Data not found");

    // Transform into backend schema
    const backendPayload: ClientUpdateBackend = {
      name: newClientData?.name,
      tax_id: newClientData?.taxId,
      contact_email: newClientData?.contactEmail,
      contact_name: newClientData?.contactName,
      contact_phone: newClientData?.contactPhone,
      address: newClientData?.address,
      disabled: newClientData?.disabled,
    };

    const url = getRoute("backend-clients-by-id-update", [clientId]);

    const response = await fetch(url, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: ClientBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const updatedClient: Client = serializeClient(jsonResponse);

    return updatedClient;
  } catch (error) {
    console.error("Failure updating a client", error);
    return Promise.reject(`${error}`);
  }
};

/**
 * Delete a client
 *
 * @param {string} clientId
 *
 * @return {{ ok: boolean }}
 */
export const deleteClient = async (clientId: string): Promise<boolean> => {
  try {
    if (!clientId) throw new Error("Client ID not found");

    const url = getRoute("backend-clients-by-id-delete", [clientId]);

    const response = await fetch(url, {
      method: "DELETE",
    });

    // TODO validate 404 response

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: { ok: boolean } | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    return jsonResponse?.ok || false;
  } catch (error) {
    console.error("Failure deleting a client", error);
    return Promise.reject(`${error}`);
  }
};
