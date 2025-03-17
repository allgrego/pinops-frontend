export interface Client {
  name: string;
  client_id: string;
  comments?: Comment[];
}

export interface Carrier {
  name: string;
  carrier_id: string;
  comments?: Comment[];
}

export interface Agent {
  name: string;
  agent_id: string;
  comments?: Comment[];
}

export interface Status {
  status_name: string;
  status_id: number;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: string;
}

export interface TradeOperation {
  origin_location: string;
  origin_country: string;
  destination_location: string;
  destination_country: string;
  estimated_time_departure: string | null;
  actual_time_departure: string | null;
  estimated_time_arrival: string | null;
  actual_time_arrival: string | null;
  cargo_description: string;
  units_quantity: number | null;
  units_type: string | null;
  gross_weight_value: number | null;
  gross_weight_unit: string | null;
  volume_value: number | null;
  volume_unit: string | null;
  master_transport_doc: string | null;
  house_transport_doc: string | null;
  incoterm: string | null;
  modality: string | null;
  voyage: string | null;
  op_id: string;
  client: Client;
  status: Status;
  carrier: Carrier | null;
  agent: Agent | null;
  created_at: string;
  updated_at: string;
  comments?: Comment[];
}

// Mock data
export const statuses: Status[] = [
  { status_name: "Opened", status_id: 1 },
  { status_name: "In Transit", status_id: 2 },
  { status_name: "Arrived", status_id: 3 },
  { status_name: "Delivered", status_id: 4 },
  { status_name: "Closed", status_id: 5 },
];

export const clients: Client[] = [
  {
    name: "Distribuidora La Rápida, C.A",
    client_id: "967efd88-6ba6-4f4d-a39b-c60f4c132cbf",
    comments: [
      {
        id: "c1",
        content: "Important client, handle with priority",
        created_at: "2025-03-15T10:30:00.000Z",
        author: "John Doe",
      },
    ],
  },
  {
    name: "Importadora Global, S.A",
    client_id: "a67efd88-6ba6-4f4d-a39b-c60f4c132cbd",
  },
  {
    name: "Comercial Andina, C.A",
    client_id: "b67efd88-6ba6-4f4d-a39b-c60f4c132cbe",
  },
];

export const carriers: Carrier[] = [
  {
    name: "Maersk Line",
    carrier_id: "c67efd88-6ba6-4f4d-a39b-c60f4c132cbf",
  },
  {
    name: "MSC",
    carrier_id: "d67efd88-6ba6-4f4d-a39b-c60f4c132cbg",
  },
  {
    name: "CMA CGM",
    carrier_id: "e67efd88-6ba6-4f4d-a39b-c60f4c132cbh",
  },
];

export const agents: Agent[] = [
  {
    name: "Hamburg Shipping Agency",
    agent_id: "f67efd88-6ba6-4f4d-a39b-c60f4c132cbi",
  },
  {
    name: "La Guaira Port Services",
    agent_id: "g67efd88-6ba6-4f4d-a39b-c60f4c132cbj",
  },
];

export const tradeOperations: TradeOperation[] = [
  {
    origin_location: "Hamburg",
    origin_country: "GE",
    destination_location: "La Guaira",
    destination_country: "VE",
    estimated_time_departure: "2025-02-10",
    actual_time_departure: null,
    estimated_time_arrival: "2025-03-10",
    actual_time_arrival: null,
    cargo_description: "Cervezas",
    units_quantity: 31,
    units_type: "pallets",
    gross_weight_value: 23143.18,
    gross_weight_unit: "Kg",
    volume_value: null,
    volume_unit: null,
    master_transport_doc: "HLCUHAM2501ARNQ2",
    house_transport_doc: null,
    incoterm: "CIF",
    modality: "FCL",
    voyage: "VALPARAISO EXPRESS 5205S",
    op_id: "92809871-b0a5-4a9f-b8ef-c28c472848a2",
    client: clients[0],
    status: statuses[0],
    carrier: null,
    agent: null,
    created_at: "2025-03-17T13:20:43.659660",
    updated_at: "2025-03-17T13:20:43.659668",
    comments: [
      {
        id: "op1c1",
        content: "Waiting for carrier confirmation",
        created_at: "2025-03-17T14:30:00.000Z",
        author: "Jane Smith",
      },
    ],
  },
  {
    origin_location: "Rotterdam",
    origin_country: "NL",
    destination_location: "Puerto Cabello",
    destination_country: "VE",
    estimated_time_departure: "2025-01-15",
    actual_time_departure: "2025-01-16",
    estimated_time_arrival: "2025-02-20",
    actual_time_arrival: null,
    cargo_description: "Maquinaria Industrial",
    units_quantity: 5,
    units_type: "containers",
    gross_weight_value: 78500,
    gross_weight_unit: "Kg",
    volume_value: 120,
    volume_unit: "m³",
    master_transport_doc: "MSCU7654321",
    house_transport_doc: "HBL98765",
    incoterm: "FOB",
    modality: "FCL",
    voyage: "MSC ANNA 789E",
    op_id: "a2809871-b0a5-4a9f-b8ef-c28c472848a3",
    client: clients[1],
    status: statuses[1],
    carrier: carriers[1],
    agent: agents[0],
    created_at: "2025-01-10T09:15:22.123456",
    updated_at: "2025-01-16T14:30:10.987654",
  },
  {
    origin_location: "Shanghai",
    origin_country: "CN",
    destination_location: "La Guaira",
    destination_country: "VE",
    estimated_time_departure: "2025-02-01",
    actual_time_departure: "2025-02-02",
    estimated_time_arrival: "2025-03-25",
    actual_time_arrival: "2025-03-27",
    cargo_description: "Electrónicos",
    units_quantity: 1250,
    units_type: "boxes",
    gross_weight_value: 18750.5,
    gross_weight_unit: "Kg",
    volume_value: 85.3,
    volume_unit: "m³",
    master_transport_doc: "CMAU1234567",
    house_transport_doc: "HOUSE987654",
    incoterm: "CIF",
    modality: "LCL",
    voyage: "CMA CGM MARCO POLO 456N",
    op_id: "b2809871-b0a5-4a9f-b8ef-c28c472848a4",
    client: clients[2],
    status: statuses[3],
    carrier: carriers[2],
    agent: agents[1],
    created_at: "2025-01-20T11:45:33.246810",
    updated_at: "2025-03-27T16:20:05.135790",
  },
];

