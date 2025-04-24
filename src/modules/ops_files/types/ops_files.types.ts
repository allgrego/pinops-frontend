import {
  Carrier,
  CarrierBackend,
} from "@/modules/carriers/types/carriers.types";
import { Client, ClientBackend } from "@/modules/clients/types/clients";
import { Country, CountryBackend } from "@/modules/geodata/types/countries";
import {
  Partner,
  PartnerBackend,
} from "@/modules/partners/types/partners.types";
import { User, UserBackend } from "@/modules/users/types/users.types";

/**
 * - - - Operation types
 */
export const OperationTypes = {
  MARITIME: "maritime",
  AIR: "air",
  ROAD: "road",
  TRAIN: "train",
  OTHER: "other",
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
 * - - - - Operation file cargo packaging
 */
// Backend
export interface OpsFileCargoPackageBaseBackend {
  quantity?: number | null;
  units: string; // # e.g., "boxes", "units", "pallets", etc
}

export interface OpsFileCargoPackageBackend
  extends OpsFileCargoPackageBaseBackend {
  package_id: number;
  op_id: string;
  created_at: string | null;
}

export interface OpsfileCargoPackageCreateBackend
  extends OpsFileCargoPackageBaseBackend {
  op_id: string;
}

export interface OpsfileCargoPackageCreateWithoutOpIdBackend
  extends OpsFileCargoPackageBaseBackend {
  quantity: number | null;
  units: string;
}

export type OpsFileCargoPackageUpdateBackend =
  Partial<OpsFileCargoPackageBaseBackend>;

// Internal
export interface OpsFileCargoPackageBase {
  quantity: OpsFileCargoPackageBaseBackend["quantity"];
  units: OpsFileCargoPackageBaseBackend["units"];
}

export interface OpsFileCargoPackage extends OpsFileCargoPackageBase {
  packageId: OpsFileCargoPackageBackend["package_id"];
  opsFileId: OpsFileCargoPackageBackend["op_id"];
  createdAt: OpsFileCargoPackageBackend["created_at"];
}

export interface OpsfileCargoPackageCreate extends OpsFileCargoPackageBase {
  opsFileid: OpsfileCargoPackageCreateBackend["op_id"];
}

export interface OpsfileCargoPackageCreateWithoutOpId
  extends OpsFileCargoPackageBase {
  quantity: OpsfileCargoPackageCreateWithoutOpIdBackend["quantity"];
  units: OpsfileCargoPackageCreateWithoutOpIdBackend["units"];
}

export type OpsFileCargoPackageUpdate = Partial<OpsFileCargoPackageBase>;

/**
 * - - - Operation file comments
 */

// Backend
export interface OpsFileCommentBaseBackend {
  content: string;
}

export interface OpsFileCommentBackend extends OpsFileCommentBaseBackend {
  comment_id: string;
  op_id: string;
  author?: UserBackend | null;
  created_at: string | null;
}

export interface OpsfileCommentCreateBackend extends OpsFileCommentBaseBackend {
  author_user_id?: string | null;
  op_id: string;
}

export type OpsFileCommentUpdateBackend = Partial<
  OpsFileCommentBaseBackend & {
    author_user_id: string | null;
  }
>;

// Internal
export interface OpsFileCommentBase {
  content: OpsFileCommentBaseBackend["content"];
}

export interface OpsFileComment extends OpsFileCommentBase {
  commentId: OpsFileCommentBackend["comment_id"];
  opsFileId: OpsFileCommentBackend["op_id"];
  author: User | null;
  createdAt: OpsFileCommentBackend["created_at"];
}

export interface OpsfileCommentCreate extends OpsFileCommentBase {
  opsFileid: OpsfileCommentCreateBackend["op_id"];
  authorUserId?: OpsfileCommentCreateBackend["author_user_id"];
}

export type OpsFileCommentUpdate = Partial<
  OpsFileCommentBase & {
    authorUserId: OpsFileCommentUpdateBackend["author_user_id"];
  }
>;

/**
 * - - - Operation files
 */

// Backend
export interface OpsFileBaseBackend {
  op_type: string;
  // Locations
  origin_location?: string | null;
  destination_location?: string | null;
  // Schedules
  estimated_time_departure?: string | null; // YYYY-MM-DD
  actual_time_departure?: string | null; // YYYY-MM-DD
  estimated_time_arrival?: string | null; // YYYY-MM-DD
  actual_time_arrival?: string | null; // YYYY-MM-DD
  // Cargo properties
  cargo_description?: string | null;
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
  // Partners and carrier
  carrier: CarrierBackend | null;
  partners: PartnerBackend[];

  comments: OpsFileCommentBackend[];

  creator: UserBackend | null;
  assignee: UserBackend | null;

  origin_country: CountryBackend | null;
  destination_country: CountryBackend | null;

  packaging: OpsFileCargoPackageBackend[];

  created_at: string; // Timestamp
  updated_at: string; // Timestamp
}

export interface OpsFileCreateBackend extends OpsFileBaseBackend {
  client_id: string;
  status_id: OpsStatusBackend["status_id"];
  op_type: OperationType;
  origin_country_id: CountryBackend["country_id"] | null;
  destination_country_id: CountryBackend["country_id"] | null;
  // Partners and carrier
  carrier_id: string | null;
  partners_id: string[]; // Could be empty list
  // Cargo properties
  cargo_description: string;
  // Users properties
  creator_user_id: string | null;
  assignee_user_id: string | null;

  comment?: Partial<OpsFileCommentBaseBackend> | null; // Only one comment could be added when creating

  packaging: OpsfileCargoPackageCreateWithoutOpIdBackend[]; // Could be empty list
  // All rest of properties are inherited and optional
}

export type OpsFileUpdateBackend = Partial<
  Omit<OpsFileCreateBackend, "comment">
>; // Same as create but everything is optional (excepting comment)

// Internal

export interface OpsFileBase {
  opType: OpsFileBaseBackend["op_type"];
  // Locations
  originLocation?: OpsFileBaseBackend["origin_location"];
  destinationLocation?: OpsFileBaseBackend["destination_location"];
  // Schedules
  estimatedTimeDeparture?: OpsFileBaseBackend["estimated_time_departure"]; // YYYY-MM-DD
  actualTimeDeparture?: OpsFileBaseBackend["actual_time_departure"]; // YYYY-MM-DD
  estimatedTimeArrival?: OpsFileBaseBackend["estimated_time_arrival"]; // YYYY-MM-DD
  actualTimeArrival?: OpsFileBaseBackend["actual_time_arrival"]; // YYYY-MM-DD
  // Cargo properties
  cargoDescription?: OpsFileBaseBackend["cargo_description"];
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

  // Partners and carrier
  carrier: Carrier | null;
  partners: Partner[];

  comments: OpsFileComment[];

  creator: User | null;
  assignee: User | null;

  originCountry: Country | null;
  destinationCountry: Country | null;

  packaging: OpsFileCargoPackage[];

  createdAt: OpsFileBackend["created_at"]; // Timestamp
  updatedAt: OpsFileBackend["updated_at"]; // Timestamp
}

export interface OpsFileCreate extends OpsFileBase {
  clientId: OpsFileCreateBackend["client_id"];
  statusId: OpsStatusBackend["status_id"];
  opType: OpsFileCreateBackend["op_type"];
  originCountryId: Country["countryId"] | null;
  destinationCountryId: Country["countryId"] | null;
  // Partners and carrier
  carrierId: OpsFileCreateBackend["carrier_id"];
  partnersIds: OpsFileCreateBackend["partners_id"]; // Could be empty list
  // Cargo properties
  cargoDescription: OpsFileCreateBackend["cargo_description"];
  // Users properties
  creatorUserId: OpsFileCreateBackend["creator_user_id"];
  assigneeUserId: OpsFileCreateBackend["assignee_user_id"];

  comment?: Partial<OpsFileCommentBase> | null; // Only one comment could be added when creating

  packaging: OpsfileCargoPackageCreateWithoutOpId[]; // Could be empty list
  // All rest of properties are inherited and optional
}

export type OpsFileUpdate = Partial<Omit<OpsFileCreate, "comment">>; // Same as create but everything is optional
