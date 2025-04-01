import countries from "@/modules/geodata/data/countries.json";

import { Country } from "@/modules/geodata/types/countries";

export const allCountries = countries;

/**
 * Get list of all countries
 *
 * @return {Country[]}
 */
export const getAllCountries = (): Country[] => {
  const countries =
    allCountries?.map((country) => ({
      idCountry: country?.id_country,
      countryName: country?.country_name,
      countryIso3: country?.country_iso3,
      countryIso2: country?.country_iso2,
      numericCode: country?.numeric_code,
      phoneCode: String(country?.phone_code || ""),
      capital: country?.capital,
      currency: country?.currency,
      currencyName: country?.currency_name,
      currencySymbol: country?.currency_symbol,
      topLevelDomain: country?.top_level_domain,
      nativeName: country?.native_name,
      region: country?.region,
      subregion: country?.subregion,
      latitude: country?.latitude,
      longitude: country?.longitude,
      emoji: country?.emoji,
      emojiU: country?.emoji_u,
      active: country?.active,
    })) || [];

  return countries;
};

/**
 * Get a country data by ISO 2 code
 *
 * @param {string} iso2Code
 *
 * @return {Country | undefined}
 */
export const getCountryByIso2Code = (iso2Code: string): Country | undefined => {
  const found = allCountries.find(
    (country) => country.country_iso2 === iso2Code
  );

  if (!found) return undefined;

  // Transform into internal schema

  const country: Country = {
    idCountry: found?.id_country,
    countryName: found?.country_name,
    countryIso3: found?.country_iso3,
    countryIso2: found?.country_iso2,
    numericCode: found?.numeric_code,
    phoneCode: String(found?.phone_code || ""),
    capital: found?.capital,
    currency: found?.currency,
    currencyName: found?.currency_name,
    currencySymbol: found?.currency_symbol,
    topLevelDomain: found?.top_level_domain,
    nativeName: found?.native_name,
    region: found?.region,
    subregion: found?.subregion,
    latitude: found?.latitude,
    longitude: found?.longitude,
    emoji: found?.emoji,
    emojiU: found?.emoji_u,
    active: found?.active,
  };

  return country;
};