// Mock data service functions
const operations = [...tradeOperations];
const clientsList = [...clients];
const carriersList = [...carriers];
const agentsList = [...agents];

// Operations
export function getOperations() {
  return [...operations];
}

export function getOperation(id: string) {
  return operations.find((op) => op.op_id === id) || null;
}

export function createOperation(
  operation: Omit<TradeOperation, "op_id" | "created_at" | "updated_at">
) {
  const newOperation: TradeOperation = {
    ...operation,
    op_id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  operations.push(newOperation);
  return newOperation;
}

export function updateOperation(id: string, data: Partial<TradeOperation>) {
  const index = operations.findIndex((op) => op.op_id === id);
  if (index === -1) return null;

  operations[index] = {
    ...operations[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  return operations[index];
}

export function deleteOperation(id: string) {
  const index = operations.findIndex((op) => op.op_id === id);
  if (index === -1) return false;

  operations.splice(index, 1);
  return true;
}

// Clients
export function getClients() {
  return [...clientsList];
}

export function getClient(id: string) {
  return clientsList.find((client) => client.client_id === id) || null;
}

export function createClient(client: Omit<Client, "client_id">) {
  const newClient: Client = {
    ...client,
    client_id: crypto.randomUUID(),
  };
  clientsList.push(newClient);
  return newClient;
}

export function updateClient(id: string, data: Partial<Client>) {
  const index = clientsList.findIndex((client) => client.client_id === id);
  if (index === -1) return null;

  clientsList[index] = {
    ...clientsList[index],
    ...data,
  };

  return clientsList[index];
}

export function deleteClient(id: string) {
  const index = clientsList.findIndex((client) => client.client_id === id);
  if (index === -1) return false;

  clientsList.splice(index, 1);
  return true;
}

// Carriers
export function getCarriers() {
  return [...carriersList];
}

export function getCarrier(id: string) {
  return carriersList.find((carrier) => carrier.carrier_id === id) || null;
}

export function createCarrier(carrier: Omit<Carrier, "carrier_id">) {
  const newCarrier: Carrier = {
    ...carrier,
    carrier_id: crypto.randomUUID(),
  };
  carriersList.push(newCarrier);
  return newCarrier;
}

export function updateCarrier(id: string, data: Partial<Carrier>) {
  const index = carriersList.findIndex((carrier) => carrier.carrier_id === id);
  if (index === -1) return null;

  carriersList[index] = {
    ...carriersList[index],
    ...data,
  };

  return carriersList[index];
}

export function deleteCarrier(id: string) {
  const index = carriersList.findIndex((carrier) => carrier.carrier_id === id);
  if (index === -1) return false;

  carriersList.splice(index, 1);
  return true;
}

// Agents
export function getAgents() {
  return [...agentsList];
}

export function getAgent(id: string) {
  return agentsList.find((agent) => agent.agent_id === id) || null;
}

export function createAgent(agent: Omit<Agent, "agent_id">) {
  const newAgent: Agent = {
    ...agent,
    agent_id: crypto.randomUUID(),
  };
  agentsList.push(newAgent);
  return newAgent;
}

export function updateAgent(id: string, data: Partial<Agent>) {
  const index = agentsList.findIndex((agent) => agent.agent_id === id);
  if (index === -1) return null;

  agentsList[index] = {
    ...agentsList[index],
    ...data,
  };

  return agentsList[index];
}

export function deleteAgent(id: string) {
  const index = agentsList.findIndex((agent) => agent.agent_id === id);
  if (index === -1) return false;

  agentsList.splice(index, 1);
  return true;
}

// Comments
export function addComment(
  entityType: "operation" | "client" | "carrier" | "agent",
  entityId: string,
  content: string,
  author = "System User"
) {
  const newComment: Comment = {
    id: crypto.randomUUID(),
    content,
    created_at: new Date().toISOString(),
    author,
  };

  if (entityType === "operation") {
    const operation = getOperation(entityId);
    if (!operation) return null;

    if (!operation.comments) {
      operation.comments = [];
    }

    operation.comments.push(newComment);
    updateOperation(entityId, { comments: operation.comments });
    return newComment;
  }

  if (entityType === "client") {
    const client = getClient(entityId);
    if (!client) return null;

    if (!client.comments) {
      client.comments = [];
    }

    client.comments.push(newComment);
    updateClient(entityId, { comments: client.comments });
    return newComment;
  }

  if (entityType === "carrier") {
    const carrier = getCarrier(entityId);
    if (!carrier) return null;

    if (!carrier.comments) {
      carrier.comments = [];
    }

    carrier.comments.push(newComment);
    updateCarrier(entityId, { comments: carrier.comments });
    return newComment;
  }

  if (entityType === "agent") {
    const agent = getAgent(entityId);
    if (!agent) return null;

    if (!agent.comments) {
      agent.comments = [];
    }

    agent.comments.push(newComment);
    updateAgent(entityId, { comments: agent.comments });
    return newComment;
  }

  return null;
}
