"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Country } from "@/modules/geodata/types/countries";

type CountrySelectorProps = {
  countries: Country[];
  isLoading?: boolean;
  value: number | null;
  onValueChange: (value: number | null) => void;
} & Omit<
  React.ComponentProps<typeof Select>,
  "isLoading" | "value" | "onValueChange"
>;

const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  isLoading = false,
  disabled = false,
  value,
  onValueChange,
  ...rest
}) => {
  return (
    <Select
      value={String(value || "")}
      onValueChange={(value) => onValueChange(Number(value))}
      disabled={isLoading || disabled}
      {...rest}
    >
      <SelectTrigger disabled={isLoading || disabled}>
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>

      <SelectContent>
        {!countries.length
          ? null
          : countries.map((country) => (
              <SelectItem
                value={String(country.countryId)}
                key={country.countryId}
              >
                {country.iso2Code} - {country.name}
              </SelectItem>
            ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelector;
