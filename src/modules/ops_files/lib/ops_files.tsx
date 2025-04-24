import {
  CircleHelp,
  HelpCircle,
  Plane,
  Ship,
  Train,
  Truck,
} from "lucide-react";
import { JSX } from "react";

import { numberOrNull } from "@/core/lib/numbers";
import { getRoute } from "@/core/lib/routes";
import { serializeCarrier } from "@/modules/carriers/lib/carriers";
import { Carrier } from "@/modules/carriers/types/carriers.types";
import { serializeClient } from "@/modules/clients/lib/clients";
import type { Client } from "@/modules/clients/types/clients";
import { serializeCountry } from "@/modules/geodata/lib/countries";
import {
  OperationType,
  OperationTypes,
  OpsFile,
  OpsFileBackend,
  OpsFileCargoPackage,
  OpsFileCargoPackageBackend,
  OpsFileComment,
  OpsFileCommentBackend,
  OpsfileCommentCreate,
  OpsfileCommentCreateBackend,
  OpsFileCreate,
  OpsFileCreateBackend,
  OpsFileUpdate,
  OpsFileUpdateBackend,
  OpsStatus,
} from "@/modules/ops_files/types/ops_files.types";
import { serializePartner } from "@/modules/partners/lib/partners";
import { Partner } from "@/modules/partners/types/partners.types";
import { serializeUser } from "@/modules/users/lib/users";

/**
 *  - - - Units types options
 */
export const CargoUnitTypes = {
  UNIT: "unit",
  BOX: "box",
  PALLET: "pallet",
  PACKAGE: "package",
  DRUM: "drum",
  CONTAINER: "container",
  BARREL: "barrel",
  LOOSE_CARGO: "loose_cargo", // aka break bulk
  // Add others here
} as const;

export type CargoUnitTypeKey = keyof typeof CargoUnitTypes;

export type CargoUnitType = (typeof CargoUnitTypes)[CargoUnitTypeKey];

/**
 *  - - - Gross weight units options
 */
export const WeightUnits = {
  KG: "kg",
  LB: "lb",
  // Add others here
} as const;

export type WeightUnitKey = keyof typeof WeightUnits;

export type WeightUnit = (typeof WeightUnits)[WeightUnitKey];

/**
 *  - - - Volume units options
 */
export const VolumeUnits = {
  M3: "m3",
  FT3: "ft3",
  // Add others here
} as const;

export type VolumeUnitKey = keyof typeof VolumeUnits;

export type VolumeUnit = (typeof VolumeUnits)[VolumeUnitKey];

/**
 * - - - Lists of all options
 */

export const allOperationTypes = Object.values(OperationTypes);

export const allWeightUnits = Object.values(WeightUnits);

export const allCargoUnitTypes = Object.values(CargoUnitTypes);

export const allVolumeUnits = Object.values(VolumeUnits);

/**
 * - - - - -  Ops file Comments helpers
 */

/**
 * Transform an ops file comment from backend schema into internal schema
 *
 * @param {OpsFileCommentBackend} comment
 *
 * @returns {OpsFileComment}
 */
export const serializeOpsFileComment = (
  comment: OpsFileCommentBackend
): OpsFileComment => {
  const serializedComment: OpsFileComment = {
    commentId: comment.comment_id,
    opsFileId: comment.op_id,
    author: !comment?.author ? null : serializeUser(comment.author),
    content: comment.content,
    createdAt: comment.created_at,
  };

  return serializedComment;
};

/**
 * Create a new ops file comment
 *
 * @param {OpsfileCommentCreate} newCommentData
 *
 * @return {OpsFileComment}
 */
export const createOpsFileComment = async (
  newCommentData: OpsfileCommentCreate
): Promise<OpsFileComment> => {
  try {
    if (!newCommentData) throw new Error("Data not found");

    if (!newCommentData?.content) throw new Error("Comment content not found");

    const opsFileId = newCommentData?.opsFileid;

    if (!opsFileId) throw new Error("Operation ID not found");

    // Transform payload into backend schema
    const backendPayload: OpsfileCommentCreateBackend = {
      op_id: opsFileId,
      author_user_id: newCommentData.authorUserId,
      content: newCommentData?.content,
    };

    const url = getRoute("backend-ops-files-comments-create");

    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: OpsFileCommentBackend | undefined =
      await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const newComment: OpsFileComment = serializeOpsFileComment(jsonResponse);

    return newComment;
  } catch (error) {
    console.error("Failure creating an ops file comment", error);
    return Promise.reject(`${error}`);
  }
};

/**
 * Delete an ops file comment
 *
 * @param {string} commentId
 *
 * @return {{ ok: boolean }}
 */
