"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Check, ChevronsUpDown, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/core/components/ui/badge";
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
import { cn } from "@/core/lib/utils";
import useClients from "@/modules/hooks/useClients";
import {
  allCargoUnitTypes,
  allOperationTypes,
  allVolumeUnits,
  allWeightUnits,
  createOpsFile,
  getCargoUnitTypesName,
  getOpsTypeName,
  getVolumeUnitName,
  getWeightUnitName,
} from "@/modules/ops_files/lib/ops_files";
import {
  OperationStatuses,
  OperationTypes,
  OpsFile,
  OpsFileCreate,
} from "@/modules/ops_files/types/ops_files.types";
import useAgents from "@/modules/providers/hooks/useAgents";
import useCarriers from "@/modules/providers/hooks/useCarriers";

type NewOperationFormData = Omit<OpsFileCreate, "agentsId"> & {
  comment?: string;
};

const CUSTOM_UNIT_KEY = "other";
const NONE_SELECT_OPTION = "none";
const DEFAULT_OPS_STATUS = OperationStatuses.OPENED;
const DEFAULT_OPS_TYPE = OperationTypes.MARITIME;

export default function NewOperationPage() {
  const router = useRouter();

  const clientsData = useClients();
  const { clients } = clientsData;

  const carriersData = useCarriers();
  const { carriers } = carriersData;

  const agentsData = useAgents();
  const { agents } = agentsData;

  const [customWeightUnit, setCustomWeightUnit] = useState("");
  const [customVolumeUnit, setCustomVolumeUnit] = useState("");
  const [customUnitsType, setCustomUnitsType] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const formData = useForm<NewOperationFormData>({
    defaultValues: {
      opType: DEFAULT_OPS_TYPE,
      statusId: DEFAULT_OPS_STATUS, // Always opened
      carrierId: null,
    },
  });

  const [unitsType, volumeUnit, grossWeightUnit, operationType, incoterm] =
    formData.watch([
      "unitsType",
      "volumeUnit",
      "grossWeightUnit",
      "opType",
      "incoterm",
    ]);

  const handleSelectChange = (name: string, value: string) => {
    formData.setValue(name as keyof NewOperationFormData, value);
  };

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    );
  };

  /***
   * - - - - Create operation logic
   */
  const createOperationMutation = useMutation<OpsFile, Error, OpsFileCreate>({
    mutationKey: ["CreateOperation"],
    mutationFn: async (newOpsFileData) => {
      console.log("DATA", newOpsFileData);
      return await createOpsFile(newOpsFileData);
    },
    onError(error) {
      toast(`Unable to create operation. ${error}`);
    },
  });

  const handleSubmit: SubmitHandler<NewOperationFormData> = async (data, e) => {
    e?.preventDefault();

    try {
      // Determine the final units
      const finalWeightUnit =
        data.grossWeightUnit === CUSTOM_UNIT_KEY
          ? customWeightUnit
          : data.grossWeightUnit;
      const finalVolumeUnit =
        data.volumeUnit === CUSTOM_UNIT_KEY
          ? customVolumeUnit
          : data.volumeUnit;
      const finalUnitsType =
        data.unitsType === CUSTOM_UNIT_KEY ? customUnitsType : data.unitsType;

      // Create the operation
      const newOperation = await createOperationMutation.mutateAsync({
        // Location
        originLocation: data?.originLocation?.trim() || null,
        originCountry: data.originCountry?.trim() || null,
        destinationLocation: data?.destinationLocation || null,
        destinationCountry: data?.destinationCountry || null,
        // Schedules
        estimatedTimeDeparture: data?.estimatedTimeDeparture || null,
        actualTimeDeparture: data?.actualTimeDeparture || null,
        estimatedTimeArrival: data?.estimatedTimeArrival || null,
        actualTimeArrival: data?.actualTimeArrival || null,
        cargoDescription: data?.cargoDescription,
        unitsQuantity:
          typeof data.unitsQuantity === "number"
            ? Number(data.unitsQuantity)
            : null,
        unitsType: finalUnitsType || null,
        grossWeightValue:
          typeof data?.grossWeightValue === "number"
            ? Number(data.grossWeightValue)
            : null,
        grossWeightUnit: finalWeightUnit || null,
        volumeValue:
          typeof data?.volumeValue === "number"
            ? Number(data.volumeValue)
            : null,
        volumeUnit: finalVolumeUnit || null,
        masterTransportDoc: data?.masterTransportDoc || null,
        houseTransportDoc: data?.houseTransportDoc || null,
        incoterm: data?.incoterm || null,
        modality: data?.modality || null,
        voyage: data?.voyage || null,
        opType: data?.opType || null,
        clientId: data?.clientId,
        statusId: data?.statusId,
        carrierId: data?.carrierId || null,
        agentsId: selectedAgents || [],
        comment: !data?.comment
          ? null
          : {
              author: null,
              content: data.comment,
            },
      });

      toast("The operation has been created successfully.");

      router.push(`/app/operations/${newOperation.opsFileId}`);
    } catch (error) {
      toast(`Failed to create the operation. ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/app/operations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">New Operation</h1>
      </div>

      <form onSubmit={formData.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>

              <CardDescription className="text-xs">
                Not required data could be edited later
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
                    return (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            handleSelectChange(field.name, value)
                          }
                          disabled={
                            clientsData.isLoading || clientsData.isError
                          }
                        >
                          <SelectTrigger
                            id={field.name}
                            disabled={
                              clientsData.isLoading || clientsData.isError
                            }
                          >
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>

                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem
                                value={client.clientId}
                                key={client.clientId}
                              >
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
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
                          {allOperationTypes.map((type) => (
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
                  <Label htmlFor="modality">Modality</Label>
                  <Input
                    id="modality"
                    {...formData.register("modality")}
                    placeholder="FCL, LCL, D2D"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargo_description">
                  Cargo description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="cargo_description"
                  {...formData.register("cargoDescription", { required: true })}
                  required
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label>International agents</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedAgents.length > 0
                        ? `${selectedAgents.length} agent${
                            selectedAgents.length > 1 ? "s" : ""
                          } selected`
                        : "Select agents..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search agents..." />
                      <CommandList>
                        <CommandEmpty>No agent found.</CommandEmpty>
                        <CommandGroup>
                          {agents.map((agent) => (
                            <CommandItem
                              key={agent.agentId}
                              value={agent.agentId}
                              onSelect={() => toggleAgent(agent.agentId)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedAgents.includes(agent.agentId)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {agent.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedAgents.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedAgents.map((agentId) => {
                        const agent = agents.find((a) => a.agentId === agentId);
                        return agent ? (
                          <Badge
                            key={agent.agentId}
                            variant="secondary"
                            className="flex items-center gap-1 cursor-default"
                          >
                            {agent.name}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent cursor-pointer"
                              onClick={() => toggleAgent(agent.agentId)}
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
                <Label htmlFor="carrierId">Carrier</Label>
                <Controller
                  control={formData.control}
                  name="carrierId"
                  render={({ field }) => {
                    return (
                      <>
                        <Select
                          value={field.value || undefined}
                          onValueChange={(value) =>
                            handleSelectChange(field.name, value)
                          }
                          disabled={
                            carriersData.isLoading || carriersData.isError
                          }
                        >
                          <SelectTrigger
                            id={field.name}
                            disabled={
                              carriersData.isLoading || carriersData.isError
                            }
                          >
                            <SelectValue placeholder="Select carrier" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value={NONE_SELECT_OPTION}>
                              None
                            </SelectItem>
                            {carriers.map((carrier) => (
                              <SelectItem
                                value={carrier.carrierId}
                                key={carrier.carrierId}
                              >
                                {carrier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    );
                  }}
                />
              </div>

              <Separator className="my-4" />

              {/* Cargo specifications */}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="units_quantity">Units quantity</Label>
                  <Input
                    id="units_quantity"
                    type="number"
                    {...formData.register("unitsQuantity")}
                    placeholder="12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitsType">Units type</Label>
                  <Controller
                    control={formData.control}
                    name="unitsType"
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
                              {allCargoUnitTypes.map((unitType) => (
                                <SelectItem value={unitType} key={unitType}>
                                  {getCargoUnitTypesName(unitType)}
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
                  {unitsType === CUSTOM_UNIT_KEY && (
                    <Input
                      className="mt-2"
                      placeholder="Enter unit type"
                      value={customUnitsType}
                      onChange={(e) => setCustomUnitsType(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gross_weight_value">Gross weight</Label>
                  <Input
                    id="gross_weight_value"
                    {...formData.register("grossWeightValue")}
                    placeholder="12.03"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gross_weight_unit">Weight unit</Label>

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
                              {allWeightUnits.map((unit) => (
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
                  <Label htmlFor="volume_value">Volume</Label>
                  <Input
                    id="volume_value"
                    {...formData.register("volumeValue")}
                    type="number"
                    step="0.001"
                    placeholder="2.123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volumeUnit">Volume unit</Label>
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
                              {allVolumeUnits.map((unit) => (
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
                  <Label htmlFor="origin_location">Origin location</Label>
                  <Input
                    id="origin_location"
                    {...formData.register("originLocation")}
                    placeholder="Shangai"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin_country">Origin country</Label>
                  <Input
                    id="origin_country"
                    {...formData.register("originCountry")}
                    placeholder="CN"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination_location">
                    Destination location
                  </Label>
                  <Input
                    id="destination_location"
                    {...formData.register("destinationLocation")}
                    placeholder="La Guaira"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination_country">
                    Destination country
                  </Label>
                  <Input
                    id="destination_country"
                    {...formData.register("destinationCountry")}
                    placeholder="VE"
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_time_departure">ETD</Label>
                  <Input
                    id="estimated_time_departure"
                    type="date"
                    {...formData.register("estimatedTimeDeparture")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actual_time_departure">ATD</Label>
                  <Input
                    id="actual_time_departure"
                    type="date"
                    {...formData.register("actualTimeDeparture")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_time_arrival">ETA</Label>
                  <Input
                    id="estimated_time_arrival"
                    type="date"
                    {...formData.register("estimatedTimeArrival")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actual_time_arrival">ATA</Label>
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
                      : "Master doc"}
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
                      : "House doc"}
                  </Label>
                  <Input
                    id="house_transport_doc"
                    {...formData.register("houseTransportDoc")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incoterm">Incoterm</Label>
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
                      <SelectItem value="CIF">CIF</SelectItem>
                      <SelectItem value="FOB">FOB</SelectItem>
                      <SelectItem value="EXW">EXW</SelectItem>
                      <SelectItem value="FCA">FCA</SelectItem>
                      <SelectItem value="CPT">CPT</SelectItem>
                      <SelectItem value="CIP">CIP</SelectItem>
                      <SelectItem value="DAP">DAP</SelectItem>
                      <SelectItem value="DDP">DDP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voyage">Voyage</Label>
                <Input id="voyage" {...formData.register("voyage")} />
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="comment">Observations</Label>
                <Textarea id="comment" {...formData.register("comment")} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" asChild>
            <Link href="/app/operations">Cancel</Link>
          </Button>
          <Button type="submit">Create Operation</Button>
        </div>
      </form>
    </div>
  );
}
