"use client";

import { useMutation } from "@tanstack/react-query";
import {
  Ban,
  CheckCircle,
  Edit,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Smartphone,
  Trash2,
  UserPlus,
} from "lucide-react";
import { FC, useState } from "react";
import { toast } from "sonner";

import DeleteConfirmationDialog from "@/core/components/DeleteConfirmationDialog/DeleteConfirmationDialog";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Separator } from "@/core/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import useDialog from "@/core/hooks/useDialog";
import { useAuth } from "@/modules/auth/lib/auth";
import { UserRolesIds } from "@/modules/auth/setup/auth";
import CarrierTypeBadge from "@/modules/carriers/components/CarrierTypeBadge/CarrierTypeBadge";
import useCarrierTypes from "@/modules/carriers/hooks/useCarrierTypes";
import useCarriers from "@/modules/carriers/hooks/useCarriers";
import {
  createCarrier,
  deleteCarrier,
  updateCarrier,
} from "@/modules/carriers/lib/carriers";
import {
  Carrier,
  CarrierContactCreateBase,
  CarrierCreate,
  CarrierUpdate,
} from "@/modules/carriers/types/carriers.types";

const ALL_TAB_OPTION = "all";

export default function CarriersPage() {
  /**
   * - - - Auth
   */
  const { user } = useAuth();
  const userRole = user?.role;

  /**
   * - - - Carrier types fetching
   */
  const {
    carrierTypes,
    isLoading: carrierTypesIsLoading,
    error: carrierTypesError,
    isError: carrierTypesIsError,
  } = useCarrierTypes({
    queryProps: {
      refetchOnWindowFocus: false, // Not necessary to refetch on window focus
    },
  });

  /**
   * - - - Carrier types tabs logic
   */
  const [selectedTab, setSelectedTab] = useState(ALL_TAB_OPTION);

  /**
   * - - - All Carriers fetching
   */
  // TODO fetch only by selected Carrier type
  const {
    carriers,
    query: carriersQuery,
    isLoading: carriersIsLoading,
    error: carriersError,
    isError: carriersIsError,
  } = useCarriers({
    queryProps: { enabled: !!carrierTypes && !carrierTypesIsError },
  });

  const reloadCarriers = async () => {
    await carriersQuery.refetch();
  };

  const isLoadingCarriersData = carriersIsLoading || carrierTypesIsLoading;
  const isErrorCarriersData = carriersIsError || carrierTypesIsError;

  /**
   * - - - Search and filters logic
   */

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCarriers = carriers
    // Filter by search
    .filter((carrier) =>
      [carrier.name, carrier.carrierId, carrier?.taxId].some((token) =>
        token
          ?.normalize("NFD")
          ?.replace(/[\u0300-\u036f]/g, "")
          ?.toLowerCase()
          ?.includes(
            searchTerm
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
          )
      )
    )
    // Filter by selected tab
    .filter(
      (carrier) =>
        selectedTab === ALL_TAB_OPTION ||
        selectedTab === carrier.carrierType.carrierTypeId
    );

  /**
   * - - - - Selected Carrier logic (for both details and edit)
   */
  const [currentCarrier, setCurrentCarrier] = useState<Carrier | null>(null);

  /**
   * - - - Carrier details modal logic
   */

  const carrierDetailsDialogData = useDialog();

  const openDetailsDialog = (Carrier: Carrier) => {
    setCurrentCarrier(Carrier);

    carrierDetailsDialogData.open();
  };

  /**
   * - - - - New Carrier contacts logic
   */

  // List of contacts to be added when creating Carrier
  const [contacts, setContacts] = useState<CarrierContactCreateBase[]>([]);

  const addContact = () => {
    setContacts([
      ...contacts,
      {
        name: "",
        email: "",
        phone: "",
        mobile: "",
        position: "",
        disabled: false,
      },
    ]);
  };

  const updateContact = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updatedContacts = [...contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setContacts(updatedContacts);
  };

  const removeContact = (index: number) => {
    const updatedContacts = [...contacts];
    updatedContacts.splice(index, 1);

    setContacts(updatedContacts);
  };

  const resetContacts = () => {
    setContacts([]);
  };

  /**
   * - - --  Carrier create logic
   */

  // Mutation
  const createCarrierMutation = useMutation<Carrier, Error, CarrierCreate>({
    mutationKey: ["createCarrierMutation"],
    mutationFn: async (newData) => await createCarrier(newData),
    onError(error) {
      toast(`Failure creating carrier. ${error}`);
    },
  });

  const { isOpen: isNewCarrierOpen, setIsOpen: setIsNewCarrierOpen } =
    useDialog();

  // Data for new Carrier on form in dialog
  const [newCarrierData, setNewCarrierData] = useState<CarrierCreate>({
    name: "",
    carrierTypeId: "",
    disabled: false,
    taxId: null,
    contacts: [],
  });

  const resetNewCarrierData = () => {
    setNewCarrierData({
      name: "",
      carrierTypeId: "",
      disabled: false,
      taxId: null,
      contacts: [],
    });

    resetContacts();
  };

  const updateNewCarrierData = (newData: Partial<CarrierCreate>) => {
    setNewCarrierData((c) => ({
      ...c,
      ...newData,
    }));
  };

  const handleCreateCarrier = async () => {
    // TODO Validate all data
    const newCarrierName = String(newCarrierData?.name || "").trim();

    if (!newCarrierName) {
      toast("Carrier name is required");
      return;
    }

    const carrierTypeId = newCarrierData?.carrierTypeId || "";

    if (!carrierTypeId) {
      toast("Carrier type is required");
      return;
    }

    const processedContacts =
      contacts?.map((contact) => ({
        name: contact?.name?.trim(),
        email: contact?.email?.toLowerCase()?.trim(),
        mobile: contact?.mobile?.toLowerCase()?.trim(),
        phone: contact?.phone?.toLowerCase()?.trim(),
        position: contact?.position?.trim(),
        disabled: contact?.disabled || false,
      })) || [];

    const isInvalidContact = processedContacts.some((contact) => !contact.name);

    if (isInvalidContact) {
      toast("Contacts must have a valid name");
      return;
    }

    const newCarrier = await createCarrierMutation.mutateAsync({
      name: newCarrierName,
      carrierTypeId: carrierTypeId,
      disabled: newCarrierData?.disabled || false,
      taxId: newCarrierData?.taxId || null,
      contacts: processedContacts,
    });

    toast(`The carrier ${newCarrier.name} has been created successfully.`);

    resetNewCarrierData();
    setIsNewCarrierOpen(false);

    await reloadCarriers();
  };

  /**
   * - - - - Edit Carrier contacts logic
   */

  // List of contacts to be added when creating Carrier
  const [editContacts, setEditContacts] = useState<CarrierContactCreateBase[]>(
    []
  );

  const addEditContact = () => {
    setEditContacts([
      ...editContacts,
      {
        name: "",
        email: "",
        phone: "",
        mobile: "",
        position: "",
        disabled: false,
      },
    ]);
  };

  const updateEditContact = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updatedContacts = [...editContacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setEditContacts(updatedContacts);
  };

  const removeEditContact = (index: number) => {
    const updatedContacts = [...editContacts];
    updatedContacts.splice(index, 1);

    setEditContacts(updatedContacts);
  };

  /**
   * - - --  Carrier update
   */

  // Mutation
  const updateCarrierMutation = useMutation<
    Carrier,
    Error,
    { carrierId: string; data: CarrierUpdate }
  >({
    mutationKey: ["updateCarrierMutation"],
    mutationFn: async ({ carrierId, data }) =>
      await updateCarrier(carrierId, data),
    onError(error) {
      toast(`Failure updating carrier. ${error}`);
    },
  });

  const { isOpen: isEditCarrierOpen, setIsOpen: setIsEditCarrierOpen } =
    useDialog();

  const [editCarrierData, setEditCarrierData] = useState<CarrierUpdate>({
    name: "",
  });

  const updateEditCarrierData = (editData: CarrierUpdate) => {
    setEditCarrierData((c) => ({
      ...c,
      ...editData,
    }));
  };

  const handleEditCarrier = async () => {
    // TODO validate data
    const editCarrierName = editCarrierData?.name?.trim();

    if (!editCarrierName) {
      toast("Carrier name is required");
      return;
    }

    if (!currentCarrier) {
      toast("Unable to get carrier data");
      return;
    }

    const updatedCarrier = await updateCarrierMutation.mutateAsync({
      carrierId: currentCarrier.carrierId,
      data: {
        name: editCarrierName,
        carrierTypeId: editCarrierData?.carrierTypeId || "",
        disabled: editCarrierData?.disabled || false,
        taxId: editCarrierData?.taxId || null,
        contacts: editContacts || [],
      },
    });

    toast(`The carrier ${updatedCarrier?.name} has been updated successfully.`);

    setIsEditCarrierOpen(false);
    await reloadCarriers();
  };

  const handleSetDisable = async (carrierId: string, value: boolean) => {
    const updatedCarrier = await updateCarrierMutation.mutateAsync({
      carrierId: carrierId,
      data: {
        disabled: value || false,
      },
    });

    toast(
      `The carrier ${updatedCarrier?.name} has been ${
        updatedCarrier?.disabled ? "disabled" : "enabled"
      } successfully.`
    );

    await reloadCarriers();
    return;
  };

  const openEditDialog = (carrier: Carrier) => {
    setCurrentCarrier(carrier);
    setEditCarrierData({
      name: carrier?.name,
      carrierTypeId: carrier?.carrierType.carrierTypeId || "",
      disabled: carrier?.disabled,
      taxId: carrier?.taxId,
      contacts: carrier?.contacts || [],
    });

    setEditContacts(carrier?.contacts || []);

    setIsEditCarrierOpen(true);
  };

  /**
   * - - --  Carrier delete logic
   */

  // Mutation
  const deleteCarrierMutation = useMutation<boolean, Error, string>({
    mutationKey: ["deleteCarrierMutation"],
    mutationFn: async (carrierId) => await deleteCarrier(carrierId),
    onError(error) {
      toast(`Failure deleting carrier. ${error}`);
    },
  });

  const { isOpen: isDeleteCarrierOpen, setIsOpen: setIsDeleteCarrierOpen } =
    useDialog();

  const [deleteConfirmationText, setDeleteConfirmationText] =
    useState<string>("");

  const openDeleteConfirmationDialog = () => {
    setDeleteConfirmationText("");
    setIsDeleteCarrierOpen(true);
  };

  const handleDeleteCarrier = async (id: string) => {
    if (!id) {
      toast("Unable to delete carrier. No ID found");
      return;
    }

    const success = await deleteCarrierMutation.mutateAsync(id);

    if (success) {
      // Close modal
      setIsDeleteCarrierOpen(false);
      toast("The carrier has been deleted successfully.");
      await reloadCarriers();
    } else {
      toast("Failed to delete the carrier.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Carriers</h1>
          <p className="text-muted-foreground">Manage your carriers</p>
        </div>
        {/* Create Carrier dialog */}
        <Dialog
          open={isNewCarrierOpen}
          onOpenChange={(open) => {
            resetNewCarrierData();
            setIsNewCarrierOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Carrier
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-fit max-w-[40rem]">
            <DialogHeader>
              <DialogTitle>Create new carrier</DialogTitle>
              <DialogDescription>
                Add a new carrier to your system.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pl-1 pr-4">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Details</Label>
                </div>
                <div className="grid grid-cols-2 w-full gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Carrier name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={newCarrierData?.name || ""}
                      onChange={(e) =>
                        updateNewCarrierData({ name: e.target.value })
                      }
                      placeholder="Enter carrier name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Carrier type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newCarrierData.carrierTypeId}
                      onValueChange={(value) =>
                        updateNewCarrierData({ carrierTypeId: value })
                      }
                      disabled={carrierTypesIsLoading || carrierTypesIsError}
                    >
                      <SelectTrigger
                        id={"CarrierType"}
                        disabled={carrierTypesIsLoading || carrierTypesIsError}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>

                      <SelectContent>
                        {!carrierTypes.length
                          ? null
                          : carrierTypes.map((type) => (
                              <SelectItem
                                value={type.carrierTypeId}
                                key={type.carrierTypeId}
                              >
                                {type.name}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxId">
                      Tax ID{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      id="taxId"
                      value={newCarrierData?.taxId || ""}
                      onChange={(e) =>
                        updateNewCarrierData({ taxId: e.target.value })
                      }
                      placeholder="Enter tax ID"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <Label>Contact persons</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addContact}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Contact
                  </Button>
                </div>

                {contacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No contacts added yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {contacts.map((contact, index) => (
                      <Card key={index}>
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">
                              Contact {index + 1}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeContact(index)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                              <Label htmlFor={`contact-name-${index}`}>
                                Name <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id={`contact-name-${index}`}
                                value={contact.name}
                                onChange={(e) =>
                                  updateContact(index, "name", e.target.value)
                                }
                                placeholder="Contact name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`contact-position-${index}`}>
                                Position{" "}
                                <span className="text-muted-foreground">
                                  (optional)
                                </span>
                              </Label>
                              <Input
                                id={`contact-position-${index}`}
                                value={contact.position || ""}
                                onChange={(e) =>
                                  updateContact(
                                    index,
                                    "position",
                                    e.target.value
                                  )
                                }
                                placeholder="Position or title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor={`contact-email-${index}`}
                                className="flex items-center gap-1"
                              >
                                <Mail className="h-3 w-3" /> Email{" "}
                                <span className="text-muted-foreground">
                                  (optional)
                                </span>
                              </Label>
                              <Input
                                id={`contact-email-${index}`}
                                type="email"
                                inputMode="email"
                                value={contact.email || ""}
                                onChange={(e) =>
                                  updateContact(index, "email", e.target.value)
                                }
                                placeholder="Email address"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor={`contact-mobile-${index}`}
                                className="flex items-center gap-1"
                              >
                                <Smartphone className="h-3 w-3" /> Mobile
                                <span className="text-muted-foreground">
                                  (optional)
                                </span>
                              </Label>
                              <Input
                                id={`contact-mobile-${index}`}
                                title="tel"
                                inputMode="tel"
                                value={contact.mobile || ""}
                                onChange={(e) =>
                                  updateContact(index, "mobile", e.target.value)
                                }
                                placeholder="Mobile number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor={`contact-phone-${index}`}
                                className="flex items-center gap-1"
                              >
                                <Phone className="h-3 w-3" /> Phone
                                <span className="text-muted-foreground">
                                  (optional)
                                </span>
                              </Label>
                              <Input
                                id={`contact-phone-${index}`}
                                title="tel"
                                inputMode="tel"
                                value={contact.phone || ""}
                                onChange={(e) =>
                                  updateContact(index, "phone", e.target.value)
                                }
                                placeholder="Phone number"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetNewCarrierData();
                  setIsNewCarrierOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={createCarrierMutation.isPending}
                onClick={handleCreateCarrier}
                loading={createCarrierMutation.isPending}
              >
                {createCarrierMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Carriers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Tabs
          defaultValue={ALL_TAB_OPTION}
          value={selectedTab}
          onValueChange={setSelectedTab}
          orientation="horizontal"
          className="max-w-[90vw]"
        >
          <div className="relative w-full overflow-x-auto scrollbar-hide">
            <TabsList className="space-x-2">
              <TabsTrigger className="cursor-pointer" value={ALL_TAB_OPTION}>
                All carriers
              </TabsTrigger>
              {carrierTypes?.map((type) => (
                <TabsTrigger
                  className="cursor-pointer"
                  key={type.carrierTypeId}
                  value={type.carrierTypeId}
                >
                  {type.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={ALL_TAB_OPTION} className="mt-4">
            <CarriersTable
              carriers={filteredCarriers}
              isLoading={isLoadingCarriersData}
              isError={isErrorCarriersData}
              error={carrierTypesError || carriersError}
              userRoleId={userRole?.roleId || ""}
              onOpenDetails={(carrier) => openDetailsDialog(carrier)}
              onDelete={(carrier) => {
                setCurrentCarrier(carrier);
                openDeleteConfirmationDialog();
              }}
              onSetDisable={(carrier) =>
                handleSetDisable(carrier.carrierId, !carrier?.disabled)
              }
            />
          </TabsContent>

          {carrierTypes?.map((type) => (
            <TabsContent
              key={type.carrierTypeId}
              value={type.carrierTypeId}
              className="mt-4"
            >
              <CarriersTable
                carriers={filteredCarriers}
                isLoading={isLoadingCarriersData}
                isError={isErrorCarriersData}
                error={carrierTypesError || carriersError}
                userRoleId={userRole?.roleId || ""}
                onOpenDetails={(carrier) => openDetailsDialog(carrier)}
                onDelete={(carrier) => {
                  setCurrentCarrier(carrier);
                  openDeleteConfirmationDialog();
                }}
                onSetDisable={(carrier) =>
                  handleSetDisable(carrier.carrierId, !carrier?.disabled)
                }
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Details modal */}
      <Dialog
        open={carrierDetailsDialogData.isOpen}
        onOpenChange={carrierDetailsDialogData.setIsOpen}
      >
        <DialogContent className="min-w-fit max-w-[40rem]">
          <DialogHeader>
            <DialogTitle>Carrier details</DialogTitle>
            <DialogDescription className="text-xs">
              View carrier information
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] px-4 my-2">
            {/* Subheader */}
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Details</Label>
            </div>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="space-y-2">
                  <Label>Carrier name</Label>
                  <div>{currentCarrier?.name || "-"}</div>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div>{currentCarrier?.carrierType?.name || "-"}</div>
                </div>
                <div className="space-y-2">
                  <Label>Tax ID</Label>
                  <div>{currentCarrier?.taxId || "-"}</div>
                </div>
              </div>

              <Separator />

              {/* Contacts */}

              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  Contact persons
                </Label>
              </div>

              {!currentCarrier?.contacts?.length ? (
                <p className="text-sm text-muted-foreground">
                  No contacts added yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {currentCarrier.contacts.map((contact, index) => (
                    <Card key={index}>
                      <CardHeader className="px-4 py-0">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {contact?.name || `Contact ${index + 1}`}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                          {contact.carrierContactId}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 pt-0">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label htmlFor={`edit-contact-position-${index}`}>
                              Position
                            </Label>
                            <div>{contact?.position || "-"}</div>
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor={`edit-contact-email-${index}`}
                              className="flex items-center gap-1"
                            >
                              <Mail className="h-3 w-3" /> Email
                            </Label>
                            <div>{contact?.email || "-"}</div>
                          </div>
                          <div className="space-y-2">
                            <Label className="flex items-center gap-1">
                              <Phone className="h-3 w-3" /> Mobile
                            </Label>
                            <div>{contact?.mobile || "-"}</div>
                          </div>
                          <div className="space-y-2">
                            <Label className="flex items-center gap-1">
                              <Phone className="h-3 w-3" /> Phone
                            </Label>
                            <div>{contact?.phone || "-"}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <Separator />

              {/* Others */}

              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Others</Label>
              </div>

              <div className="grid grid-cols-1 gap-4 text-xs mt-6">
                <div className="space-y-2">
                  <Label>Internal ID</Label>
                  <div className="whitespace-nowrap">
                    {currentCarrier?.carrierId || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Created at</Label>
                  <div className="whitespace-nowrap">
                    {currentCarrier?.createdAt || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Last update</Label>
                  <div className="whitespace-nowrap">
                    {currentCarrier?.updatedAt || "-"}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              onClick={() => {
                if (!currentCarrier) {
                  console.error(
                    "No selected Carrier found. Unable to open edit dialog after details dialog"
                  );
                  return;
                }

                // close details dialog
                carrierDetailsDialogData.close();

                openEditDialog(currentCarrier);
              }}
            >
              Edit
            </Button>
            <Button variant="outline" onClick={carrierDetailsDialogData.close}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Carrier dialog */}
      <Dialog open={isEditCarrierOpen} onOpenChange={setIsEditCarrierOpen}>
        <DialogContent className="min-w-fit max-w-[40rem]">
          <DialogHeader>
            <DialogTitle>Edit Carrier</DialogTitle>
            <DialogDescription>Update Carrier information.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pl-1 pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="font-semibold">Details</Label>
              </div>
              <div className="grid grid-cols-2 w-full gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Carrier name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={editCarrierData?.name || ""}
                    onChange={(e) =>
                      updateEditCarrierData({ name: e.target.value })
                    }
                    placeholder="Enter carrier name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Carrier type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={editCarrierData.carrierTypeId}
                    onValueChange={(value) =>
                      updateEditCarrierData({ carrierTypeId: value })
                    }
                    disabled={carrierTypesIsLoading || carrierTypesIsError}
                  >
                    <SelectTrigger
                      id={"carrierType"}
                      disabled={carrierTypesIsLoading || carrierTypesIsError}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>

                    <SelectContent>
                      {!carrierTypes.length
                        ? null
                        : carrierTypes.map((type) => (
                            <SelectItem
                              value={type.carrierTypeId}
                              key={type.carrierTypeId}
                            >
                              {type.name}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">
                    Tax ID{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="taxId"
                    value={editCarrierData?.taxId || ""}
                    onChange={(e) =>
                      updateEditCarrierData({ taxId: e.target.value })
                    }
                    placeholder="Enter tax ID"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label>Contact persons</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEditContact}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </div>

              {editContacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No contacts added yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {editContacts.map((contact, index) => (
                    <Card key={index}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {contact?.name || `Contact ${index + 1}`}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEditContact(index)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-2">
                            <Label htmlFor={`contact-name-${index}`}>
                              Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`contact-name-${index}`}
                              value={contact.name}
                              onChange={(e) =>
                                updateEditContact(index, "name", e.target.value)
                              }
                              placeholder="Contact name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`contact-position-${index}`}>
                              Position{" "}
                              <span className="text-muted-foreground">
                                (optional)
                              </span>
                            </Label>
                            <Input
                              id={`contact-position-${index}`}
                              value={contact.position || ""}
                              onChange={(e) =>
                                updateEditContact(
                                  index,
                                  "position",
                                  e.target.value
                                )
                              }
                              placeholder="Position or title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor={`contact-email-${index}`}
                              className="flex items-center gap-1"
                            >
                              <Mail className="h-3 w-3" /> Email{" "}
                              <span className="text-muted-foreground">
                                (optional)
                              </span>
                            </Label>
                            <Input
                              id={`contact-email-${index}`}
                              type="email"
                              inputMode="email"
                              value={contact.email || ""}
                              onChange={(e) =>
                                updateEditContact(
                                  index,
                                  "email",
                                  e.target.value
                                )
                              }
                              placeholder="Email address"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor={`contact-mobile-${index}`}
                              className="flex items-center gap-1"
                            >
                              <Smartphone className="h-3 w-3" /> Mobile
                              <span className="text-muted-foreground">
                                (optional)
                              </span>
                            </Label>
                            <Input
                              id={`contact-mobile-${index}`}
                              title="tel"
                              inputMode="tel"
                              value={contact.mobile || ""}
                              onChange={(e) =>
                                updateEditContact(
                                  index,
                                  "mobile",
                                  e.target.value
                                )
                              }
                              placeholder="Mobile number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor={`contact-phone-${index}`}
                              className="flex items-center gap-1"
                            >
                              <Phone className="h-3 w-3" /> Phone
                              <span className="text-muted-foreground">
                                (optional)
                              </span>
                            </Label>
                            <Input
                              id={`contact-phone-${index}`}
                              title="tel"
                              inputMode="tel"
                              value={contact.phone || ""}
                              onChange={(e) =>
                                updateEditContact(
                                  index,
                                  "phone",
                                  e.target.value
                                )
                              }
                              placeholder="Phone number"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditCarrierOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              disabled={
                updateCarrierMutation.isPending ||
                userRole?.roleId !== UserRolesIds.ADMIN
              }
              onClick={() => {
                setIsEditCarrierOpen(false);
                openDeleteConfirmationDialog();
              }}
            >
              Delete
            </Button>
            <Button
              onClick={handleEditCarrier}
              disabled={updateCarrierMutation.isPending}
              loading={updateCarrierMutation.isPending}
            >
              {updateCarrierMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation modal */}
      <DeleteConfirmationDialog
        DialogProps={{
          open: isDeleteCarrierOpen,
          onOpenChange: setIsDeleteCarrierOpen,
        }}
        title={"Carrier delete"}
        description={"Delete Carrier information"}
        body={
          <div className="">
            You are about to delete the carrier{" "}
            <span className="font-semibold underline">
              {currentCarrier?.name}
            </span>{" "}
            and all their associated data permanently, including operations.
            This cannot be undone.
          </div>
        }
        confirmationText={deleteConfirmationText}
        updateConfirmationText={(val) => setDeleteConfirmationText(val)}
        onDelete={() => {
          handleDeleteCarrier(currentCarrier?.carrierId || "");
        }}
        onCancel={() => setIsDeleteCarrierOpen(false)}
        isDeleting={deleteCarrierMutation.isPending}
      />
    </div>
  );
}

type CarriersTableProps = {
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  carriers: Carrier[] | undefined;
  onOpenDetails: (Carrier: Carrier) => void;
  onDelete: (Carrier: Carrier) => void;
  onSetDisable: (Carrier: Carrier) => void;
  userRoleId?: string;
};

const CarriersTable: FC<CarriersTableProps> = ({
  isLoading = false,
  isError = false,
  error,
  carriers,
  onOpenDetails,
  onDelete,
  onSetDisable,
  userRoleId,
}) => {
  return (
    <div className="border rounded-md w-full lg:max-w-full max-w-[90vw]">
      <Table className="w-full overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Contacts</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-8 text-muted-foreground"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-8 text-muted-foreground"
              >
                Unable to get carriers data. (
                {String(error || "unknown details")})
              </TableCell>
            </TableRow>
          ) : carriers?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-8 text-muted-foreground"
              >
                No carriers found
              </TableCell>
            </TableRow>
          ) : (
            carriers?.map((carrier) => (
              <TableRow key={carrier.carrierId}>
                <TableCell
                  className="font-medium"
                  onClick={() => onOpenDetails(carrier)}
                >
                  {carrier?.name || "-"}
                  {!!carrier?.disabled && (
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-800 hover:bg-red-100 ml-2"
                    >
                      disabled
                    </Badge>
                  )}
                </TableCell>
                <TableCell
                  className="font-medium text-xs"
                  onClick={() => onOpenDetails(carrier)}
                >
                  <CarrierTypeBadge
                    carrierTypeId={carrier?.carrierType.carrierTypeId}
                  >
                    {carrier?.carrierType?.name || "-"}
                  </CarrierTypeBadge>
                </TableCell>

                <TableCell className="" onClick={() => onOpenDetails(carrier)}>
                  <div className="text-sm">
                    <div>
                      {carrier?.contacts?.[0]?.name || "-"}{" "}
                      {carrier?.contacts?.length > 1 && (
                        <span className="font-semibold text-xs text-muted-foreground">
                          (+{carrier?.contacts?.length - 1})
                        </span>
                      )}
                    </div>
                    {carrier?.contacts?.[0]?.email && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />{" "}
                        {carrier?.contacts?.[0]?.email}
                      </div>
                    )}
                  </div>
                </TableCell>
                {/* Actions */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onOpenDetails(carrier)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onOpenDetails(carrier)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSetDisable(carrier)}>
                        {!carrier?.disabled ? (
                          <>
                            <Ban className="mr-2 h-4 w-4" />
                            Disable
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Enable
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          onDelete(carrier);
                        }}
                        disabled={
                          !!userRoleId && userRoleId !== UserRolesIds.ADMIN
                        }
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
