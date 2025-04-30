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
  withNone?: boolean;
  noneLabel?: string;
  placeholder?: string;
} & Omit<
  React.ComponentProps<typeof Select>,
  "isLoading" | "value" | "onValueChange"
>;

const NONE_VALUE = "none";

const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  isLoading = false,
  disabled = false,
  value,
  onValueChange,
  withNone = false,
  noneLabel,
  placeholder,
  ...rest
}) => {
  return (
    <Select
      value={String(value || "")}
      onValueChange={(value) =>
        onValueChange(withNone && value === NONE_VALUE ? null : Number(value))
      }
      disabled={isLoading || disabled}
      {...rest}
    >
      <SelectTrigger disabled={isLoading || disabled}>
        <SelectValue placeholder={placeholder || "Select a country"} />
      </SelectTrigger>

      <SelectContent>
        {withNone && (
          <SelectItem value={NONE_VALUE} className="text-muted-foreground">
            {noneLabel || "None"}
          </SelectItem>
        )}

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
