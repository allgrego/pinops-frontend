import { getRoute } from "@/core/lib/routes";

import {
  CarrierTypeBackend,
  type Carrier,
  type CarrierBackend,
  type CarrierCreate,
  type CarrierCreateBackend,
  type CarrierType,
  type CarrierUpdate,
  type CarrierUpdateBackend,
} from "@/modules/carriers/types/carriers.types";

/**
 * Transform carrierType from backend to internal schema
 *
 * @param {CarrierTypeBackend} carrierType
 *
 * @return {CarrierType}
 */
const serializeCarrierType = (carrierType: CarrierTypeBackend): CarrierType => {
  return {
    carrierTypeId: carrierType?.carrier_type_id,
    name: carrierType?.name,
    description: carrierType?.description,
  };
};

/**
 * Get all carrier types
 *
 * @return {CarrierType[]}
 */
export const getAllCarrierTypes = async (): Promise<CarrierType[]> => {
  try {
    const url = getRoute("backend-carriers-types-get-all");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: CarrierTypeBackend[] | undefined =
      await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const carrierTypes: CarrierType[] = jsonResponse.map((carrierType) =>
      serializeCarrierType(carrierType)
    );

    return carrierTypes;
  } catch (error) {
    console.error("Failure getting all carrier types", error);
    return Promise.reject(error);
  }
};

/**
 * Get all carrier types
 *
 * @return {CarrierType | null}
 */
export const getCarrierTypeById = async (
  carrierTypeId: string
): Promise<CarrierType | null> => {
  try {
    if (!carrierTypeId) throw new Error("Carrier type ID not found");

    const url = getRoute("backend-carriers-types-by-id-get", [carrierTypeId]);

    const response = await fetch(url);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: CarrierTypeBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const carrierType: CarrierType = serializeCarrierType(jsonResponse);

    return carrierType;
  } catch (error) {
    console.error("Failure getting carrier type", error);
    return Promise.reject(error);
  }
};

/**
 * Transform carrier from backend to internal schema
 *
 * @param {CarrierBackend} carrier
 *
 * @return {Carrier}
 */
const serializeCarrier = (carrier: CarrierBackend): Carrier => {
  return {
    carrierId: carrier?.carrier_id || "",
    name: carrier?.name || "",
    carrierType: serializeCarrierType(carrier?.carrier_type),
    updatedAt: carrier?.updated_at,
    taxId: carrier?.tax_id || "",
    disabled: carrier?.disabled || false,
    createdAt: carrier?.created_at,
  };
};

/**
 * Get all carriers
 *
 * @return {Carrier[]}
 */
export const getAllCarriers = async (): Promise<Carrier[]> => {
  try {
    const url = getRoute("backend-carriers-get-all");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: CarrierBackend[] | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const carriers: Carrier[] = jsonResponse.map((carrier) =>
      serializeCarrier(carrier)
    );

    return carriers;
  } catch (error) {
    console.error("Failure getting all carriers", error);
    return Promise.reject(error);
  }
};

/**
 * Create a new carrier
 *
 * @param {CarrierCreate} newCarrierData
 *
 * @return {Carrier}
 */
export const createCarrier = async (
  newCarrierData: CarrierCreate
): Promise<Carrier> => {
  try {
    if (!newCarrierData) throw new Error("Data not found");

    // Transform into backend schema
    const backendPayload: CarrierCreateBackend = {
      name: newCarrierData?.name,
      tax_id: newCarrierData?.taxId,
      carrier_type_id: newCarrierData?.carrierTypeId,
      disabled: newCarrierData?.disabled || false,
    };

    const url = getRoute("backend-carriers-create");

    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: CarrierBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const newCarrier: Carrier = serializeCarrier(jsonResponse);

    return newCarrier;
  } catch (error) {
    console.error("Failure creating a carrier", error);
    return Promise.reject(error);
  }
};

/**
 * Update a carrier
 *
 * @param {string} carrierId
 * @param {CarrierUpdate} newCarrierData
 *
 * @return {Carrier}
 */
export const updateCarrier = async (
  carrierId: string,
  newCarrierData: CarrierUpdate
): Promise<Carrier> => {
  try {
    if (!newCarrierData) throw new Error("Data not found");

    // Transform into backend schema
    const backendPayload: CarrierUpdateBackend = {
      name: newCarrierData?.name,
      tax_id: newCarrierData?.taxId,
      carrier_type_id: newCarrierData?.carrierTypeId,
      disabled: newCarrierData?.disabled,
    };

    const url = getRoute("backend-carriers-by-id-update", [carrierId]);

    const response = await fetch(url, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: CarrierBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const updatedCarrier: Carrier = serializeCarrier(jsonResponse);

    return updatedCarrier;
  } catch (error) {
    console.error("Failure updating a carrier", error);
    return Promise.reject(error);
  }
};

/**
 * Delete a carrier
 *
 * @param {string} carrierId
 *
 * @return {{ ok: boolean }}
 */
export const deleteCarrier = async (carrierId: string): Promise<boolean> => {
  try {
    if (!carrierId) throw new Error("Carrier ID not found");

    const url = getRoute("backend-carriers-by-id-delete", [carrierId]);

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
    console.error("Failure deleting a carrier", error);
    return Promise.reject(error);
  }
};