export const deleteOpsFileComment = async (
  commentId: string
): Promise<boolean> => {
  try {
    if (!commentId) throw new Error("Comment ID not found");

    const url = getRoute("backend-ops-files-comments-by-id-delete", [
      commentId,
    ]);

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
    console.error("Failure deleting an ops file comment", error);
    return Promise.reject(`${error}`);
  }
};

/**
 * - - - - Ops file packaging helpers
 */

/**
 * Transform an ops file cargo package from backend schema into internal schema
 *
 * @param {OpsFileCargoPackageBackend} packaging
 *
 * @returns {OpsFileCargoPackage}
 */
export const serializeOpsFileCargoPackage = (
  packaging: OpsFileCargoPackageBackend
): OpsFileCargoPackage => {
  const serializedPackaging: OpsFileCargoPackage = {
    packageId: packaging.package_id,
    opsFileId: packaging.op_id,
    quantity: numberOrNull(packaging?.quantity),
    units: packaging?.units,
    createdAt: packaging?.created_at,
  };

  return serializedPackaging;
};

/**
 * - - - - Ops files helpers
 */

/**
 * Transform an ops file from backend schema into internal schema
 *
 * @param {OpsFileBackend} opFile
 *
 * @return {OpsFile} Serialized ops file
 */
export const serializeOpsFile = (opFile: OpsFileBackend): OpsFile => {
  try {
    const serializedStatus: OpsStatus = {
      statusId: opFile?.status?.status_id,
      statusName: opFile?.status?.status_name,
    };

    const serializedClient: Client = serializeClient(opFile.client);

    const serializedPartners: Partner[] =
      // Iterate on each partner to transform into internal schema
      opFile?.partners?.map((partner) => serializePartner(partner)) || []; // Empty array by default

    const serializedCarrier: Carrier | null = !opFile?.carrier
      ? null
      : serializeCarrier(opFile.carrier);

    const serializedComments: OpsFileComment[] =
      // Iterate on each comment to transform into internal schema
      opFile?.comments?.map((commentBackend) =>
        serializeOpsFileComment(commentBackend)
      ) || [];

    const serializedPackages: OpsFileCargoPackage[] =
      opFile?.packaging?.map((packaging) =>
        serializeOpsFileCargoPackage(packaging)
      ) || [];

    const serializedOpsFile: OpsFile = {
      opsFileId: opFile?.op_id,
      opType: opFile?.op_type,
      status: serializedStatus,
      client: serializedClient,

      // Partners and carrier
      partners: serializedPartners,
      carrier: serializedCarrier,

      // Locations
      originLocation: opFile?.origin_location,
      originCountry: !opFile?.origin_country
        ? null
        : serializeCountry(opFile.origin_country),
      destinationLocation: opFile?.destination_location,
      destinationCountry: !opFile?.destination_country
        ? null
        : serializeCountry(opFile.destination_country),
      // Schedules
      estimatedTimeDeparture: opFile?.estimated_time_departure,
      actualTimeDeparture: opFile?.actual_time_departure,
      estimatedTimeArrival: opFile?.estimated_time_arrival,
      actualTimeArrival: opFile?.actual_time_arrival,
      // Cargo properties
      cargoDescription: opFile?.cargo_description,
      grossWeightValue: opFile?.gross_weight_value,
      grossWeightUnit: opFile?.gross_weight_unit,
      volumeValue: opFile?.volume_value,
      volumeUnit: opFile?.volume_unit,
      packaging: serializedPackages,
      // Op details
      masterTransportDoc: opFile?.master_transport_doc,
      houseTransportDoc: opFile?.house_transport_doc,
      incoterm: opFile?.incoterm,
      modality: opFile?.modality,
      voyage: opFile?.voyage,
      // Users
      assignee: !opFile?.assignee ? null : serializeUser(opFile.assignee),
      creator: !opFile?.creator ? null : serializeUser(opFile.creator),

      comments: serializedComments,
      createdAt: opFile?.created_at,
      updatedAt: opFile?.updated_at,
    };

    return serializedOpsFile;
  } catch (error) {
    console.error("Failure serializing OpsFile", error);
    throw error;
  }
};

/**
 * Get all ops files
 *
 * @return {OpsFile[]}
 */
export const getAllOpsFiles = async (): Promise<OpsFile[]> => {
  try {
    const url = getRoute("backend-ops-files-get-all");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: OpsFileBackend[] | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const opsFiles: OpsFile[] = jsonResponse.map((opFile) =>
      serializeOpsFile(opFile)
    );

    return opsFiles;
  } catch (error) {
    console.error("Failure getting all ops files", error);
    return Promise.reject(`${error}`);
  }
};

/**
 * Get ops file by id
 *
 * @return {OpsFile | null} Ops file data if valid ID. Otherwise, null
 */
