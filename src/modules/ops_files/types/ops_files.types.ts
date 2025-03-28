import { Client, ClientBackend } from "@/modules/clients/types/clients";
import { Agent, AgentBackend } from "@/modules/providers/types/agents";
import {
  Carrier,
  CarrierBackend,
} from "@/modules/providers/types/carriers.types";

/**
 * - - - Operation types
 */
export const OperationTypes = {
  MARITIME: "maritime",
  AIR: "airline",
  ROAD: "road",
  TRAIN: "train",
} as const;

export type OperationTypeKey = keyof typeof OperationTypes;

export type OperationType = (typeof OperationTypes)[OperationTypeKey];

/**
 * - - - Operation statuses
 */

// Backend

export interface OpsStatusBaseBackend {
  status_name: string;
}

export interface OpsStatusBackend extends OpsStatusBaseBackend {
  status_id: number;
}

// Internal

export interface OpsStatusBase {
  statusName: OpsStatusBaseBackend["status_name"];
}

export interface OpsStatus extends OpsStatusBase {
  statusId: OpsStatusBackend["status_id"];
}

/**
 * - - - Operation file comments
 */

// Backend
export interface OpsFileCommentBaseBackend {
  author?: string | null;
  content: string;
}

export interface OpsFileCommentBackend extends OpsFileCommentBaseBackend {
  comment_id: string;
  op_id: string;
}

export interface OpsfileCommentCreateBackend extends OpsFileCommentBaseBackend {
  op_id: string;
}

export type OpsFileCommentUpdateBackend = Partial<OpsFileCommentBaseBackend>;

// Internal
export interface OpsFileCommentBase {
  author?: OpsFileCommentBaseBackend["author"];
  content: OpsFileCommentBaseBackend["content"];
}

export interface OpsFileComment extends OpsFileCommentBase {
  commentId: OpsFileCommentBackend["comment_id"];
  opsFileId: OpsFileCommentBackend["op_id"];
}

export interface OpsfileCommentCreate extends OpsFileCommentBase {
  opsFileid: OpsfileCommentCreateBackend["op_id"];
}

export type OpsFileCommentUpdate = Partial<OpsFileCommentBase>;

/**
 * - - - Operation files
 */

// Backend
export interface OpsFileBaseBackend {
  op_type: string;
  // Locations
  origin_location?: string | null;
  origin_country?: string | null;
  destination_location?: string | null;
  destination_country?: string | null;
  // Schedules
  estimated_time_departure?: string | null; // YYYY-MM-DD
  actual_time_departure?: string | null; // YYYY-MM-DD
  estimated_time_arrival?: string | null; // YYYY-MM-DD
  actual_time_arrival?: string | null; // YYYY-MM-DD
  // Cargo properties
  cargo_description?: string | null;
  units_quantity?: number | null;
  units_type?: string | null;
  gross_weight_value?: number | null;
  gross_weight_unit?: string | null;
  volume_value?: number | null;
  volume_unit?: string | null;
  // Op details
  master_transport_doc?: string | null;
  house_transport_doc?: string | null;
  incoterm?: string | null;
  modality?: string | null;
  voyage?: string | null;
}

// Public interface
export interface OpsFileBackend extends OpsFileBaseBackend {
  op_id: string;
  client: ClientBackend; // There should always be a client
  status: OpsStatusBackend;

  // Providers
  carrier: CarrierBackend | null;
  agents: AgentBackend[];

  comments: OpsFileCommentBackend[];

  created_at: string; // Timestamp
  updated_at: string; // Timestamp
}

export interface OpsFileCreateBackend extends OpsFileBaseBackend {
  client_id: string;
  status_id: OpsStatusBackend["status_id"];
  op_type: OperationType;
  // Providers
  carrier_id: string | null;
  agents_id: string[]; // Could be empty list

  // All rest of properties are inherited and optional
}

export type OpsFileUpdateBackend = Partial<OpsFileCreateBackend>; // Same as create but everything is optional

// Internal

export interface OpsFileBase {
  opType: OpsFileBaseBackend["op_type"];
  // Locations
  originLocation?: OpsFileBaseBackend["origin_location"];
  originCountry?: OpsFileBaseBackend["origin_country"];
  destinationLocation?: OpsFileBaseBackend["destination_location"];
  destinationCountry?: OpsFileBaseBackend["destination_country"];
  // Schedules
  estimatedTimeDeparture?: OpsFileBaseBackend["estimated_time_departure"]; // YYYY-MM-DD
  actualTimeDeparture?: OpsFileBaseBackend["actual_time_departure"]; // YYYY-MM-DD
  estimatedTimeArrival?: OpsFileBaseBackend["estimated_time_arrival"]; // YYYY-MM-DD
  actualTimeArrival?: OpsFileBaseBackend["actual_time_arrival"]; // YYYY-MM-DD
  // Cargo properties
  cargoDescription?: OpsFileBaseBackend["cargo_description"];
  unitsQuantity?: OpsFileBaseBackend["units_quantity"];
  unitsType?: OpsFileBaseBackend["units_type"];
  grossWeightValue?: OpsFileBaseBackend["gross_weight_value"];
  grossWeightUnit?: OpsFileBaseBackend["gross_weight_unit"];
  volumeValue?: OpsFileBaseBackend["volume_value"];
  volumeUnit?: OpsFileBaseBackend["volume_unit"];
  // Op details
  masterTransportDoc?: OpsFileBaseBackend["master_transport_doc"];
  houseTransportDoc?: OpsFileBaseBackend["house_transport_doc"];
  incoterm?: OpsFileBaseBackend["incoterm"];
  modality?: OpsFileBaseBackend["modality"];
  voyage?: OpsFileBaseBackend["voyage"];
}

// Public interface
export interface OpsFile extends OpsFileBase {
  opsFileId: OpsFileBackend["op_id"];
  client: Client; // There should always be a client
  status: OpsStatus;

  // Providers
  carrier: Carrier | null;
  agents: Agent[];

  comments: OpsFileComment[];

  createdAt: OpsFileBackend["created_at"]; // Timestamp
  updatedAt: OpsFileBackend["updated_at"]; // Timestamp
}

export interface OpsFileCreate extends OpsFileBase {
  clientId: OpsFileCreateBackend["client_id"];
  statusId: OpsStatusBackend["status_id"];
  opType: OpsFileCreateBackend["op_type"];
  // Providers
  carrierId: OpsFileCreateBackend["carrier_id"];
  agentsId: OpsFileCreateBackend["agents_id"]; // Could be empty list

  // All rest of properties are inherited and optional
}

export type OpsFileUpdate = Partial<OpsFileCreate>; // Same as create but everything is optional
