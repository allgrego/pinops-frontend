"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/core/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/core/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { cn } from "@/core/lib/utils";
import { Country } from "@/modules/geodata/types/countries";

type CountrySelectorProps = {
  countries: Country[];
  isLoading?: boolean;
  isError?: boolean;
  disabled?: boolean;
  value: number | null;
  onValueChange: (value: number | null) => void;
  withNone?: boolean;
  noneLabel?: string;
  placeholder?: string;
  PopoverProps?: Pick<React.ComponentProps<typeof Popover>, "modal">;
};

// const NONE_VALUE = "none";

const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  isLoading = false,
  isError = false,
  disabled = false,
  value,
  onValueChange,
  placeholder,
  PopoverProps,
}) => {
  // Data of country based on selected ID (value)
  const selectedCountry = countries.find((c) => c.countryId === value);

  // Sort countries by name
  countries.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Popover {...PopoverProps}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
          disabled={disabled || isLoading || isError}
        >
          {!!value
            ? selectedCountry
              ? `${selectedCountry.iso2Code} - ${selectedCountry.name}`
              : value
            : placeholder || "Select a country..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0 ">
        <Command
          filter={(val, search) => {
            const country = countries.find((c) => String(c.countryId) === val);

            if (!country) return 0;

            const countryIsSearched = [
              country?.name,
              country?.iso2Code,
              country?.iso3Code,
            ].some((value) =>
              String(value || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .includes(
                  search
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                )
            );

            if (!countryIsSearched) return 0;

            return 1;
          }}
        >
          <CommandInput placeholder={"Search country..."} />

          <CommandList>
            <CommandEmpty>No countries found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.countryId}
                  value={String(country.countryId || "")}
                  onSelect={(val) =>
                    onValueChange(val === String(value) ? null : Number(val))
                  }
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.countryId ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex gap-4 justify-between w-full font-semibold">
                    {country.iso2Code} - {country.name}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountrySelector;