export const getOpsFile = async (id: string): Promise<OpsFile | null> => {
  try {
    if (!id) throw new Error("Ops file ID not found");

    const url = getRoute("backend-ops-files-by-id-get", [id]);

    const response = await fetch(url);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: OpsFileBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const opsFiles: OpsFile = serializeOpsFile(jsonResponse);

    return opsFiles;
  } catch (error) {
    console.error("Failure getting all ops files", error);
    throw error;
  }
};

/**
 * Create a new ops file
 *
 * @param {OpsFileCreate} newClientData
 *
 * @return {Client}
 */
export const createOpsFile = async (
  newOpsFileData: OpsFileCreate
): Promise<OpsFile> => {
  try {
    if (!newOpsFileData) throw new Error("Data not found");

    // Transform payload into backend schema
    const backendPayload: OpsFileCreateBackend = {
      client_id: newOpsFileData?.clientId,
      status_id: newOpsFileData?.statusId,
      op_type: newOpsFileData?.opType,
      // Carrier and partners
      carrier_id: newOpsFileData?.carrierId,
      partners_id: newOpsFileData?.partnersIds || [],

      // Locations
      origin_location: newOpsFileData?.originLocation,
      origin_country_id: newOpsFileData?.originCountryId,
      destination_location: newOpsFileData?.destinationLocation,
      destination_country_id: newOpsFileData?.destinationCountryId,
      // Schedules
      estimated_time_departure: newOpsFileData?.estimatedTimeDeparture,
      actual_time_departure: newOpsFileData?.actualTimeDeparture,
      estimated_time_arrival: newOpsFileData?.estimatedTimeArrival,
      actual_time_arrival: newOpsFileData?.actualTimeArrival,
      // Cargo properties
      cargo_description: newOpsFileData?.cargoDescription,
      gross_weight_value: newOpsFileData?.grossWeightValue,
      gross_weight_unit: newOpsFileData?.grossWeightUnit,
      volume_value: newOpsFileData?.volumeValue,
      volume_unit: newOpsFileData?.volumeUnit,
      packaging:
        newOpsFileData?.packaging?.map((packaging) => ({
          units: packaging.units,
          quantity: numberOrNull(packaging?.quantity),
        })) || [],
      // Op details
      master_transport_doc: newOpsFileData?.masterTransportDoc,
      house_transport_doc: newOpsFileData?.houseTransportDoc,
      incoterm: newOpsFileData?.incoterm,
      modality: newOpsFileData?.modality,
      voyage: newOpsFileData?.voyage,
      // Others
      comment: newOpsFileData?.comment,
      assignee_user_id: newOpsFileData.assigneeUserId,
      creator_user_id: newOpsFileData.creatorUserId,
    };

    const url = getRoute("backend-ops-files-create");

    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: OpsFileBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const newOpsFile: OpsFile = serializeOpsFile(jsonResponse);

    return newOpsFile;
  } catch (error) {
    console.error("Failure creating an ops file", error);
    return Promise.reject(`${error}`);
  }
};

/**
 * Update an ops file
 *
 * @param {string} opsFileId
 * @param {OpsFileUpdate} newOpsFileData
 *
 * @return {OpsFile}
 */
