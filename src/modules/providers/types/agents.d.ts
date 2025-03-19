/**
 * - - - - Agent
 */

// Backend
export interface AgentBaseBackend {
  name: string;
}

export interface AgentBackend extends AgentBaseBackend {
  agent_id: string;
}

export interface AgentCreateBackend extends AgentBaseBackend {
  name: string;
}

export interface AgentUpdateBackend extends AgentBaseBackend {
  name: string;
}

// Internal
export interface AgentBase {
  name: AgentBaseBackend["name"];
}

export interface Agent extends AgentBase {
  agent_id: AgentBackend["agent_id"];
}

export interface AgentCreate extends AgentBase {
  name: AgentCreateBackend["name"];
}

export interface AgentUpdate extends AgentBase {
  name: AgentUpdateBackend["name"];
}
