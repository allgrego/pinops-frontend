"use client";

import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarArrowDown,
  CalendarArrowUp,
  Check,
  ChevronsUpDown,
  MapPin,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import OptionalFieldTag from "@/core/components/OptionalFieldTag/OptionalFieldTag";
import { Badge } from "@/core/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/core/components/ui/breadcrumb";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/core/components/ui/command";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Separator } from "@/core/components/ui/separator";
import { Textarea } from "@/core/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { numberOrNull } from "@/core/lib/numbers";
import { getRoute } from "@/core/lib/routes";
import { cn } from "@/core/lib/utils";
import { useAuth } from "@/modules/auth/lib/auth";
import useCarriers from "@/modules/carriers/hooks/useCarriers";
import useClients from "@/modules/clients/hooks/useClients";
import CountrySelector from "@/modules/geodata/components/CountrySelector/CountrySelector";
import useCountries from "@/modules/geodata/hooks/useCountries";
import { allIncoterms } from "@/modules/ops_files/lib/incoterms";
import {
  allCargoUnitTypes,
  allOperationTypes,
  allVolumeUnits,
  allWeightUnits,
  CargoUnitTypes,
  createOpsFile,
  getCargoUnitTypesName,
  getOpsTypeName,
  getVolumeUnitName,
  getWeightUnitName,
  VolumeUnits,
  WeightUnits,
} from "@/modules/ops_files/lib/ops_files";
import { OperationStatusIds } from "@/modules/ops_files/setup/ops_file_statuses";
import {
  OperationTypes,
  OpsFile,
  OpsfileCargoPackageCreateWithoutOpId,
  OpsFileCreate,
} from "@/modules/ops_files/types/ops_files.types";
import usePartners from "@/modules/partners/hooks/usePartners";
import useUsers from "@/modules/users/hooks/useUsers";

type NewOperationFormData = Omit<OpsFileCreate, "partnersIds" | "comment"> & {
  comment?: string;
};

const CUSTOM_UNIT_KEY = "other";
const NONE_SELECT_OPTION = "none";
const DEFAULT_OPS_STATUS = OperationStatusIds.OPENED; // Opened by default
const DEFAULT_OPS_TYPE = OperationTypes.MARITIME;

const defaultPackage: OpsfileCargoPackageCreateWithoutOpId = {
  quantity: null,
  units: CargoUnitTypes.UNIT,
};