export const updateOpsFile = async (
  opsFileId: string,
  newOpsFileData: OpsFileUpdate
): Promise<OpsFile> => {
  try {
    if (!opsFileId) throw new Error("Ops file ID not found");

    if (!newOpsFileData) throw new Error("Data not found");

    // Transform into backend schema
    const backendPayload: OpsFileUpdateBackend = {
      client_id: newOpsFileData?.clientId,
      status_id: newOpsFileData?.statusId,
      op_type: newOpsFileData?.opType,
      // Carrier and partners
      carrier_id: newOpsFileData?.carrierId,
      partners_id: newOpsFileData?.partnersIds || [],
      // Locations
      origin_location: newOpsFileData?.originLocation,
      origin_country_id: newOpsFileData?.originCountryId,
      destination_location: newOpsFileData?.destinationLocation,
      destination_country_id: newOpsFileData?.destinationCountryId,
      // Schedules
      estimated_time_departure: newOpsFileData?.estimatedTimeDeparture,
      actual_time_departure: newOpsFileData?.actualTimeDeparture,
      estimated_time_arrival: newOpsFileData?.estimatedTimeArrival,
      actual_time_arrival: newOpsFileData?.actualTimeArrival,
      // Cargo properties
      cargo_description: newOpsFileData?.cargoDescription,
      gross_weight_value: newOpsFileData?.grossWeightValue,
      gross_weight_unit: newOpsFileData?.grossWeightUnit,
      volume_value: newOpsFileData?.volumeValue,
      volume_unit: newOpsFileData?.volumeUnit,
      packaging: newOpsFileData?.packaging?.map?.((packaging) => ({
        units: packaging.units,
        quantity: numberOrNull(packaging?.quantity),
      })),
      // Op details
      master_transport_doc: newOpsFileData?.masterTransportDoc,
      house_transport_doc: newOpsFileData?.houseTransportDoc,
      incoterm: newOpsFileData?.incoterm,
      modality: newOpsFileData?.modality,
      voyage: newOpsFileData?.voyage,
      // Others
      assignee_user_id: newOpsFileData?.assigneeUserId,
      creator_user_id: newOpsFileData?.creatorUserId,
    };

    const url = getRoute("backend-ops-files-by-id-update", [opsFileId]);

    const response = await fetch(url, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: OpsFileBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const updatedOpsFile: OpsFile = serializeOpsFile(jsonResponse);

    return updatedOpsFile;
  } catch (error) {
    console.error("Failure updating a client", error);
    return Promise.reject(`${error}`);
  }
};

/**
 * Delete an ops file
 *
 * @param {string} opsFileId
 *
 * @return {{ ok: boolean }}
 */
export const deleteOpsFile = async (opsFileId: string): Promise<boolean> => {
  try {
    if (!opsFileId) throw new Error("Ops file ID not found");

    const url = getRoute("backend-ops-files-by-id-delete", [opsFileId]);

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
    console.error("Failure deleting an ops file", error);
    return Promise.reject(`${error}`);
  }
};

/**
 * Icon for Operation type
 *
 * @param {string} type
 *
 * @return {JSX.Element}
 */
export const getOpsTypeIcon = (
  type: string,
  IconProps?: { className?: string }
) => {
  const icons: Record<OperationType, JSX.Element> = {
    [OperationTypes.MARITIME]: <Ship {...IconProps} />,
    [OperationTypes.AIR]: <Plane {...IconProps} />,
    [OperationTypes.ROAD]: <Truck {...IconProps} />,
    [OperationTypes.TRAIN]: <Train {...IconProps} />,
    [OperationTypes.OTHER]: <CircleHelp {...IconProps} />,
  };

  return icons?.[type as OperationType] || <HelpCircle {...IconProps} />;
};

/**
 * Name for Operation type
 *
 * @param {string} type
 *
 * @return {string}
 */
export const getOpsTypeName = (type: string, defaultValue?: string) => {
  const names: Record<OperationType, string> = {
    [OperationTypes.MARITIME]: "Maritime",
    [OperationTypes.AIR]: "Air",
    [OperationTypes.ROAD]: "Road",
    [OperationTypes.TRAIN]: "Train",
    [OperationTypes.OTHER]: "Other",
  };

  return names?.[type as OperationType] || defaultValue || type;
};

/**
 * Name for cargo unit type
 *
 * @param {string} type
 * @param {boolean} singular
 *
 * @return {string}
 */
export const getCargoUnitTypesName = (type: string, singular = false) => {
  const names: Record<CargoUnitType, { plural: string; singular: string }> = {
    [CargoUnitTypes.UNIT]: {
      plural: "units",
      singular: "unit",
    },
    [CargoUnitTypes.BOX]: {
      plural: "boxes",
      singular: "box",
    },
    [CargoUnitTypes.PALLET]: {
      plural: "pallets",
      singular: "pallet",
    },
    [CargoUnitTypes.PACKAGE]: {
      plural: "packages",
      singular: "package",
    },
    [CargoUnitTypes.DRUM]: {
      plural: "drums",
      singular: "drum",
    },
    [CargoUnitTypes.CONTAINER]: {
      plural: "containers",
      singular: "container",
    },
    [CargoUnitTypes.BARREL]: {
      plural: "barrels",
      singular: "barrel",
    },
    [CargoUnitTypes.LOOSE_CARGO]: {
      plural: "loose cargo",
      singular: "loose cargo",
    },
  };

  return (
    names?.[type as CargoUnitType]?.[singular ? "singular" : "plural"] || type
  );
};

/**
 * Name for cargo weight units
 *
 * @param {string} unit
 *
 * @return {string}
 */
export const getWeightUnitName = (unit: string) => {
  const names: Record<WeightUnit, string> = {
    [WeightUnits.KG]: "Kg",
    [WeightUnits.LB]: "Lb",
  };

  return names?.[unit as WeightUnit] || unit;
};

/**
 * Name for volume units
 *
 * @param {string} unit
 *
 * @return {string}
 */
export const getVolumeUnitName = (unit: string) => {
  const names: Record<VolumeUnit, string> = {
    [VolumeUnits.M3]: "m³",
    [VolumeUnits.FT3]: "ft³",
  };

  return names?.[unit as VolumeUnit] || unit;
};
