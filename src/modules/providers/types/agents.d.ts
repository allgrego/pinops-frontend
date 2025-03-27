/**
 * - - - - Agent
 */

// Backend
export interface AgentBaseBackend {
  name: string;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
}

export interface AgentBackend extends AgentBaseBackend {
  agent_id: string;

  created_at: string;
}

export interface AgentCreateBackend extends AgentBaseBackend {
  name: string;
}

export type AgentUpdateBackend = Partial<AgentBaseBackend>;

// Internal
export interface AgentBase {
  name: AgentBaseBackend["name"];
  contactName?: AgentBaseBackend["contact_name"];
  contactEmail?: AgentBaseBackend["contact_email"];
  contactPhone?: AgentBaseBackend["contact_phone"];
}

export interface Agent extends AgentBase {
  agentId: AgentBackend["agent_id"];

  createdAt: AgentBackend["created_at"];
}

export interface AgentCreate extends AgentBase {
  name: AgentCreateBackend["name"];
}

export type AgentUpdate = Partial<AgentBase>;
