"use client";

import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarArrowDown,
  CalendarArrowUp,
  Check,
  ChevronsUpDown,
  MapPin,
  Trash,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import DeleteConfirmationDialog from "@/core/components/DeleteConfirmationDialog/DeleteConfirmationDialog";
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
import useDialog from "@/core/hooks/useDialog";
import { shortUUID } from "@/core/lib/misc";
import { cn } from "@/core/lib/utils";
import { useAuth } from "@/modules/auth/lib/auth";
import useClients from "@/modules/clients/hooks/useClients";
import useOpsFile from "@/modules/ops_files/hooks/useOpsFile";
import { allIncoterms } from "@/modules/ops_files/lib/incoterms";
import {
  allCargoUnitTypes,
  allOperationStatuses,
  allOperationTypes,
  allVolumeUnits,
  allWeightUnits,
  deleteOpsFile,
  getCargoUnitTypesName,
  getOpsStatusName,
  getOpsTypeName,
  getVolumeUnitName,
  getWeightUnitName,
  updateOpsFile,
  VolumeUnits,
  WeightUnits,
} from "@/modules/ops_files/lib/ops_files";
import {
  OperationStatuses,
  OperationType,
  OperationTypes,
  OpsFile,
  OpsFileUpdate,
} from "@/modules/ops_files/types/ops_files.types";
import useAgents from "@/modules/providers/hooks/useAgents";
import useCarriers from "@/modules/providers/hooks/useCarriers";
import { numberOrNull } from "@/core/lib/numbers";
import { getRoute } from "@/core/lib/routes";

type EditOperationFormData = Omit<OpsFileUpdate, "agentsId">;

const CUSTOM_UNIT_KEY = "other";
const NONE_SELECT_OPTION = "none";
const DEFAULT_OPS_STATUS = OperationStatuses.OPENED;
const DEFAULT_OPS_TYPE = OperationTypes.MARITIME;

