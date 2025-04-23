import { getRoute } from "@/core/lib/routes";

import { Country, CountryBackend } from "@/modules/geodata/types/countries";

/**
 * Transform carrier contact from backend to internal schema
 *
 * @param {CountryBackend} country
 *
 * @return {Country}
 */
export const serializeCountry = (country: CountryBackend): Country => {
  return {
    countryId: country.country_id,
    name: country.name,
    iso2Code: country.iso2_code,
    iso3Code: country.iso3_code,
  };
};

/**
 * Get list of all countries
 *
 * @return {Country[]}
 */
export const getAllCountries = async (): Promise<Country[]> => {
  try {
    const url = getRoute("backend-geodata-countries-get-all");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: CountryBackend[] | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const countries: Country[] = jsonResponse.map((country) =>
      serializeCountry(country)
    );

    return countries;
  } catch (error) {
    console.error("Failure getting all countries", error);
    return Promise.reject(error);
  }
};

/**
 * Get a country data by internal ID
 *
 * @param {number} countryId
 *
 * @return {Country | null}
 */
export const getCountryById = async (
  countryId: string
): Promise<Country | null> => {
  try {
    const url = getRoute("backend-geodata-countries-by-id-get", [countryId]);

    const response = await fetch(url);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: CountryBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const country: Country = serializeCountry(jsonResponse);

    return country;
  } catch (error) {
    console.error("Failure getting country by ID", error);
    return Promise.reject(error);
  }
};

/**
 * Get a country data by ISO code (both iso2 and iso3)
 *
 * @param {string} isoCode
 *
 * @return {Country | null}
 */
export const getCountryByIsoCode = async (
  isoCode: string
): Promise<Country | null> => {
  try {
    const url = getRoute("backend-geodata-countries-by-iso-get", [isoCode]);

    const response = await fetch(url);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Invalid response ${response.status}`);
    }

    const jsonResponse: CountryBackend | undefined = await response.json();

    if (!jsonResponse) {
      throw new Error("No JSON data obtained");
    }

    // Transform into internal schema
    const country: Country = serializeCountry(jsonResponse);

    return country;
  } catch (error) {
    console.error("Failure getting country by ISO code", error);
    return Promise.reject(error);
  }
};
