import { getRoute } from "@/core/lib/routes";

import {
  CarrierContact,
  CarrierContactBackend,
  CarrierContactCreate,
  CarrierContactCreateBackend,
  CarrierContactUpdate,
  CarrierContactUpdateBackend,
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
    contacts:
      carrier?.carrier_contacts?.map((carrier) =>
        serializeCarrierContact(carrier)
      ) || [],
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
      // Initial contacts
      initial_contacts:
        newCarrierData?.contacts?.map((contact) => ({
          name: contact.name,
          email: contact?.email || null,
          mobile: contact?.mobile || null,
          phone: contact?.phone || null,
          position: contact?.position || null,
          disabled: contact?.disabled || false,
        })) || [],
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
      carrier_contacts:
        newCarrierData?.contacts?.map((contact) => ({
          name: contact.name,
          email: contact.email || null,
          mobile: contact.mobile || null,
          phone: contact.phone || null,
          position: contact.position || null,
          disabled: contact?.disabled || false,
        })) || undefined,
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

/**
 * - - - Carrier contacts
 */

/**
 * Transform carrier contact from backend to internal schema
 *
 * @param {CarrierContactBackend} carrierContact
 *
 * @return {CarrierContact}
 */
const serializeCarrierContact = (
  carrierContact: CarrierContactBackend
): CarrierContact => {
  return {
    carrierContactId: carrierContact?.carrier_contact_id || "",
    name: carrierContact?.name || "",
    carrierId: carrierContact?.carrier_id || "",
    position: carrierContact?.position || null,
    email: carrierContact?.email || null,
    mobile: carrierContact?.mobile || null,
    phone: carrierContact?.phone || null,
    createdAt: carrierContact?.created_at,
    updatedAt: carrierContact?.updated_at,
    disabled: carrierContact?.disabled || false,
  };
};

/**
 * Get all contacts of all carriers
 *
 * @return {CarrierContact[]}
 */
export const getAllCarriersContacts = async (): Promise<CarrierContact[]> => {
  try {
    const url = getRoute("backend-carriers-contacts-get-all");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: CarrierContactBackend[] | undefined =
      await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const carrierContacts: CarrierContact[] = jsonResponse.map(
      (carrierContact) => serializeCarrierContact(carrierContact)
    );

    return carrierContacts;
  } catch (error) {
    console.error("Failure getting all carriers contacts", error);
    return Promise.reject(error);
  }
};

/**
 * Get all contacts of a single carrier by ID
 *
 * @return {CarrierContact[]}
 */
export const getCarrierContacts = async (
  carrierId: string
): Promise<CarrierContact[]> => {
  try {
    const url = getRoute("backend-carriers-by-id-contacts-get", [carrierId]);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: CarrierContactBackend[] | undefined =
      await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const carrierContacts: CarrierContact[] = jsonResponse.map(
      (carrierContact) => serializeCarrierContact(carrierContact)
    );

    return carrierContacts;
  } catch (error) {
    console.error("Failure getting carrier all contacts", error);
    return Promise.reject(error);
  }
};

/**
 * Create a new carrier contact
 *
 * @param {CarrierContactCreate} newCarrierContactData
 *
 * @return {CarrierContact}
 */
export const createCarrierContact = async (
  newCarrierContactData: CarrierContactCreate
): Promise<CarrierContact> => {
  try {
    if (!newCarrierContactData) throw new Error("Data not found");

    // Transform into backend schema
    const backendPayload: CarrierContactCreateBackend = {
      name: newCarrierContactData?.name,
      carrier_id: newCarrierContactData?.carrierId,
      email: newCarrierContactData?.email,
      mobile: newCarrierContactData?.mobile,
      phone: newCarrierContactData?.phone,
      position: newCarrierContactData?.position,
      disabled: newCarrierContactData?.disabled,
    };

    const url = getRoute("backend-carriers-contacts-create");

    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: CarrierContactBackend | undefined =
      await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const newCarrierContact: CarrierContact =
      serializeCarrierContact(jsonResponse);

    return newCarrierContact;
  } catch (error) {
    console.error("Failure creating a carrier contact", error);
    return Promise.reject(error);
  }
};

/**
 * Update a carrier contact
 *
 * @param {string} carrierContactId
 * @param {CarrierContactUpdate} newCarrierContactData
 *
 * @return {CarrierContact}
 */
export const updateCarrierContact = async (
  carrierContactId: string,
  newCarrierContactData: CarrierContactUpdate
): Promise<CarrierContact> => {
  try {
    if (!newCarrierContactData) throw new Error("Data not found");

    // Transform into backend schema
    const backendPayload: CarrierContactUpdateBackend = {
      name: newCarrierContactData?.name,
      carrier_id: newCarrierContactData?.carrierId,
      email: newCarrierContactData?.email,
      mobile: newCarrierContactData?.mobile,
      phone: newCarrierContactData?.phone,
      position: newCarrierContactData?.position,
      disabled: newCarrierContactData?.disabled,
    };

    const url = getRoute("backend-carriers-contacts-by-id-update", [
      carrierContactId,
    ]);

    const response = await fetch(url, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: CarrierContactBackend | undefined =
      await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const updatedCarrierContact: CarrierContact =
      serializeCarrierContact(jsonResponse);

    return updatedCarrierContact;
  } catch (error) {
    console.error("Failure updating a carrier contact", error);
    return Promise.reject(error);
  }
};

/**
 * Delete a carrier contact
 *
 * @param {string} carrierContactId
 *
 * @return {{ ok: boolean }}
 */
export const deleteCarrierContact = async (
  carrierContactId: string
): Promise<boolean> => {
  try {
    if (!carrierContactId) throw new Error("Carrier contact ID not found");

    const url = getRoute("backend-carriers-contacts-by-id-delete", [
      carrierContactId,
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
    console.error("Failure deleting a carrier contact", error);
    return Promise.reject(error);
  }
};
