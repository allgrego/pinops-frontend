import { BACKEND_BASE_URL } from "@/core/setup/routes";

import type {
  Client,
  ClientBackend,
  ClientCreate,
  ClientCreateBackend,
  ClientUpdate,
  ClientUpdateBackend,
} from "@/modules/clients/types/clients";

/**
 * Get all clients
 *
 * @return {Client[]}
 */
export const getAllClients = async (): Promise<Client[]> => {
  try {
    const url = `${BACKEND_BASE_URL}/clients`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: ClientBackend[] | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema

    const clients: Client[] = jsonResponse.map((client) => ({
      client_id: client?.client_id || "",
      name: client?.name || "",
    }));

    return clients;
  } catch (error) {
    console.error("Failure getting all clients", error);
    return Promise.reject(`${error}`);
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
    };

    const url = `${BACKEND_BASE_URL}/clients`;

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
    const newClient: Client = {
      client_id: jsonResponse?.client_id || "",
      name: jsonResponse?.name || "",
    };

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
    };

    const url = `${BACKEND_BASE_URL}/clients/${clientId}`;

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
    const updatedClient: Client = {
      client_id: jsonResponse?.client_id || "",
      name: jsonResponse?.name || "",
    };

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

    const url = `${BACKEND_BASE_URL}/clients/${clientId}`;

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
    console.error("Failure updating a client", error);
    return Promise.reject(`${error}`);
  }
};