export default function EditOperationPage() {
  const params = useParams();
  const router = useRouter();

  /**
   * - - - Auth
   */
  const { isAuthenticated } = useAuth();

  /**
   * - - - - Operation file logic
   */

  const operationId = String(params?.id || "");

  const operationData = useOpsFile(operationId, {
    queryProps: { enabled: !!operationId && isAuthenticated },
  });

  const { operation, query: operationQuery } = operationData;

  const operationIsSuccess = operationQuery.isSuccess;

  /**
   * Refetch the operation data
   */
  const reloadOperation = async () => {
    await operationData.query.refetch();
  };

  /**
   * - - - Clients fetcihng
   */
  const clientsData = useClients({
    queryProps: { enabled: !!operation && isAuthenticated },
  });
  const { clients } = clientsData;

  /**
   * - - - Carriers fetcihng
   */
  const carriersData = useCarriers({
    queryProps: { enabled: !!operation && isAuthenticated },
  });
  const { carriers } = carriersData;

  /**
   * - - - Agents fetcihng
   */
  const agentsData = useAgents({
    queryProps: { enabled: !!operation && isAuthenticated },
  });
  const { agents } = agentsData;

  /**
   * - - - - Form logic
   */

  const formData = useForm<EditOperationFormData>({
    defaultValues: {
      clientId: operation?.client?.clientId,
      opType: (operation?.opType as OperationType) || DEFAULT_OPS_TYPE,
      statusId: operation?.status?.statusId || DEFAULT_OPS_STATUS,
      cargoDescription: operation?.cargoDescription,
      modality: operation?.modality,
      carrierId: operation?.carrier?.carrierId,
      unitsQuantity: operation?.unitsQuantity,
      unitsType: operation?.unitsType,
      grossWeightValue: operation?.grossWeightValue,
      grossWeightUnit: operation?.grossWeightUnit || WeightUnits.KG,
      volumeValue: operation?.volumeValue,
      volumeUnit: operation?.volumeUnit || VolumeUnits.M3,
      masterTransportDoc: operation?.masterTransportDoc,
      houseTransportDoc: operation?.houseTransportDoc,
      originLocation: operation?.originLocation,
      originCountry: operation?.originCountry,
      destinationLocation: operation?.destinationLocation,
      destinationCountry: operation?.destinationCountry,
      estimatedTimeDeparture: operation?.estimatedTimeDeparture,
      actualTimeDeparture: operation?.actualTimeDeparture,
      estimatedTimeArrival: operation?.estimatedTimeArrival,
      actualTimeArrival: operation?.actualTimeArrival,
      incoterm: operation?.incoterm,
      voyage: operation?.voyage,
    },
  });

  const [customWeightUnit, setCustomWeightUnit] = useState("");
  const [customVolumeUnit, setCustomVolumeUnit] = useState("");
  const [customUnitsType, setCustomUnitsType] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const [unitsType, volumeUnit, grossWeightUnit, operationType, incoterm] =
    formData.watch([
      "unitsType",
      "volumeUnit",
      "grossWeightUnit",
      "opType",
      "incoterm",
    ]);

  function handleSelectChange(name: string, value: string | number | null) {
    formData.setValue(name as keyof EditOperationFormData, value);
  }

  /**
   * Toggle selected agent
   */
  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    );
  };

  const loading =
    operationData.isLoading ||
    clientsData.isLoading ||
    carriersData.isLoading ||
    agentsData.isLoading;

  /**
   * Update the selected agents when operation changes
   */
  useEffect(() => {
    if (!operation || !operationIsSuccess) return;

    setSelectedAgents(operation?.agents?.map((a) => a.agentId) || []);
  }, [operation, operationIsSuccess]);

  /**
   * - - - - Update operation logic
   */

  const editOperationMutation = useMutation<OpsFile, Error, OpsFileUpdate>({
    mutationKey: [operationId, "UpdateOperation"],
    mutationFn: async (newOpsFileData) => {
      return await updateOpsFile(operationId, newOpsFileData);
    },
    onError(error) {
      toast(`Unable to edit operation. ${error}`);
    },
  });

  console.log("opetaion", operation);

  const handleSubmit: SubmitHandler<EditOperationFormData> = async (
    data,
    e
  ) => {
    e?.preventDefault();

    if (!operation) {
      toast("Operation data not found. Unable to save changes");
      return;
    }

    try {
      if (!data?.clientId) {
        toast("Client is required.");
        return;
      }

      if (!data?.statusId) {
        toast("Status is required.");
        return;
      }

      // Determine the final values
      const finalGrossWeightValue = numberOrNull(data?.grossWeightValue);
      const finalVolumeValue = numberOrNull(data?.volumeUnit);
      const finalUnitValue = numberOrNull(data?.unitsQuantity);
      // Determine the final units
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
      const finalUnitsType =
        data.unitsType === CUSTOM_UNIT_KEY
          ? customUnitsType
          : data.unitsType === NONE_SELECT_OPTION
          ? null
          : data.unitsType;

      const finalIncoterm =
        data.incoterm === NONE_SELECT_OPTION ? null : data.incoterm;

      const finalCarrier =
        data.carrierId === NONE_SELECT_OPTION ? null : data.carrierId;

      // Update the operation
      const updatedOperation = await editOperationMutation.mutateAsync({
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
        unitsQuantity: finalUnitValue,
        unitsType: finalUnitsType || null, // The unit type could be regardless of missing value
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
        opType: data?.opType,
        clientId: data?.clientId,
        statusId: data?.statusId,
        carrierId: finalCarrier || null,
        agentsId: selectedAgents || [],
      });

      if (updatedOperation) {
        toast("The operation has been updated successfully.");

        await reloadOperation();

        await router.push(getRoute("operations-by-id-details", [operationId]));
      } else {
        toast("Failed to update the operation.");
      }
    } catch (error) {
      toast(`Failed to update the operation. ${error}`);
    }
  };

  /**
   *  - - - - Delete Operation logic
   */

  // Mutation
  const deleteOpsFileMutation = useMutation<boolean, Error, string>({
    mutationKey: ["DeleteOperationMutation"],
    mutationFn: async (opFileId) => await deleteOpsFile(opFileId),
    onError(error) {
      toast(`Failure deleting operation. ${error}`);
    },
  });

  const { isOpen: isDeleteOpsFileOpen, setIsOpen: setIsDeleteOpsFileOpen } =
    useDialog();

  const [deleteConfirmationText, setDeleteConfirmationText] =
    useState<string>("");

  const openDeleteConfirmationDialog = () => {
    setDeleteConfirmationText("");
    setIsDeleteOpsFileOpen(true);
  };

  const handleDeleteOpsFile = async (id: string) => {
    if (!id) {
      toast("Unable to delete operation. No ID found");
      return;
    }

    const success = await deleteOpsFileMutation.mutateAsync(id);

    if (success) {
      // Close modal
      setIsDeleteOpsFileOpen(false);
      toast("The operation has been deleted successfully.");
      router.push("/app/operations");
    } else {
      toast("Failed to delete the operation.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (!operation) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold">Operation not found</h2>
        <p className="text-muted-foreground mb-4">
          The operation you{"'"}re looking for doesn{"'"}t exist.
        </p>
        <Button asChild>
          <Link href="/app/operations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Operations
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={getRoute("operations-by-id-details", [params.id])}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Edit operation
            </h1>
            <p className="text-muted-foreground">
              Ensure your operation is up to date
            </p>
          </div>
        </div>

        {/* Other actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={openDeleteConfirmationDialog}
            className="cursor-pointer"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>

          {/* Delete ops file confirmation dialog */}
          <DeleteConfirmationDialog
            DialogProps={{
              open: isDeleteOpsFileOpen,
              onOpenChange: setIsDeleteOpsFileOpen,
            }}
            title={"Operation delete"}
            description={"Delete operation information"}
            body={
              <div className="">
                <div className="">
                  You are about to delete the current operation permanently.
                  This cannot be undone.
                </div>
                <div className="mt-4">
                  <span className="text-xs font-light">
                    Operation ID: {operationId}
                  </span>
                </div>
              </div>
            }
            confirmationText={deleteConfirmationText}
            updateConfirmationText={(val) => setDeleteConfirmationText(val)}
            onDelete={() => {
              handleDeleteOpsFile(operationId);
            }}
            onCancel={() => setIsDeleteOpsFileOpen(false)}
            isDeleting={deleteOpsFileMutation.isPending}
          />
        </div>
      </div>

      <div className="">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/app/operations`}>Operations</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={getRoute("operations-by-id-details", [operationId])}
                >
                  {shortUUID(operationId)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
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
                Non optional data is marked
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="statusId">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Controller
                  control={formData.control}
                  name="statusId"
                  render={({ field }) => {
                    return (
                      <>
                        <Select
                          value={String(field.value)}
                          onValueChange={(value) =>
                            handleSelectChange(field.name, Number(value))
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
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>

                          <SelectContent>
                            {!allOperationStatuses.length
                              ? null
                              : allOperationStatuses.map((statusId) => (
                                  <SelectItem
                                    value={String(statusId)}
                                    key={statusId}
                                  >
                                    {getOpsStatusName(statusId)}
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                      </>
                    );
                  }}
                />
              </div>

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
                            {!clients.length
                              ? null
                              : clients.map((client) => (
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
                            {!carriers.length
                              ? null
                              : carriers.map((carrier) => (
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
                              {!allCargoUnitTypes.length
                                ? null
                                : allCargoUnitTypes.map((unitType) => (
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
                    <MapPin className="h-4 text-blue-500" />
                    Origin location
                  </Label>
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
                    <MapPin className="h-4 text-emerald-500" />
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
                  <Label htmlFor="estimated_time_departure">
                    <CalendarArrowUp className="h-4 text-emerald-500" /> ETD
                  </Label>
                  <Input
                    id="estimated_time_departure"
                    type="date"
                    {...formData.register("estimatedTimeDeparture")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_time_arrival">
                    <CalendarArrowDown className="h-4 text-blue-500" /> ETA
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
                    <CalendarArrowUp className="h-4 text-emerald-500" /> ATD
                  </Label>
                  <Input
                    id="actual_time_departure"
                    type="date"
                    {...formData.register("actualTimeDeparture")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actual_time_arrival">
                    <CalendarArrowDown className="h-4 text-blue-500" /> ATA
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
                <Label htmlFor="voyage">Voyage</Label>
                <Input id="voyage" {...formData.register("voyage")} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            variant="outline"
            asChild
            disabled={editOperationMutation.isPending}
          >
            <Link href={getRoute("operations-by-id-details", [operationId])}>
              Cancel
            </Link>
          </Button>
          <Button
            type="submit"
            loading={editOperationMutation.isPending}
            disabled={editOperationMutation.isPending}
          >
            {editOperationMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
