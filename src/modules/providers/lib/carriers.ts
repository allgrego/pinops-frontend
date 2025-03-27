import { BACKEND_BASE_URL } from "@/core/setup/routes";

import {
  type Carrier,
  type CarrierBackend,
  type CarrierCreate,
  type CarrierCreateBackend,
  type CarrierType,
  type CarrierUpdate,
  type CarrierUpdateBackend,
  CarrierTypes,
} from "@/modules/providers/types/carriers.types";

/**
 * Get all carriers
 *
 * @return {Carrier[]}
 */
export const getAllCarriers = async (): Promise<Carrier[]> => {
  try {
    const url = `${BACKEND_BASE_URL}/carriers`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: CarrierBackend[] | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema

    const carriers: Carrier[] = jsonResponse.map((carrier) => ({
      carrierId: carrier?.carrier_id || "",
      type: carrier?.type || "",
      name: carrier?.name || "",
      createdAt: carrier?.created_at,
      contactEmail: carrier?.contact_email,
      contactName: carrier?.contact_name,
      contactPhone: carrier?.contact_phone,
    }));

    return carriers;
  } catch (error) {
    console.error("Failure getting all carriers", error);
    return Promise.reject(`${error}`);
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
      type: newCarrierData?.type,
      contact_email: newCarrierData?.contactEmail,
      contact_name: newCarrierData?.contactName,
      contact_phone: newCarrierData.contactPhone,
    };

    const url = `${BACKEND_BASE_URL}/carriers`;

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
    const newCarrier: Carrier = {
      carrierId: jsonResponse?.carrier_id || "",
      type: jsonResponse?.type || "",
      name: jsonResponse?.name || "",
      createdAt: jsonResponse?.created_at,
      contactEmail: jsonResponse?.contact_email,
      contactName: jsonResponse?.contact_name,
      contactPhone: jsonResponse?.contact_phone,
    };

    return newCarrier;
  } catch (error) {
    console.error("Failure creating a carrier", error);
    return Promise.reject(`${error}`);
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
      type: newCarrierData?.type,
      contact_email: newCarrierData?.contactEmail,
      contact_name: newCarrierData?.contactName,
      contact_phone: newCarrierData?.contactPhone,
    };

    const url = `${BACKEND_BASE_URL}/carriers/${carrierId}`;

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
    const updatedCarrier: Carrier = {
      carrierId: jsonResponse?.carrier_id || "",
      type: jsonResponse?.type || "",
      name: jsonResponse?.name || "",
      createdAt: jsonResponse?.created_at,
      contactEmail: jsonResponse?.contact_email,
      contactName: jsonResponse?.contact_name,
      contactPhone: jsonResponse?.contact_phone,
    };

    return updatedCarrier;
  } catch (error) {
    console.error("Failure updating a carrier", error);
    return Promise.reject(`${error}`);
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

    const url = `${BACKEND_BASE_URL}/carriers/${carrierId}`;

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
    console.error("Failure updating a carrier", error);
    return Promise.reject(`${error}`);
  }
};

export const getCarrierTypeName = (carrierType: CarrierType): string => {
  const names: Record<CarrierType, string> = {
    [CarrierTypes.AIRLINE]: "Airline",
    [CarrierTypes.SHIPPING_LINE]: "Shipping line",
    [CarrierTypes.ROAD_FREIGHT_COMPANY]: "Trucking company",
    [CarrierTypes.RAILWAY_COMPANY]: "Railway company",
  };

  return String(names?.[carrierType] || carrierType);
};
