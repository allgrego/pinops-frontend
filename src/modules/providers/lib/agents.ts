import { BACKEND_BASE_URL } from "@/core/setup/routes";

import type {
  Agent,
  AgentBackend,
  AgentCreate,
  AgentCreateBackend,
  AgentUpdate,
  AgentUpdateBackend,
} from "@/modules/providers/types/agents";

/**
 * Get all Agents
 *
 * @return {Agent[]}
 */
export const getAllAgents = async (): Promise<Agent[]> => {
  try {
    const url = `${BACKEND_BASE_URL}/agents`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: AgentBackend[] | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema

    const agents: Agent[] = jsonResponse.map((agent) => ({
      agentId: agent?.agent_id || "",
      name: agent?.name || "",
      contactEmail: agent?.contact_email,
      contactName: agent?.contact_name,
      contactPhone: agent?.contact_phone,
      createdAt: agent?.created_at,
    }));

    return agents;
  } catch (error) {
    console.error("Failure getting all agents", error);
    return Promise.reject(`${error}`);
  }
};

/**
 * Create a new international agent
 *
 * @param {AgentCreate} newAgentData
 *
 * @return {Agent}
 */
export const createAgent = async (
  newAgentData: AgentCreate
): Promise<Agent> => {
  try {
    if (!newAgentData) throw new Error("Data not found");

    // Transform into backend schema
    const backendPayload: AgentCreateBackend = {
      name: newAgentData?.name,
      contact_email: newAgentData?.contactEmail,
      contact_name: newAgentData?.contactName,
      contact_phone: newAgentData?.contactPhone,
    };

    const url = `${BACKEND_BASE_URL}/agents`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: AgentBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const newAgent: Agent = {
      agentId: jsonResponse?.agent_id || "",
      name: jsonResponse?.name || "",
      contactEmail: jsonResponse?.contact_email,
      contactName: jsonResponse?.contact_name,
      contactPhone: jsonResponse?.contact_phone,
      createdAt: jsonResponse?.created_at,
    };

    return newAgent;
  } catch (error) {
    console.error("Failure creating a Agent", error);
    return Promise.reject(`${error}`);
  }
};

/**
 * Update a Agent
 *
 * @param {string} agentId
 * @param {AgentUpdate} newAgentData
 *
 * @return {Agent}
 */
export const updateAgent = async (
  agentId: string,
  newAgentData: AgentUpdate
): Promise<Agent> => {
  try {
    if (!newAgentData) throw new Error("Data not found");

    // Transform into backend schema
    const backendPayload: AgentUpdateBackend = {
      name: newAgentData?.name,
      contact_email: newAgentData?.contactEmail,
      contact_name: newAgentData?.contactName,
      contact_phone: newAgentData?.contactPhone,
    };

    const url = `${BACKEND_BASE_URL}/agents/${agentId}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: AgentBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const updatedAgent: Agent = {
      agentId: jsonResponse?.agent_id || "",
      name: jsonResponse?.name || "",
      contactEmail: jsonResponse?.contact_email,
      contactName: jsonResponse?.contact_name,
      contactPhone: jsonResponse?.contact_phone,
      createdAt: jsonResponse?.created_at,
    };

    return updatedAgent;
  } catch (error) {
    console.error("Failure updating a Agent", error);
    return Promise.reject(`${error}`);
  }
};

/**
 * Delete a Agent
 *
 * @param {string} agentId
 *
 * @return {{ ok: boolean }}
 */
export const deleteAgent = async (agentId: string): Promise<boolean> => {
  try {
    if (!agentId) throw new Error("Agent ID not found");

    const url = `${BACKEND_BASE_URL}/agents/${agentId}`;

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
    console.error("Failure deleting an agent", error);
    return Promise.reject(`${error}`);
  }
};
