"use client";

import { useMutation } from "@tanstack/react-query";
import {
  Ban,
  CheckCircle,
  Edit,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
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
import CountrySelector from "@/modules/geodata/components/CountrySelector/CountrySelector";
import useCountries from "@/modules/geodata/hooks/useCountries";
import usePartnerTypes from "@/modules/partners/hooks/usePartnerTypes";
import usePartners from "@/modules/partners/hooks/usePartners";
import {
  createPartner,
  deletePartner,
  updatePartner,
} from "@/modules/partners/lib/partners";
import { PartnerTypesIds } from "@/modules/partners/setup/partners";
import {
  Partner,
  PartnerContactCreateWithoutPartnerId,
  PartnerCreate,
  PartnerUpdate,
} from "@/modules/partners/types/partners.types";

const ALL_TAB_OPTION = "all";

export default function PartnersPage() {
  /**
   * - - - Auth
   */
  const { user } = useAuth();
  const userRole = user?.role.roleId;

  /**
   * - - - Partner types fetching
   */
  const {
    partnerTypes,
    // query: partnerTypesQuery,
    isLoading: partnerTypesIsLoading,
    error: partnerTypesError,
    isError: partnerTypesIsError,
  } = usePartnerTypes({
    queryProps: {
      refetchOnWindowFocus: false, // Not necessary to refetch on window focus
    },
  });

  /**
   * - - - Partner types tabs logic
   */
  const [selectedTab, setSelectedTab] = useState(ALL_TAB_OPTION);

  //   const reloadPartnerTypes = async () => {
  //     await partnerTypesQuery.refetch();
  //   };

  /**
   * - - - Countries fetching logic
   */
  const {
    countries,
    // query: partnerTypesQuery,
    isLoading: countriesIsLoading,
    // error: countriesError,
    // isError: countriesIsError,
  } = useCountries({
    queryProps: {
      refetchOnWindowFocus: false, // Not necessary to refetch on window focus
    },
  });

  /**
   * - - - All partners fetching
   */
  // TODO fetch only by selected partner type
  const {
    partners,
    query: partnersQuery,
    isLoading: partnersIsLoading,
    error: partnersError,
    isError: partnersIsError,
  } = usePartners({
    queryProps: { enabled: !!partnerTypes && !partnerTypesIsError },
  });

  const reloadPartners = async () => {
    await partnersQuery.refetch();
  };

  const isLoadingPartnersData = partnersIsLoading || partnerTypesIsLoading;
  const isErrorPartnersData = partnersIsError || partnerTypesIsError;

  /**
   * - - - Search and filters logic
   */

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPartners = partners
    // Filter by search
    .filter((partner) =>
      [
        partner.name,
        partner.partnerId,
        partner.country?.iso2Code,
        partner.country?.iso3Code,
        partner.country?.name,
      ].some((token) =>
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
      (partner) =>
        selectedTab === ALL_TAB_OPTION ||
        selectedTab === partner.partnerType.partnerTypeId
    );

  /**
   * - - - - Selected partner logic (for both details and edit)
   */
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);

  /**
   * - - - Partner details modal logic
   */

  const partnerDetailsDialogData = useDialog();

  const openDetailsDialog = (partner: Partner) => {
    setCurrentPartner(partner);

    partnerDetailsDialogData.open();
  };

  /**
   * - - - - New Partner contacts logic
   */

  // List of contacts to be added when creating partner
  const [contacts, setContacts] = useState<
    PartnerContactCreateWithoutPartnerId[]
  >([]);

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
   * - - --  Partner create logic
   */

  // Mutation
  const createPartnerMutation = useMutation<Partner, Error, PartnerCreate>({
    mutationKey: ["createPartnerMutation"],
    mutationFn: async (newData) => await createPartner(newData),
    onError(error) {
      toast(`Failure creating partner. ${error}`);
    },
  });

  const { isOpen: isNewPartnerOpen, setIsOpen: setIsNewPartnerOpen } =
    useDialog();

  // Data for new partner on form in dialog
  const [newPartnerData, setNewPartnerData] = useState<PartnerCreate>({
    name: "",
    countryId: null,
    partnerTypeId: "",
    disabled: false,
    taxId: null,
    webpage: null,
    contacts: [],
  });

  const resetNewPartnerData = () => {
    setNewPartnerData({
      name: "",
      countryId: null,
      partnerTypeId: "",
      disabled: false,
      taxId: null,
      webpage: null,
      contacts: [],
    });

    resetContacts();
  };

  const updateNewPartnerData = (newData: Partial<PartnerCreate>) => {
    setNewPartnerData((c) => ({
      ...c,
      ...newData,
    }));
  };

  const handleCreatePartner = async () => {
    // TODO Validate all data
    const newPartnerName = String(newPartnerData?.name || "").trim();

    if (!newPartnerName) {
      toast("Partner name is required");
      return;
    }

    const partnerTypeId = newPartnerData?.partnerTypeId || "";

    if (!partnerTypeId) {
      toast("Partner type is required");
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

    const newPartner = await createPartnerMutation.mutateAsync({
      name: newPartnerName,
      countryId: newPartnerData?.countryId || null,
      partnerTypeId: partnerTypeId,
      disabled: newPartnerData?.disabled || false,
      taxId: newPartnerData?.taxId || null,
      webpage: newPartnerData?.webpage || null,
      contacts: processedContacts,
    });

    toast(`The partner ${newPartner.name} has been created successfully.`);

    resetNewPartnerData();
    setIsNewPartnerOpen(false);

    await reloadPartners();
  };

  /**
   * - - - - Edit Partner contacts logic
   */

  // List of contacts to be added when creating partner
  const [editContacts, setEditContacts] = useState<
    PartnerContactCreateWithoutPartnerId[]
  >([]);

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
   * - - --  Partner update
   */

  // Mutation
  const updatePartnerMutation = useMutation<
    Partner,
    Error,
    { partnerId: string; data: PartnerUpdate }
  >({
    mutationKey: ["updatePartnerMutation"],
    mutationFn: async ({ partnerId, data }) =>
      await updatePartner(partnerId, data),
    onError(error) {
      toast(`Failure updating partner. ${error}`);
    },
  });

  const { isOpen: isEditPartnerOpen, setIsOpen: setIsEditPartnerOpen } =
    useDialog();

  const [editPartnerData, setEditPartnerData] = useState<PartnerUpdate>({
    name: "",
  });

  const updateEditPartnerData = (editData: PartnerUpdate) => {
    setEditPartnerData((c) => ({
      ...c,
      ...editData,
    }));
  };

  const handleEditPartner = async () => {
    // TODO validate data
    const editPartnerName = editPartnerData?.name?.trim();

    if (!editPartnerName) {
      toast("Partner name is required");
      return;
    }

    if (!currentPartner) {
      toast("Unable to get partner data");
      return;
    }

    const updatedPartner = await updatePartnerMutation.mutateAsync({
      partnerId: currentPartner.partnerId,
      data: {
        name: editPartnerName,
        countryId: editPartnerData?.countryId || null,
        partnerTypeId: editPartnerData?.partnerTypeId || "",
        disabled: editPartnerData?.disabled || false,
        taxId: editPartnerData?.taxId || null,
        webpage: editPartnerData?.webpage || null,
        contacts: editContacts || [],
      },
    });

    toast(`The partner ${updatedPartner?.name} has been updated successfully.`);

    setIsEditPartnerOpen(false);
    await reloadPartners();
  };

  const handleSetDisable = async (partnerId: string, value: boolean) => {
    const updatedPartner = await updatePartnerMutation.mutateAsync({
      partnerId: partnerId,
      data: {
        disabled: value || false,
      },
    });

    toast(
      `The partner ${updatedPartner?.name} has been ${
        updatedPartner?.disabled ? "disabled" : "enabled"
      } successfully.`
    );

    await reloadPartners();
    return;
  };

  const openEditDialog = (partner: Partner) => {
    setCurrentPartner(partner);
    setEditPartnerData({
      name: partner?.name,
      countryId: partner?.country?.countryId || null,
      partnerTypeId: partner?.partnerType.partnerTypeId || "",
      disabled: partner?.disabled,
      taxId: partner?.taxId,
      webpage: partner?.webpage,
      contacts: partner?.contacts || [],
    });

    setEditContacts(partner?.contacts || []);

    setIsEditPartnerOpen(true);
  };

  /**
   * - - --  Partner delete logic
   */

  // Mutation
  const deletePartnerMutation = useMutation<boolean, Error, string>({
    mutationKey: ["deletePartnerMutation"],
    mutationFn: async (partnerId) => await deletePartner(partnerId),
    onError(error) {
      toast(`Failure deleting partner. ${error}`);
    },
  });

  const { isOpen: isDeletePartnerOpen, setIsOpen: setIsDeletePartnerOpen } =
    useDialog();

  const [deleteConfirmationText, setDeleteConfirmationText] =
    useState<string>("");

  const openDeleteConfirmationDialog = () => {
    setDeleteConfirmationText("");
    setIsDeletePartnerOpen(true);
  };

  const handleDeletePartner = async (id: string) => {
    if (!id) {
      toast("Unable to delete partner. No ID found");
      return;
    }

    const success = await deletePartnerMutation.mutateAsync(id);

    if (success) {
      // Close modal
      setIsDeletePartnerOpen(false);
      toast("The partner has been deleted successfully.");
      await reloadPartners();
    } else {
      toast("Failed to delete the partner.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
          <p className="text-muted-foreground">
            Manage your commercial partners and allies
          </p>
        </div>
        {/* Create partner dialog */}
        <Dialog
          open={isNewPartnerOpen}
          onOpenChange={(open) => {
            resetNewPartnerData();
            setIsNewPartnerOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-fit max-w-[40rem]">
            <DialogHeader>
              <DialogTitle>Create new partner</DialogTitle>
              <DialogDescription>
                Add a new partner to your system.
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
                      Partner name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={newPartnerData?.name || ""}
                      onChange={(e) =>
                        updateNewPartnerData({ name: e.target.value })
                      }
                      placeholder="Enter partner name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Partner type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newPartnerData.partnerTypeId}
                      onValueChange={(value) =>
                        updateNewPartnerData({ partnerTypeId: value })
                      }
                      disabled={partnerTypesIsLoading || partnerTypesIsError}
                    >
                      <SelectTrigger
                        id={"partnerType"}
                        disabled={partnerTypesIsLoading || partnerTypesIsError}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>

                      <SelectContent>
                        {!partnerTypes.length
                          ? null
                          : partnerTypes.map((type) => (
                              <SelectItem
                                value={type.partnerTypeId}
                                key={type.partnerTypeId}
                              >
                                {type.name}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="country">
                      Country{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <CountrySelector
                      countries={countries || []}
                      isLoading={countriesIsLoading}
                      value={newPartnerData?.countryId || null}
                      onValueChange={(value) =>
                        updateNewPartnerData({ countryId: value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxId">
                      Tax ID{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      id="taxId"
                      value={newPartnerData?.taxId || ""}
                      onChange={(e) =>
                        updateNewPartnerData({ taxId: e.target.value })
                      }
                      placeholder="Enter tax ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webpage">
                      Webpage{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      id="webpage"
                      value={newPartnerData?.webpage || ""}
                      onChange={(e) =>
                        updateNewPartnerData({ webpage: e.target.value })
                      }
                      placeholder="Enter webpage URL"
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
                            <div className="space-y-2">
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
                                value={contact.email || ""}
                                onChange={(e) =>
                                  updateContact(index, "email", e.target.value)
                                }
                                placeholder="Email address"
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
                  resetNewPartnerData();
                  setIsNewPartnerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={createPartnerMutation.isPending}
                onClick={handleCreatePartner}
                loading={createPartnerMutation.isPending}
              >
                {createPartnerMutation.isPending ? "Creating..." : "Create"}
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
            placeholder="Search partners..."
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
        >
          <TabsList className="gap-x-2">
            <TabsTrigger className="cursor-pointer" value={ALL_TAB_OPTION}>
              All partners
            </TabsTrigger>
            {partnerTypes?.map((type) => (
              <TabsTrigger
                className="cursor-pointer"
                key={type.partnerTypeId}
                value={type.partnerTypeId}
              >
                {type.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={ALL_TAB_OPTION} className="mt-4">
            <PartnersTable
              partners={filteredPartners}
              isLoading={isLoadingPartnersData}
              isError={isErrorPartnersData}
              error={partnerTypesError || partnersError}
              userRoleId={userRole}
              onOpenDetails={(partner) => openDetailsDialog(partner)}
              onDelete={(partner) => {
                setCurrentPartner(partner);
                openDeleteConfirmationDialog();
              }}
              onSetDisable={(partner) =>
                handleSetDisable(partner.partnerId, !partner?.disabled)
              }
            />
          </TabsContent>

          {partnerTypes?.map((type) => (
            <TabsContent
              key={type.partnerTypeId}
              value={type.partnerTypeId}
              className="mt-4"
            >
              <PartnersTable
                partners={filteredPartners}
                isLoading={isLoadingPartnersData}
                isError={isErrorPartnersData}
                error={partnerTypesError || partnersError}
                userRoleId={userRole}
                onOpenDetails={(partner) => openDetailsDialog(partner)}
                onDelete={(partner) => {
                  setCurrentPartner(partner);
                  openDeleteConfirmationDialog();
                }}
                onSetDisable={(partner) =>
                  handleSetDisable(partner.partnerId, !partner?.disabled)
                }
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Details modal */}
      <Dialog
        open={partnerDetailsDialogData.isOpen}
        onOpenChange={partnerDetailsDialogData.setIsOpen}
      >
        <DialogContent className="min-w-fit max-w-[40rem]">
          <DialogHeader>
            <DialogTitle>Partner details</DialogTitle>
            <DialogDescription className="text-xs">
              View partner information
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
                  <Label>Partner name</Label>
                  <div>{currentPartner?.name || "-"}</div>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div>{currentPartner?.partnerType?.name || "-"}</div>
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <div>
                    {currentPartner?.country ? (
                      <>
                        {currentPartner?.country.name} (
                        {currentPartner.country.iso2Code})
                      </>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tax ID</Label>
                  <div>{currentPartner?.taxId || "-"}</div>
                </div>
                <div className="space-y-2">
                  <Label className="">Webpage</Label>
                  <div>{currentPartner?.webpage || "-"}</div>
                </div>
              </div>

              <Separator />

              {/* Contacts */}

              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  Contact persons
                </Label>
              </div>

              {!currentPartner?.contacts?.length ? (
                <p className="text-sm text-muted-foreground">
                  No contacts added yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {currentPartner.contacts.map((contact, index) => (
                    <Card key={index}>
                      <CardHeader className="px-4 py-0">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {contact?.name || `Contact ${index + 1}`}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                          {contact.partnerContactId}
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

              {/* <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact name</Label>
                <div>{currentPartner?.contactName || "-"}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact phone</Label>
                <div>{currentPartner?.contactPhone || "-"}</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact email</Label>
              <div>{currentPartner?.contactEmail || "-"}</div>
            </div> */}

              <Separator />

              {/* Others */}

              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Others</Label>
              </div>

              <div className="grid grid-cols-1 gap-4 text-xs mt-6">
                <div className="space-y-2">
                  <Label>Internal ID</Label>
                  <div className="whitespace-nowrap">
                    {currentPartner?.partnerId || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Created at</Label>
                  <div className="whitespace-nowrap">
                    {currentPartner?.createdAt || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Last update</Label>
                  <div className="whitespace-nowrap">
                    {currentPartner?.updatedAt || "-"}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              onClick={() => {
                if (!currentPartner) {
                  console.error(
                    "No selected partner found. Unable to open edit dialog after details dialog"
                  );
                  return;
                }

                // close details dialog
                partnerDetailsDialogData.close();

                openEditDialog(currentPartner);
              }}
            >
              Edit
            </Button>
            <Button variant="outline" onClick={partnerDetailsDialogData.close}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit partner dialog */}
      <Dialog open={isEditPartnerOpen} onOpenChange={setIsEditPartnerOpen}>
        <DialogContent className="min-w-fit max-w-[40rem]">
          <DialogHeader>
            <DialogTitle>Edit Partner</DialogTitle>
            <DialogDescription>Update partner information.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pl-1 pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="font-semibold">Details</Label>
              </div>
              <div className="grid grid-cols-2 w-full gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Partner name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={editPartnerData?.name || ""}
                    onChange={(e) =>
                      updateEditPartnerData({ name: e.target.value })
                    }
                    placeholder="Enter partner name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Partner type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={editPartnerData.partnerTypeId}
                    onValueChange={(value) =>
                      updateEditPartnerData({ partnerTypeId: value })
                    }
                    disabled={partnerTypesIsLoading || partnerTypesIsError}
                  >
                    <SelectTrigger
                      id={"partnerType"}
                      disabled={partnerTypesIsLoading || partnerTypesIsError}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>

                    <SelectContent>
                      {!partnerTypes.length
                        ? null
                        : partnerTypes.map((type) => (
                            <SelectItem
                              value={type.partnerTypeId}
                              key={type.partnerTypeId}
                            >
                              {type.name}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="country">
                    Country{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <CountrySelector
                    countries={countries || []}
                    isLoading={countriesIsLoading}
                    value={editPartnerData?.countryId || null}
                    onValueChange={(value) =>
                      updateEditPartnerData({ countryId: value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">
                    Tax ID{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="taxId"
                    value={editPartnerData?.taxId || ""}
                    onChange={(e) =>
                      updateEditPartnerData({ taxId: e.target.value })
                    }
                    placeholder="Enter tax ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webpage">
                    Webpage{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="webpage"
                    value={editPartnerData?.webpage || ""}
                    onChange={(e) =>
                      updateEditPartnerData({ webpage: e.target.value })
                    }
                    placeholder="Enter webpage URL"
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
                          <div className="space-y-2">
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
            <Button variant="ghost" onClick={() => setIsEditPartnerOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              disabled={
                updatePartnerMutation.isPending ||
                userRole !== UserRolesIds.ADMIN
              }
              onClick={() => {
                setIsEditPartnerOpen(false);
                openDeleteConfirmationDialog();
              }}
            >
              Delete
            </Button>
            <Button
              onClick={handleEditPartner}
              disabled={updatePartnerMutation.isPending}
              loading={updatePartnerMutation.isPending}
            >
              {updatePartnerMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation modal */}
      <DeleteConfirmationDialog
        DialogProps={{
          open: isDeletePartnerOpen,
          onOpenChange: setIsDeletePartnerOpen,
        }}
        title={"Partner delete"}
        description={"Delete partner information"}
        body={
          <div className="">
            You are about to delete the partner{" "}
            <span className="font-semibold underline">
              {currentPartner?.name}
            </span>{" "}
            and all their associated data permanently, including operations.
            This cannot be undone.
          </div>
        }
        confirmationText={deleteConfirmationText}
        updateConfirmationText={(val) => setDeleteConfirmationText(val)}
        onDelete={() => {
          handleDeletePartner(currentPartner?.partnerId || "");
        }}
        onCancel={() => setIsDeletePartnerOpen(false)}
        isDeleting={deletePartnerMutation.isPending}
      />
    </div>
  );
}

type PartnersTableProps = {
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  partners: Partner[] | undefined;
  onOpenDetails: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
  onSetDisable: (partner: Partner) => void;
  userRoleId?: string;
};

const PartnersTable: FC<PartnersTableProps> = ({
  isLoading = false,
  isError = false,
  error,
  partners,
  onOpenDetails,
  onDelete,
  onSetDisable,
  userRoleId,
}) => {
  /**
   * Get the custom styles for each partner type ID (default styles if not included)
   *
   * @param {string} typeId
   *
   * @returns {string}
   */
  const getPartnerTypeStyles = (type: string) => {
    const styles: Partial<Record<PartnerTypesIds, string>> = {
      [PartnerTypesIds.LOGISTICS_OPERATOR]: "bg-blue-100 text-blue-800",
      [PartnerTypesIds.PORT_AGENT]: "bg-purple-100 text-purple-800",
      [PartnerTypesIds.INSURER]: "bg-yellow-100 text-yellow-800",
      [PartnerTypesIds.CUSTOMS_BROKER]: "bg-green-100 text-green-800",
      // TODO add the rest
    };

    const defaultStyle = "bg-gray-100 text-gray-800";

    return styles?.[type as PartnerTypesIds] || defaultStyle;
  };

  return (
    <div className="border rounded-md w-full lg:max-w-full max-w-[90vw]">
      <Table className="w-full overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Contacts</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                Unable to get partners data. (
                {String(error || "unknown details")})
              </TableCell>
            </TableRow>
          ) : partners?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                No partners found
              </TableCell>
            </TableRow>
          ) : (
            partners?.map((partner) => (
              <TableRow key={partner.partnerId}>
                <TableCell
                  className="font-medium"
                  onClick={() => onOpenDetails(partner)}
                >
                  {partner?.name || "-"}
                  {!!partner?.disabled && (
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
                  onClick={() => onOpenDetails(partner)}
                >
                  <Badge
                    className={getPartnerTypeStyles(
                      partner?.partnerType.partnerTypeId
                    )}
                  >
                    {partner?.partnerType?.name || "-"}
                  </Badge>
                </TableCell>
                <TableCell className="" onClick={() => onOpenDetails(partner)}>
                  <div className="text-sm">
                    <div>{partner?.country?.iso2Code || "-"}</div>
                    {partner?.country?.name && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {partner?.country?.name}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="" onClick={() => onOpenDetails(partner)}>
                  <div className="text-sm">
                    <div>
                      {partner?.contacts?.[0]?.name || "-"}{" "}
                      {partner?.contacts?.length > 1 && (
                        <span className="font-semibold text-xs text-muted-foreground">
                          (+{partner?.contacts?.length - 1})
                        </span>
                      )}
                    </div>
                    {partner?.contacts?.[0]?.email && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />{" "}
                        {partner?.contacts?.[0]?.email}
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
                      <DropdownMenuItem onClick={() => onOpenDetails(partner)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onOpenDetails(partner)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSetDisable(partner)}>
                        {!partner?.disabled ? (
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
                          onDelete(partner);
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
