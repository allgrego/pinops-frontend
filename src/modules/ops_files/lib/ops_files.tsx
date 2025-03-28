import { BACKEND_BASE_URL } from "@/core/setup/routes";
import type { Client } from "@/modules/clients/types/clients";
import {
  OperationType,
  OperationTypes,
  OpsFile,
  OpsFileBackend,
  OpsFileComment,
  OpsFileCreate,
  OpsFileCreateBackend,
  OpsFileUpdate,
  OpsFileUpdateBackend,
  OpsStatus,
} from "@/modules/ops_files/types/ops_files.types";
import { Agent } from "@/modules/providers/types/agents";
import { Carrier } from "@/modules/providers/types/carriers.types";
import { HelpCircle, Plane, Ship, Train, Truck } from "lucide-react";
import { JSX } from "react";

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

    const serializedClient: Client = {
      clientId: opFile?.client?.client_id,
      name: opFile?.client?.name,
      contactEmail: opFile?.client?.contact_email,
      contactName: opFile?.client?.contact_name,
      contactPhone: opFile?.client?.contact_phone,
      taxId: opFile?.client?.tax_id,
      createdAt: opFile?.client?.created_at,
    };

    const serlalizedAgents: Agent[] =
      // Iterate on each agent to transform into internal schema
      opFile?.agents?.map((agentBackend) => {
        const internalAgent: Agent = {
          agentId: agentBackend?.agent_id,
          name: agentBackend?.name,
          contactName: agentBackend?.contact_name,
          contactEmail: agentBackend?.contact_email,
          contactPhone: agentBackend?.contact_phone,
          createdAt: agentBackend?.created_at,
        };

        return internalAgent;
      }) || []; // Empty array by default

    const serializedCarrier: Carrier | null = !opFile?.carrier
      ? null
      : {
          carrierId: opFile.carrier?.carrier_id,
          name: opFile.carrier?.name,
          type: opFile.carrier?.type,
          contactEmail: opFile.carrier?.contact_email,
          contactName: opFile.carrier?.contact_name,
          contactPhone: opFile.carrier?.contact_phone,
          createdAt: opFile.carrier?.created_at,
        };

    const serializedComments: OpsFileComment[] =
      // Iterate on each comment to transform into internal schema
      opFile?.comments?.map((commentBackend) => {
        const comment: OpsFileComment = {
          commentId: commentBackend?.comment_id,
          author: commentBackend?.author,
          content: commentBackend?.content,
          opsFileId: commentBackend?.op_id,
        };

        return comment;
      }) || [];

    const serializedOpsFile: OpsFile = {
      opsFileId: opFile?.op_id,
      opType: opFile?.op_type,
      status: serializedStatus,
      client: serializedClient,

      // Providers
      agents: serlalizedAgents,
      carrier: serializedCarrier,

      // Locations
      originLocation: opFile?.origin_location,
      originCountry: opFile?.origin_country,
      destinationLocation: opFile?.destination_location,
      destinationCountry: opFile?.destination_country,
      // Schedules
      estimatedTimeDeparture: opFile?.estimated_time_departure,
      actualTimeDeparture: opFile?.actual_time_departure,
      estimatedTimeArrival: opFile?.estimated_time_arrival,
      actualTimeArrival: opFile?.actual_time_arrival,
      // Cargo properties
      cargoDescription: opFile?.cargo_description,
      unitsQuantity: opFile?.units_quantity,
      unitsType: opFile?.units_type,
      grossWeightValue: opFile?.gross_weight_value,
      grossWeightUnit: opFile?.gross_weight_unit,
      volumeValue: opFile?.volume_value,
      volumeUnit: opFile?.volume_unit,
      // Op details
      masterTransportDoc: opFile?.master_transport_doc,
      houseTransportDoc: opFile?.house_transport_doc,
      incoterm: opFile?.incoterm,
      modality: opFile?.modality,
      voyage: opFile?.voyage,

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
    const url = `${BACKEND_BASE_URL}/ops`;

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
      // Providers
      carrier_id: newOpsFileData?.carrierId,
      agents_id: newOpsFileData?.agentsId || [],
      // Locations
      origin_location: newOpsFileData?.originLocation,
      origin_country: newOpsFileData?.originCountry,
      destination_location: newOpsFileData?.destinationLocation,
      destination_country: newOpsFileData?.destinationCountry,
      // Schedules
      estimated_time_departure: newOpsFileData?.estimatedTimeDeparture,
      actual_time_departure: newOpsFileData?.actualTimeDeparture,
      estimated_time_arrival: newOpsFileData?.estimatedTimeArrival,
      actual_time_arrival: newOpsFileData?.actualTimeArrival,
      // Cargo properties
      cargo_description: newOpsFileData?.cargoDescription,
      units_quantity: newOpsFileData?.unitsQuantity,
      units_type: newOpsFileData?.unitsType,
      gross_weight_value: newOpsFileData?.grossWeightValue,
      gross_weight_unit: newOpsFileData?.grossWeightUnit,
      volume_value: newOpsFileData?.volumeValue,
      volume_unit: newOpsFileData?.volumeUnit,
      // Op details
      master_transport_doc: newOpsFileData?.masterTransportDoc,
      house_transport_doc: newOpsFileData?.houseTransportDoc,
      incoterm: newOpsFileData?.incoterm,
      modality: newOpsFileData?.modality,
      voyage: newOpsFileData?.voyage,
    };

    const url = `${BACKEND_BASE_URL}/ops`;

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
    if (!newOpsFileData) throw new Error("Data not found");

    // Transform into backend schema
    const backendPayload: OpsFileUpdateBackend = {
      client_id: newOpsFileData?.clientId,
      status_id: newOpsFileData?.statusId,
      op_type: newOpsFileData?.opType,
      // Providers
      carrier_id: newOpsFileData?.carrierId,
      agents_id: newOpsFileData?.agentsId,
      // Locations
      origin_location: newOpsFileData?.originLocation,
      origin_country: newOpsFileData?.originCountry,
      destination_location: newOpsFileData?.destinationLocation,
      destination_country: newOpsFileData?.destinationCountry,
      // Schedules
      estimated_time_departure: newOpsFileData?.estimatedTimeDeparture,
      actual_time_departure: newOpsFileData?.actualTimeDeparture,
      estimated_time_arrival: newOpsFileData?.estimatedTimeArrival,
      actual_time_arrival: newOpsFileData?.actualTimeArrival,
      // Cargo properties
      cargo_description: newOpsFileData?.cargoDescription,
      units_quantity: newOpsFileData?.unitsQuantity,
      units_type: newOpsFileData?.unitsType,
      gross_weight_value: newOpsFileData?.grossWeightValue,
      gross_weight_unit: newOpsFileData?.grossWeightUnit,
      volume_value: newOpsFileData?.volumeValue,
      volume_unit: newOpsFileData?.volumeUnit,
      // Op details
      master_transport_doc: newOpsFileData?.masterTransportDoc,
      house_transport_doc: newOpsFileData?.houseTransportDoc,
      incoterm: newOpsFileData?.incoterm,
      modality: newOpsFileData?.modality,
      voyage: newOpsFileData?.voyage,
    };

    const url = `${BACKEND_BASE_URL}/ops/${opsFileId}`;

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

    const url = `${BACKEND_BASE_URL}/ops/${opsFileId}`;

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
export const getOpsTypeIcon = (type: string) => {
  const icons: Record<OperationType, JSX.Element> = {
    [OperationTypes.MARITIME]: <Ship />,
    [OperationTypes.AIR]: <Plane />,
    [OperationTypes.ROAD]: <Truck />,
    [OperationTypes.TRAIN]: <Train />,
  };

  return icons?.[type as OperationType] || <HelpCircle />;
};

/**
 * Name for Operation type
 *
 * @param {string} type
 *
 * @return {string}
 */
export const getOpsTypeName = (type: string) => {
  const names: Record<OperationType, string> = {
    [OperationTypes.MARITIME]: "Maritime",
    [OperationTypes.AIR]: "Air",
    [OperationTypes.ROAD]: "Road",
    [OperationTypes.TRAIN]: "Train",
  };

  return names?.[type as OperationType] || type;
};