export default function NewOperationPage() {
  const router = useRouter();

  /**
   * - - - - Current user data
   */
  const { user } = useAuth();

  const currentUserId = user?.userId;

  /**
   * - - - -Clients fetching
   */
  const clientsData = useClients();
  const { clients } = clientsData;

  /**
   * - - - -Users fetching
   */
  const usersData = useUsers();
  const { users } = usersData;

  /**
   * - - - -Carriers fetching
   */
  const carriersData = useCarriers();
  const { carriers } = carriersData;

  /**
   * - - - -Partners fetching
   */
  const partnersData = usePartners();
  const { partners } = partnersData;

  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);

  /**
   * - - - Countries fetching
   */
  const {
    countries,
    // query: partnerTypesQuery,
    isLoading: countriesIsLoading,
    isError: countriesIsError,
    // error: countriesError,
  } = useCountries({
    queryProps: {
      refetchOnWindowFocus: false, // Not necessary to refetch on window focus
    },
  });

  /**
   * - - - Form logic and related
   */

  const [customWeightUnit, setCustomWeightUnit] = useState("");
  const [customVolumeUnit, setCustomVolumeUnit] = useState("");

  const formData = useForm<NewOperationFormData>({
    defaultValues: {
      opType: DEFAULT_OPS_TYPE,
      statusId: DEFAULT_OPS_STATUS, // Always opened

      // Default units
      grossWeightUnit: WeightUnits.KG,
      volumeUnit: VolumeUnits.M3,
      packaging: [defaultPackage], // Initially one empty row

      // Others
      carrierId: null,
    },
  });

  const [volumeUnit, grossWeightUnit, operationType, incoterm, packagingData] =
    formData.watch([
      "volumeUnit",
      "grossWeightUnit",
      "opType",
      "incoterm",
      "packaging",
    ]);

  const handleSelectChange = (
    name: keyof NewOperationFormData,
    value: string | number | null
  ) => {
    formData.setValue(name as keyof NewOperationFormData, value);
  };

  const togglePartner = (partnerId: string) => {
    setSelectedPartners((prev) =>
      prev.includes(partnerId)
        ? prev.filter((id) => id !== partnerId)
        : [...prev, partnerId]
    );
  };

  /**
   * - - - -Packaging logic
   */

  /**
   *  Add an empty package to the form
   */
  const addPackage = () => {
    formData.setValue("packaging", [...(packagingData || []), defaultPackage]);
  };

  /**
   *  Update the data of a provided index package on the form
   */
  const updatePackage = (
    index: number,
    field: keyof OpsfileCargoPackageCreateWithoutOpId,
    value: string | number | null
  ) => {
    const updatedPackaging = [...packagingData];
    updatedPackaging[index] = { ...updatedPackaging[index], [field]: value };
    formData.setValue("packaging", updatedPackaging);
  };

  /**
   * Remove a package from the form
   */
  const removePackage = (index: number) => {
    const updatedPackaging = [...packagingData];
    updatedPackaging.splice(index, 1);

    formData.setValue("packaging", updatedPackaging);
  };

  /***
   * - - - - Create operation logic
   */
  const createOperationMutation = useMutation<OpsFile, Error, OpsFileCreate>({
    mutationKey: ["CreateOperation"],
    mutationFn: async (newOpsFileData) => {
      try {
        return await createOpsFile(newOpsFileData);
      } catch (error) {
        return Promise.reject(`${error}`);
      }
    },
    onError(error) {
      toast(`Unable to create operation. ${error}`);
    },
  });

  const handleSubmit: SubmitHandler<NewOperationFormData> = async (data, e) => {
    e?.preventDefault();

    try {
      // Determine the final values
      const finalGrossWeightValue = numberOrNull(data?.grossWeightValue);
      const finalVolumeValue = numberOrNull(data?.volumeUnit);
      // const finalUnitValue = numberOrNull(data?.unitsQuantity);
      // Determine the final units
      const finalWeightUnit =
        data.grossWeightUnit === CUSTOM_UNIT_KEY
          ? customWeightUnit
          : data.grossWeightUnit === NONE_SELECT_OPTION
          ? null
          : data.grossWeightUnit;
      const finalVolumeUnit =
        data.volumeUnit === CUSTOM_UNIT_KEY
          ? customVolumeUnit
          : data.volumeUnit === NONE_SELECT_OPTION
          ? null
          : data.volumeUnit;

      const finalPackaging: OpsfileCargoPackageCreateWithoutOpId[] =
        data.packaging
          // Include only those which has valid quantity unless it is not quantifiable (e.g. loose cargo)
          .filter((pack) => {
            const isNonQuantifiableUnit = (
              [CargoUnitTypes.LOOSE_CARGO] as string[]
            ).includes(pack.units);
            return isNonQuantifiableUnit || !!numberOrNull(pack.quantity);
          })
          .map((pack) => ({
            quantity: numberOrNull(pack.quantity),
            units: pack?.units?.trim() || "",
          }));

      const finalIncoterm =
        data.incoterm === NONE_SELECT_OPTION ? null : data.incoterm;

      const finalCarrier =
        data.carrierId === NONE_SELECT_OPTION ? null : data.carrierId;

      // Create the operation
      const newOperation = await createOperationMutation.mutateAsync({
        // Location
        originLocation: data?.originLocation?.trim() || null,
        originCountryId: data?.originCountryId || null,
        destinationLocation: data?.destinationLocation || null,
        destinationCountryId: data?.destinationCountryId || null,
        // Schedules
        estimatedTimeDeparture: data?.estimatedTimeDeparture || null,
        actualTimeDeparture: data?.actualTimeDeparture || null,
        estimatedTimeArrival: data?.estimatedTimeArrival || null,
        actualTimeArrival: data?.actualTimeArrival || null,
        // Cargo properties
        cargoDescription: data?.cargoDescription?.trim(),
        grossWeightValue: finalGrossWeightValue,
        grossWeightUnit:
          finalGrossWeightValue === null
            ? null // Remove unit when no value
            : finalWeightUnit || null,
        volumeValue: finalVolumeValue,
        volumeUnit:
          finalVolumeValue === null
            ? null // Remove unit when no value
            : finalVolumeUnit || null,
        masterTransportDoc: data?.masterTransportDoc || null,
        houseTransportDoc: data?.houseTransportDoc || null,
        incoterm: finalIncoterm || null,
        modality: data?.modality || null,
        voyage: data?.voyage || null,
        opType: data?.opType || null,
        clientId: data?.clientId,
        statusId: data?.statusId,
        carrierId: finalCarrier || null,
        partnersIds: selectedPartners || [],
        comment: !data?.comment
          ? null
          : {
              content: data.comment,
            },
        creatorUserId: currentUserId || null,
        assigneeUserId: data?.assigneeUserId || null,
        packaging: finalPackaging || [],
      });

      toast("The operation has been created successfully.");

      router.push(
        getRoute("operations-by-id-details", [newOperation.opsFileId])
      );
    } catch (error) {
      toast(`Failed to create the operation. ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={getRoute("operations")}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">New Operation</h1>
      </div>

      <div className="">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={getRoute("operations")}>Operations</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <form onSubmit={formData.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>

              <CardDescription className="text-xs">
                Optional data could be added later
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">
                  Client <span className="text-red-500">*</span>
                </Label>

                <Controller
                  control={formData.control}
                  name="clientId"
                  render={({ field }) => {
                    const selectedClient = clients.find(
                      (c) => c.clientId === field.value
                    );

                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                            disabled={
                              clientsData.isLoading || clientsData.isError
                            }
                          >
                            {!!field.value
                              ? selectedClient?.name || field.value
                              : "Select client..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command
                            filter={(value, search) => {
                              const client = clients.find(
                                (c) => c.clientId === value
                              );

                              if (!client) return 0;

                              const clientIsSearched = [
                                client?.name,
                                client?.clientId,
                                client?.contactName,
                                client?.contactEmail,
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

                              if (!clientIsSearched) return 0;

                              return 1;
                            }}
                          >
                            <CommandInput placeholder="Search client..." />
                            <CommandList>
                              <CommandEmpty>No clients found.</CommandEmpty>
                              <CommandGroup>
                                {clients.map((client) => (
                                  <CommandItem
                                    key={client.clientId}
                                    value={client.clientId}
                                    onSelect={(value) =>
                                      handleSelectChange(field.name, value)
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === client.clientId
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <div className="flex gap-4 justify-between w-full font-semibold">
                                      {client.name}{" "}
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="operation_type">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={formData.control}
                    name="opType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          handleSelectChange(field.name, value)
                        }
                      >
                        <SelectTrigger id="operation_type">
                          <SelectValue placeholder="Select operation type" />
                        </SelectTrigger>
                        <SelectContent>
                          {!allOperationTypes.length
                            ? null
                            : allOperationTypes.map((type) => (
                                <SelectItem value={type} key={type}>
                                  {getOpsTypeName(type)}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modality">
                    Modality <OptionalFieldTag />
                  </Label>
                  <Input
                    id="modality"
                    {...formData.register("modality")}
                    placeholder="FCL, LCL, D2D"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargo_description">
                  Commodities / Cargo description{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="cargo_description"
                  {...formData.register("cargoDescription", { required: true })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee_id">
                  Assignee <OptionalFieldTag />
                </Label>
                <div className="text-xs font-light text-muted-foreground">
                  The user who is responsible of this operation
                </div>

                <Controller
                  control={formData.control}
                  name="assigneeUserId"
                  render={({ field }) => {
                    const selectedUser = users.find(
                      (u) => u.userId === field.value
                    );

                    // Copy users list to sort them
                    const usersList = [...(users || [])];

                    usersList.sort((a, b) => {
                      // If a is current user, it comes first
                      if (a.userId === currentUserId) return -1;

                      // If b is current user, it comes first
                      if (b.userId === currentUserId) return 1;

                      // Otherwise sort by name
                      return a.name.localeCompare(b.name);
                    });

                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                            disabled={usersData.isError}
                            loading={usersData.isLoading}
                          >
                            {!!field.value
                              ? selectedUser?.name || field.value
                              : "Select user..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command
                            filter={(value, search) => {
                              const user = usersList.find(
                                (c) => c.userId === value
                              );

                              if (!user) return 0;

                              const userIsSearched = [
                                user?.name,
                                user?.email,
                                user?.userId,
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

                              if (!userIsSearched) return 0;

                              return 1;
                            }}
                          >
                            <CommandInput placeholder="Search users..." />
                            <CommandList>
                              <CommandEmpty>No users found.</CommandEmpty>
                              <CommandGroup>
                                {usersList.map((user) => (
                                  <CommandItem
                                    key={user.userId}
                                    value={user.userId}
                                    onSelect={(value) =>
                                      handleSelectChange(field.name, value)
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === user.userId
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <div className="flex gap-2 justify-start w-full items-center">
                                      {user.name}{" "}
                                      {user.userId === currentUserId && (
                                        <span className="text-muted-foreground text-sm">
                                          (you)
                                        </span>
                                      )}
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label>
                  Partners <OptionalFieldTag />
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedPartners.length > 0
                        ? `${selectedPartners.length} partner${
                            selectedPartners.length > 1 ? "s" : ""
                          } selected`
                        : "Select partners..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command
                      filter={(value, search) => {
                        const partner = partners.find(
                          (p) => p.partnerId === value
                        );

                        if (!partner) return 0;

                        const partnerIsSearched = [
                          partner?.name,
                          partner?.partnerId,
                          partner?.partnerType?.name,
                          partner?.taxId,
                          partner?.country?.iso2Code,
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

                        if (!partnerIsSearched) return 0;

                        return 1;
                      }}
                    >
                      <CommandInput placeholder="Search partners..." />
                      <CommandList>
                        <CommandEmpty>No partners found.</CommandEmpty>
                        <CommandGroup>
                          {partners.map((partner) => (
                            <CommandItem
                              key={partner.partnerId}
                              value={partner.partnerId}
                              onSelect={() => togglePartner(partner.partnerId)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedPartners.includes(partner.partnerId)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex gap-4 justify-between w-full font-semibold">
                                {partner.name}{" "}
                                <Badge
                                  variant={"outline"}
                                  className={`text-xs`}
                                >
                                  {partner?.partnerType?.name || "-"}
                                </Badge>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedPartners.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedPartners.map((partnerId) => {
                        const partner = partners.find(
                          (a) => a.partnerId === partnerId
                        );
                        return partner ? (
                          <Badge
                            key={partner.partnerId}
                            variant="secondary"
                            className="flex items-center gap-1 cursor-default"
                          >
                            {partner.name}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent cursor-pointer"
                              onClick={() => togglePartner(partner.partnerId)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="carrierId">
                  Carrier <OptionalFieldTag />
                </Label>
                <Controller
                  control={formData.control}
                  name="carrierId"
                  render={({ field }) => {
                    const selectedCarrier = carriers.find(
                      (c) => c.carrierId === field.value
                    );

                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                            disabled={
                              carriersData.isLoading || carriersData.isError
                            }
                          >
                            {!!field.value
                              ? selectedCarrier?.name || field.value
                              : "Select a carrier..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command
                            filter={(value, search) => {
                              const carrier = carriers.find(
                                (c) => c.carrierId === value
                              );

                              if (!carrier) return 0;

                              const carrierIsSearched = [
                                carrier?.name,
                                carrier?.carrierId,
                                carrier?.carrierType?.name,
                                carrier?.taxId,
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

                              if (!carrierIsSearched) return 0;

                              return 1;
                            }}
                          >
                            <CommandInput placeholder="Search carrier..." />
                            <CommandList>
                              <CommandEmpty>No carriers found.</CommandEmpty>
                              <CommandGroup>
                                {carriers.map((carrier) => (
                                  <CommandItem
                                    key={carrier.carrierId}
                                    value={carrier.carrierId}
                                    onSelect={(value) =>
                                      handleSelectChange(
                                        field.name,
                                        value === field.value ? "" : value
                                      )
                                    }
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === carrier.carrierId
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <div className="flex gap-4 justify-between w-full font-semibold">
                                      {carrier.name}{" "}
                                      <Badge
                                        variant={"outline"}
                                        className={`text-xs`}
                                      >
                                        {carrier?.carrierType?.name || "-"}
                                      </Badge>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </div>

              <Separator className="my-4" />

              {/* Cargo specifications */}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gross_weight_value">
                    Gross weight <OptionalFieldTag />
                  </Label>
                  <Input
                    id="gross_weight_value"
                    {...formData.register("grossWeightValue")}
                    placeholder="12.03"
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gross_weight_unit" className="invisible">
                    Weight unit
                  </Label>

                  <Controller
                    control={formData.control}
                    name="grossWeightUnit"
                    render={({ field }) => {
                      return (
                        <>
                          <Select
                            value={field.value || undefined}
                            onValueChange={(value) =>
                              handleSelectChange(field.name, value)
                            }
                          >
                            <SelectTrigger id={field.name}>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value={NONE_SELECT_OPTION}>
                                None
                              </SelectItem>
                              {!allWeightUnits.length
                                ? null
                                : allWeightUnits.map((unit) => (
                                    <SelectItem value={unit} key={unit}>
                                      {getWeightUnitName(unit)}
                                    </SelectItem>
                                  ))}
                              <SelectItem value={CUSTOM_UNIT_KEY}>
                                Other
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </>
                      );
                    }}
                  />
                  {/* Custom unit input */}
                  {grossWeightUnit === CUSTOM_UNIT_KEY && (
                    <Input
                      className="mt-2"
                      placeholder="Enter unit"
                      value={customWeightUnit}
                      onChange={(e) => setCustomWeightUnit(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="volume_value">
                    Volume <OptionalFieldTag />
                  </Label>
                  <Input
                    id="volume_value"
                    {...formData.register("volumeValue")}
                    type="number"
                    step="0.001"
                    placeholder="2.123"
                    inputMode="decimal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volumeUnit" className="invisible">
                    Volume unit
                  </Label>
                  <Controller
                    control={formData.control}
                    name="volumeUnit"
                    render={({ field }) => {
                      return (
                        <>
                          <Select
                            value={field.value || undefined}
                            onValueChange={(value) =>
                              handleSelectChange(field.name, value)
                            }
                          >
                            <SelectTrigger id={field.name}>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value={NONE_SELECT_OPTION}>
                                None
                              </SelectItem>
                              {!allVolumeUnits.length
                                ? null
                                : allVolumeUnits.map((unit) => (
                                    <SelectItem value={unit} key={unit}>
                                      {getVolumeUnitName(unit)}
                                    </SelectItem>
                                  ))}
                              <SelectItem value={CUSTOM_UNIT_KEY}>
                                Other
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          {volumeUnit === CUSTOM_UNIT_KEY && (
                            <Input
                              className="mt-2"
                              placeholder="Enter unit"
                              value={customVolumeUnit}
                              onChange={(e) =>
                                setCustomVolumeUnit(e.target.value)
                              }
                            />
                          )}
                        </>
                      );
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="items-center">
                  Packaging <OptionalFieldTag />
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPackage}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add packaging
                </Button>
              </div>
              <div className="flex flex-col gap-y-2">
                {!packagingData.length ? (
                  <span className="text-xs font-light text-muted-foreground">
                    No cargo packaging info
                  </span>
                ) : (
                  packagingData.map((packaging, index) => (
                    // Row
                    <div key={index} className="grid grid-cols-2 gap-x-4">
                      <div className="space-y-2">
                        <Input
                          value={packaging.quantity || ""}
                          onChange={(e) => {
                            updatePackage(index, "quantity", e.target.value);
                          }}
                          inputMode="decimal"
                          type="number"
                          step="0.001"
                          placeholder="2.123"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-x-2 ">
                        <Select
                          value={packaging.units || ""}
                          onValueChange={(value) => {
                            updatePackage(index, "units", value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>

                          <SelectContent>
                            {!allCargoUnitTypes.length
                              ? null
                              : allCargoUnitTypes.map((unit) => (
                                  <SelectItem value={unit} key={unit}>
                                    {getCargoUnitTypesName(unit)}
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePackage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Locations */}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin_location">
                    <MapPin className="h-4 text-emerald-500" />
                    Origin location <OptionalFieldTag />
                  </Label>
                  <Input
                    id="origin_location"
                    {...formData.register("originLocation")}
                    placeholder="Shangai"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin_country">
                    Origin country <OptionalFieldTag />
                  </Label>
                  <Controller
                    control={formData.control}
                    name="originCountryId"
                    render={({ field }) => {
                      return (
                        <CountrySelector
                          withNone // None option set the value to null
                          countries={countries}
                          value={field.value}
                          onValueChange={(value) =>
                            handleSelectChange(field.name, value)
                          }
                          disabled={countriesIsError}
                          isLoading={countriesIsLoading}
                        />
                      );
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination_location">
                    <MapPin className="h-4 text-blue-500" />
                    Destination location <OptionalFieldTag />
                  </Label>
                  <Input
                    id="destination_location"
                    {...formData.register("destinationLocation")}
                    placeholder="La Guaira"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination_country">
                    Destination country <OptionalFieldTag />
                  </Label>
                  <Controller
                    control={formData.control}
                    name="destinationCountryId"
                    render={({ field }) => {
                      return (
                        <CountrySelector
                          withNone // None option set the value to null
                          countries={countries}
                          value={field.value}
                          onValueChange={(value) =>
                            handleSelectChange(field.name, value)
                          }
                          disabled={countriesIsError}
                          isLoading={countriesIsLoading}
                        />
                      );
                    }}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_time_departure">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1">
                            <CalendarArrowUp className="h-4 text-emerald-500" />{" "}
                            ETD <OptionalFieldTag />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Estimated time of departure</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="estimated_time_departure"
                    type="date"
                    {...formData.register("estimatedTimeDeparture")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_time_arrival">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1">
                            <CalendarArrowDown className="h-4 text-blue-500" />{" "}
                            ETA <OptionalFieldTag />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Estimated time of arrival</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="estimated_time_arrival"
                    type="date"
                    {...formData.register("estimatedTimeArrival")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="actual_time_departure">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1">
                            <CalendarArrowUp className="h-4 text-emerald-500" />{" "}
                            ATD <OptionalFieldTag />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Actual time of departure</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="actual_time_departure"
                    type="date"
                    {...formData.register("actualTimeDeparture")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actual_time_arrival">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1">
                            <CalendarArrowDown className="h-4 text-blue-500" />{" "}
                            ATA <OptionalFieldTag />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Actual time of arrival</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="actual_time_arrival"
                    type="date"
                    {...formData.register("actualTimeArrival")}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="master_transport_doc">
                    {operationType === OperationTypes.MARITIME
                      ? "MBL"
                      : operationType === OperationTypes.AIR
                      ? "MAWB"
                      : "Master document number"}{" "}
                    <OptionalFieldTag />
                  </Label>
                  <Input
                    id="master_transport_doc"
                    {...formData.register("masterTransportDoc")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="house_transport_doc">
                    {operationType === OperationTypes.MARITIME
                      ? "HBL"
                      : operationType === OperationTypes.AIR
                      ? "HAWB"
                      : "House document number"}{" "}
                    <OptionalFieldTag />
                  </Label>
                  <Input
                    id="house_transport_doc"
                    {...formData.register("houseTransportDoc")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incoterm">
                    Incoterm <OptionalFieldTag />
                  </Label>
                  <Select
                    value={incoterm || undefined}
                    onValueChange={(value) =>
                      handleSelectChange("incoterm", value)
                    }
                  >
                    <SelectTrigger id="incoterm">
                      <SelectValue placeholder="Select incoterm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE_SELECT_OPTION}>None</SelectItem>
                      {!allIncoterms.length
                        ? null
                        : allIncoterms.map((incot) => (
                            <SelectItem value={incot} key={incot}>
                              {incot}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voyage">
                  Voyage <OptionalFieldTag />
                </Label>
                <Input id="voyage" {...formData.register("voyage")} />
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="comment">
                  Observations <OptionalFieldTag />
                </Label>
                <Textarea id="comment" {...formData.register("comment")} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            variant="outline"
            asChild
            disabled={createOperationMutation.isPending}
          >
            <Link href={`/app/operations`}>Cancel</Link>
          </Button>
          <Button
            type="submit"
            loading={createOperationMutation.isPending}
            disabled={createOperationMutation.isPending}
          >
            {createOperationMutation.isPending
              ? "Creating..."
              : "Create operation"}
          </Button>
        </div>
      </form>
    </div>
  );
}
