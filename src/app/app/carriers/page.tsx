"use client";

import { useMutation } from "@tanstack/react-query";
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import DeleteConfirmationDialog from "@/core/components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import useDialog from "@/core/hooks/useDialog";
import { useAuth } from "@/modules/auth/lib/auth";
import { UserRoles } from "@/modules/auth/setup/auth";
import useCarriers from "@/modules/providers/hooks/useCarriers";
import {
  createCarrier,
  deleteCarrier,
  getCarrierTypeName,
  updateCarrier,
} from "@/modules/providers/lib/carriers";
import {
  type Carrier,
  type CarrierCreate,
  type CarrierType,
  CarrierTypes,
  type CarrierUpdate,
} from "@/modules/providers/types/carriers.types";

export default function CarriersPage() {
  /**
   * - - - Auth
   */
  const { user } = useAuth();
  const userRole = user?.role;

  /**
   * - - - Carriers fetching
   */

  const {
    carriers,
    query: carriersQuery,
    isError: carriersIsError,
    error: carriersError,
  } = useCarriers();

  const loadCarriers = async () => {
    await carriersQuery.refetch();
  };

  /**
   * - - - Search and filters logic
   */
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCarriers = carriers.filter((carrier) =>
    carrier.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .includes(
        searchTerm
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      )
  );

  /**
   * - - - - Selected carrier logic (for both details and edit)
   */

  const [currentCarrier, setCurrentCarrier] = useState<Carrier | null>(null);

  /**
   * - - -  Currier details
   */

  const carrierDetailsDialogData = useDialog();

  const openDetailsDialog = (carrier: Carrier) => {
    setCurrentCarrier(carrier);

    carrierDetailsDialogData.open();
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

  // Data for new carrier on form in dialog
  const [newCarrierData, setNewCarrierData] = useState<CarrierCreate>({
    name: "",
    type: CarrierTypes.SHIPPING_LINE,
    contactEmail: null,
    contactName: null,
    contactPhone: null,
  });

  const resetNewCarrierData = () => {
    setNewCarrierData({
      name: "",
      type: CarrierTypes.SHIPPING_LINE,
      contactEmail: null,
      contactName: null,
      contactPhone: null,
    });
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

    const newCarrierType = (newCarrierData?.type as CarrierType) || null;

    if (!newCarrierType) {
      toast("Carrier type is required");
      return;
    }

    const newCarrier = await createCarrierMutation.mutateAsync({
      name: newCarrierName,
      type: newCarrierType,
      contactEmail: newCarrierData?.contactEmail || null,
      contactName: newCarrierData?.contactName || null,
      contactPhone: newCarrierData?.contactPhone || null,
    });

    console.log("newCarrier", newCarrier);

    toast("The carrier has been created successfully.");

    resetNewCarrierData();
    setIsNewCarrierOpen(false);
    await loadCarriers();
  };

  /**
   * - - --  Carrier update logic
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

    const editCarrierType = editCarrierData?.type;

    if (!editCarrierName) {
      toast("Carrier name is required");
      return;
    }

    if (!editCarrierType) {
      toast("Carrier type is required");
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
        type: editCarrierData?.type,
        contactEmail: editCarrierData?.contactEmail || null,
        contactName: editCarrierData?.contactName || null,
        contactPhone: editCarrierData?.contactPhone || null,
      },
    });

    toast(`The carrier ${updatedCarrier?.name} has been updated successfully.`);

    setIsEditCarrierOpen(false);
    await loadCarriers();
  };

  const openEditDialog = (carrier: Carrier) => {
    setCurrentCarrier(carrier);
    setEditCarrierData({
      name: carrier?.name,
      type: carrier?.type,
      contactEmail: carrier?.contactEmail,
      contactName: carrier?.contactName,
      contactPhone: carrier?.contactPhone,
    });

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
      await loadCarriers();
    } else {
      toast("Failed to delete the carrier.");
    }
  };

  const getCarrierTypeStyles = (type: string) => {
    switch (type) {
      case CarrierTypes.AIRLINE:
        return "bg-blue-100 text-blue-800";
      case CarrierTypes.SHIPPING_LINE:
        return "bg-purple-100 text-purple-800";
      case CarrierTypes.ROAD_FREIGHT_COMPANY:
        return "bg-yellow-100 text-yellow-800";
      case CarrierTypes.RAILWAY_COMPANY:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Carriers</h1>
          <p className="text-muted-foreground">Manage your carriers</p>
        </div>

        <Dialog open={isNewCarrierOpen} onOpenChange={setIsNewCarrierOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Carrier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Carrier</DialogTitle>
              <DialogDescription>
                Add a new carrier to your system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Carrier name <span className="text-red-600">*</span>
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
                <Label htmlFor="new-type">
                  Carrier type <span className="text-red-600">*</span>
                </Label>

                <Select
                  value={newCarrierData?.type || ""}
                  onValueChange={(value) =>
                    updateNewCarrierData({ type: value as CarrierType })
                  }
                >
                  <SelectTrigger id="new-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CarrierTypes).map((carrType) => (
                      <SelectItem key={carrType} value={carrType}>
                        {getCarrierTypeName(carrType)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Contact */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact name</Label>
                  <Input
                    id="contactName"
                    value={newCarrierData?.contactName || ""}
                    onChange={(e) =>
                      updateNewCarrierData({ contactName: e.target.value })
                    }
                    placeholder="Teresa Torres"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact phone</Label>
                  <Input
                    id="contactPhone"
                    value={newCarrierData?.contactPhone || ""}
                    onChange={(e) =>
                      updateNewCarrierData({ contactPhone: e.target.value })
                    }
                    placeholder="+12 456 78 90"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact email</Label>
                <Input
                  id="contactEmail"
                  value={newCarrierData?.contactEmail || ""}
                  onChange={(e) =>
                    updateNewCarrierData({ contactEmail: e.target.value })
                  }
                  placeholder="carrier@email.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewCarrierOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCarrier}
                disabled={createCarrierMutation.isPending}
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
            placeholder="Search carriers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md w-full lg:max-w-full max-w-[90vw]">
        <Table className="w-full overflow-x-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carriersQuery.isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : carriersIsError ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  Unable to get carriers (Details:{" "}
                  {String(carriersError || "unknown")})
                </TableCell>
              </TableRow>
            ) : filteredCarriers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  No carriers found
                </TableCell>
              </TableRow>
            ) : (
              filteredCarriers.map((carrier) => (
                <TableRow key={carrier.carrierId}>
                  <TableCell
                    className="font-medium"
                    onClick={() => openDetailsDialog(carrier)}
                  >
                    {carrier?.name || "-"}
                  </TableCell>
                  <TableCell onClick={() => openDetailsDialog(carrier)}>
                    <Badge className={getCarrierTypeStyles(carrier?.type)}>
                      {getCarrierTypeName(carrier?.type || "") || "undefined"}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className=""
                    onClick={() => openDetailsDialog(carrier)}
                  >
                    {carrier?.contactName || "-"}
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
                        <DropdownMenuItem
                          onClick={() => openDetailsDialog(carrier)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(carrier)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentCarrier(carrier);
                            openDeleteConfirmationDialog();
                          }}
                          disabled={userRole !== UserRoles.ADMIN}
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

      {/* Details modal */}
      <Dialog
        open={carrierDetailsDialogData.isOpen}
        onOpenChange={carrierDetailsDialogData.setIsOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Carrier details</DialogTitle>
            <DialogDescription className="text-xs">
              View carrier information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Carrier name</Label>
              <div>{currentCarrier?.name || "-"}</div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>

              <Badge
                className={getCarrierTypeStyles(currentCarrier?.type || "")}
              >
                {getCarrierTypeName(currentCarrier?.type as CarrierType) ||
                  "undefined"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact name</Label>
                <div>{currentCarrier?.contactName || "-"}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact phone</Label>
                <div>{currentCarrier?.contactPhone || "-"}</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact email</Label>
              <div>{currentCarrier?.contactEmail || "-"}</div>
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
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                if (!currentCarrier) {
                  console.error(
                    "No selected carrier found. Unable to open edit dialog after details dialog"
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

      {/* Edit Carrier Dialog */}
      <Dialog open={isEditCarrierOpen} onOpenChange={setIsEditCarrierOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Carrier</DialogTitle>
            <DialogDescription>Update carrier information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Carrier name <span className="text-red-600">*</span>
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
              <Label htmlFor="new-type">
                Carrier type <span className="text-red-600">*</span>
              </Label>

              <Select
                value={editCarrierData?.type || ""}
                onValueChange={(value) =>
                  updateEditCarrierData({ type: value as CarrierType })
                }
              >
                <SelectTrigger id="new-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CarrierTypes).map((carrType) => (
                    <SelectItem key={carrType} value={carrType}>
                      {getCarrierTypeName(carrType)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Contact */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact name</Label>
                <Input
                  id="contactName"
                  value={editCarrierData?.contactName || ""}
                  onChange={(e) =>
                    updateEditCarrierData({ contactName: e.target.value })
                  }
                  placeholder="Teresa Torres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact phone</Label>
                <Input
                  id="contactPhone"
                  value={editCarrierData?.contactPhone || ""}
                  onChange={(e) =>
                    updateEditCarrierData({ contactPhone: e.target.value })
                  }
                  placeholder="+12 456 78 90"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input
                id="contactEmail"
                value={editCarrierData?.contactEmail || ""}
                onChange={(e) =>
                  updateEditCarrierData({ contactEmail: e.target.value })
                }
                placeholder="carrier@email.com"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditCarrierOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={
                updateCarrierMutation.isPending || userRole !== UserRoles.ADMIN
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

      <DeleteConfirmationDialog
        DialogProps={{
          open: isDeleteCarrierOpen,
          onOpenChange: setIsDeleteCarrierOpen,
        }}
        title={"Carrier delete"}
        description={"Delete carrier information"}
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
