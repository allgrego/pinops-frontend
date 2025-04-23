/**
 * - - - Countries
 */
// Backend
export interface CountryBaseBackend {
  name: string;
  iso2_code: string;
  iso3_code: string;
}

export interface CountryBackend extends CountryBaseBackend {
  country_id: number;
}

// Internal
export interface CountryBase {
  name: CountryBaseBackend["name"];
  iso2Code: CountryBaseBackend["iso2_code"];
  iso3Code: CountryBaseBackend["iso3_code"];
}

export interface Country extends CountryBase {
  countryId: CountryBackend["country_id"];
}
