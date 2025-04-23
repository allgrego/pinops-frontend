import { getRoute } from "@/core/lib/routes";
import { serializeCountry } from "@/modules/geodata/lib/countries";
import {
  Partner,
  PartnerBackend,
  PartnerContact,
  PartnerContactBackend,
  PartnerContactCreate,
  PartnerContactCreateBackend,
  PartnerContactUpdate,
  PartnerContactUpdateBackend,
  PartnerCreate,
  PartnerCreateBackend,
  PartnerType,
  PartnerTypeBackend,
  PartnerUpdate,
  PartnerUpdateBackend,
} from "@/modules/partners/types/partners.types";

/**
 * Transform PartnerType from backend to internal schema
 *
 * @param {PartnerTypeBackend} partnerType
 *
 * @return {PartnerType}
 */
const serializePartnerType = (partnerType: PartnerTypeBackend): PartnerType => {
  return {
    partnerTypeId: partnerType?.partner_type_id,
    name: partnerType?.name,
    description: partnerType?.description,
  };
};

/**
 * Get all partner types
 *
 * @return {PartnerType[]}
 */
export const getAllPartnerTypes = async (): Promise<PartnerType[]> => {
  try {
    const url = getRoute("backend-partners-types-get-all");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: PartnerTypeBackend[] | undefined =
      await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const partnerTypes: PartnerType[] = jsonResponse.map((partnerType) =>
      serializePartnerType(partnerType)
    );

    return partnerTypes;
  } catch (error) {
    console.error("Failure getting all partner types", error);
    return Promise.reject(error);
  }
};

/**
 * Get a partner type by ID
 *
 * @return {PartnerType | null}
 */
export const getPartnerTypeById = async (
  partnerTypeId: string
): Promise<PartnerType | null> => {
  try {
    if (!partnerTypeId) throw new Error("Partner type ID not found");

    const url = getRoute("backend-partners-types-by-id-get", [partnerTypeId]);

    const response = await fetch(url);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: PartnerTypeBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const partnerType: PartnerType = serializePartnerType(jsonResponse);

    return partnerType;
  } catch (error) {
    console.error("Failure getting partner type", error);
    return Promise.reject(error);
  }
};

/**
 * - - - Partner contacts
 */

/**
 * Transform partner contact from backend to internal schema
 *
 * @param {PartnerContactBackend} PartnerContact
 *
 * @return {PartnerContact}
 */
const serializePartnerContact = (
  partnerContact: PartnerContactBackend
): PartnerContact => {
  return {
    partnerContactId: partnerContact?.partner_contact_id || "",
    name: partnerContact?.name || "",
    partnerId: partnerContact?.partner_id || "",
    position: partnerContact?.position || null,
    email: partnerContact?.email || null,
    mobile: partnerContact?.mobile || null,
    phone: partnerContact?.phone || null,
    createdAt: partnerContact?.created_at,
    updatedAt: partnerContact?.updated_at,
    disabled: partnerContact?.disabled || false,
  };
};

/**
 * Get all contacts of all partners
 *
 * @return {PartnerContact[]}
 */
export const getAllPartnersContacts = async (): Promise<PartnerContact[]> => {
  try {
    const url = getRoute("backend-partners-contacts-get-all");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: PartnerContactBackend[] | undefined =
      await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const partnerContacts: PartnerContact[] = jsonResponse.map(
      (partnerContact) => serializePartnerContact(partnerContact)
    );

    return partnerContacts;
  } catch (error) {
    console.error("Failure getting all partners contacts", error);
    return Promise.reject(error);
  }
};

/**
 * Get all contacts of a single partner by ID
 *
 * @return {PartnerContact[]}
 */
export const getPartnerContacts = async (
  partnerId: string
): Promise<PartnerContact[]> => {
  try {
    const url = getRoute("backend-partners-by-id-contacts-get", [partnerId]);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: PartnerContactBackend[] | undefined =
      await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const partnerContacts: PartnerContact[] = jsonResponse.map(
      (PartnerContact) => serializePartnerContact(PartnerContact)
    );

    return partnerContacts;
  } catch (error) {
    console.error("Failure getting partner all contacts", error);
    return Promise.reject(error);
  }
};

/**
 * Create a new Partner contact
 *
 * @param {PartnerContactCreate} newPartnerContactData
 *
 * @return {PartnerContact}
 */
export const createPartnerContact = async (
  newPartnerContactData: PartnerContactCreate
): Promise<PartnerContact> => {
  try {
    if (!newPartnerContactData) throw new Error("Data not found");

    // Transform into backend schema
    const backendPayload: PartnerContactCreateBackend = {
      name: newPartnerContactData?.name,
      partner_id: newPartnerContactData?.partnerId,
      email: newPartnerContactData?.email,
      mobile: newPartnerContactData?.mobile,
      phone: newPartnerContactData?.phone,
      position: newPartnerContactData?.position,
      disabled: newPartnerContactData?.disabled,
    };

    const url = getRoute("backend-partners-contacts-create");

    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: PartnerContactBackend | undefined =
      await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const newPartnerContact: PartnerContact =
      serializePartnerContact(jsonResponse);

    return newPartnerContact;
  } catch (error) {
    console.error("Failure creating a partner contact", error);
    return Promise.reject(error);
  }
};

/**
 * Update a Partner contact
 *
 * @param {string} partnerContactId
 * @param {PartnerContactUpdate} newPartnerContactData
 *
 * @return {PartnerContact}
 */
export const updatePartnerContact = async (
  partnerContactId: string,
  newPartnerContactData: PartnerContactUpdate
): Promise<PartnerContact> => {
  try {
    if (!newPartnerContactData) throw new Error("Data not found");

    // Transform into backend schema
    const backendPayload: PartnerContactUpdateBackend = {
      name: newPartnerContactData?.name,
      partner_id: newPartnerContactData?.partnerId,
      email: newPartnerContactData?.email,
      mobile: newPartnerContactData?.mobile,
      phone: newPartnerContactData?.phone,
      position: newPartnerContactData?.position,
      disabled: newPartnerContactData?.disabled,
    };

    const url = getRoute("backend-partners-contacts-by-id-update", [
      partnerContactId,
    ]);

    const response = await fetch(url, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: PartnerContactBackend | undefined =
      await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const updatedPartnerContact: PartnerContact =
      serializePartnerContact(jsonResponse);

    return updatedPartnerContact;
  } catch (error) {
    console.error("Failure updating a Partner contact", error);
    return Promise.reject(error);
  }
};

/**
 * Delete a Partner contact
 *
 * @param {string} partnerContactId
 *
 * @return {{ ok: boolean }}
 */
export const deletePartnerContact = async (
  partnerContactId: string
): Promise<boolean> => {
  try {
    if (!partnerContactId) throw new Error("Partner contact ID not found");

    const url = getRoute("backend-partners-contacts-by-id-delete", [
      partnerContactId,
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
    console.error("Failure deleting a Partner contact", error);
    return Promise.reject(error);
  }
};

/**
 * - - - - Partners
 */

/**
 * Transform partner from backend to internal schema
 *
 * @param {PartnerBackend} partner
 *
 * @return {Partner}
 */
const serializePartner = (partner: PartnerBackend): Partner => {
  return {
    partnerId: partner?.partner_id || "",
    name: partner?.name || "",
    partnerType: serializePartnerType(partner?.partner_type),
    updatedAt: partner?.updated_at,
    webpage: partner?.webpage || "",
    country: !partner?.country ? null : serializeCountry(partner.country),
    taxId: partner?.tax_id || "",
    disabled: partner?.disabled || false,
    createdAt: partner?.created_at,
    contacts: partner?.partner_contacts?.map(
      (contact) => serializePartnerContact(contact) || []
    ),
  };
};

/**
 * Get all Partners
 *
 * @return {Partner[]}
 */
export const getAllPartners = async (): Promise<Partner[]> => {
  try {
    const url = getRoute("backend-partners-get-all");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: PartnerBackend[] | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const Partners: Partner[] = jsonResponse.map((Partner) =>
      serializePartner(Partner)
    );

    return Partners;
  } catch (error) {
    console.error("Failure getting all partners", error);
    return Promise.reject(error);
  }
};

/**
 * Create a new Partner
 *
 * @param {PartnerCreate} newPartnerData
 *
 * @return {Partner}
 */
export const createPartner = async (
  newPartnerData: PartnerCreate
): Promise<Partner> => {
  try {
    if (!newPartnerData) throw new Error("Data not found");

    // Transform into backend schema
    const backendPayload: PartnerCreateBackend = {
      name: newPartnerData?.name,
      country_id: newPartnerData?.countryId,
      webpage: newPartnerData?.webpage,
      tax_id: newPartnerData?.taxId,
      partner_type_id: newPartnerData?.partnerTypeId,
      disabled: newPartnerData?.disabled || false,
      // Initial contacts
      initial_contacts:
        newPartnerData?.contacts?.map((contact) => ({
          name: contact.name,
          email: contact?.email || null,
          mobile: contact?.mobile || null,
          phone: contact?.phone || null,
          position: contact?.position || null,
          disabled: contact?.disabled || false,
        })) || [],
    };

    const url = getRoute("backend-partners-create");

    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: PartnerBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const newPartner: Partner = serializePartner(jsonResponse);

    return newPartner;
  } catch (error) {
    console.error("Failure creating a partner", error);
    return Promise.reject(error);
  }
};

/**
 * Update a Partner
 *
 * @param {string} partnerId
 * @param {PartnerUpdate} newPartnerData
 *
 * @return {Partner}
 */
export const updatePartner = async (
  partnerId: string,
  newPartnerData: PartnerUpdate
): Promise<Partner> => {
  try {
    if (!newPartnerData) throw new Error("Data not found");

    // Transform into backend schema
    const backendPayload: PartnerUpdateBackend = {
      name: newPartnerData?.name,
      country_id: newPartnerData?.countryId,
      webpage: newPartnerData?.webpage,
      tax_id: newPartnerData?.taxId,
      partner_type_id: newPartnerData?.partnerTypeId,
      disabled: newPartnerData?.disabled,
      partner_contacts:
        newPartnerData?.contacts?.map((contact) => ({
          name: contact.name,
          email: contact.email || null,
          mobile: contact.mobile || null,
          phone: contact.phone || null,
          position: contact.position || null,
          disabled: contact?.disabled || false,
        })) || undefined,
    };

    const url = getRoute("backend-partners-by-id-update", [partnerId]);

    const response = await fetch(url, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: PartnerBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform response into internal schema
    const updatedPartner: Partner = serializePartner(jsonResponse);

    return updatedPartner;
  } catch (error) {
    console.error("Failure updating a partner", error);
    return Promise.reject(error);
  }
};

/**
 * Delete a Partner
 *
 * @param {string} partnerId
 *
 * @return {{ ok: boolean }}
 */
export const deletePartner = async (partnerId: string): Promise<boolean> => {
  try {
    if (!partnerId) throw new Error("Partner ID not found");

    const url = getRoute("backend-partners-by-id-delete", [partnerId]);

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
    console.error("Failure deleting a partner", error);
    return Promise.reject(error);
  }
};
