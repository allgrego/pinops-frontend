"use client";

import { useMutation } from "@tanstack/react-query";
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import DeleteConfirmationDialog from "@/core/components/DeleteConfirmationDialog/DeleteConfirmationDialog";
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
import {
  createClient,
  deleteClient,
  updateClient,
} from "@/modules/clients/lib/clients";
import {
  Client,
  ClientCreate,
  ClientUpdate,
} from "@/modules/clients/types/clients";
import useClients from "@/modules/hooks/useClients";

export default function ClientsPage() {
  /**
   * - - - Auth
   */
  const { user } = useAuth();
  const userRole = user?.role;

  /**
   * - - - Clients fetching
   */
  const {
    clients,
    query: clientsQuery,
    isError: clientsIsError,
    error: clientsError,
  } = useClients();

  const loadClients = async () => {
    await clientsQuery.refetch();
  };

  /**
   * - - - Search and filters logic
   */
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter((client) =>
    client.name
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
   * - - - - Selected client logic (for both details and edit)
   */
  const [currentClient, setCurrentClient] = useState<Client | null>(null);

  /**
   * - - -  Client details
   */
  const clientDetailsDialogData = useDialog();

  const openDetailsDialog = (client: Client) => {
    setCurrentClient(client);

    clientDetailsDialogData.open();
  };

  /**
   * - - --  Client create logic
   */

  // Mutation
  const createClientMutation = useMutation<Client, Error, ClientCreate>({
    mutationKey: ["createClientMutation"],
    mutationFn: async (newData) => await createClient(newData),
    onError(error) {
      toast(`Failure creating client. ${error}`);
    },
  });

  const { isOpen: isNewClientOpen, setIsOpen: setIsNewClientOpen } =
    useDialog();

  // Data for new client on form in dialog
  const [newClientData, setNewClientData] = useState<ClientCreate>({
    name: "",
    contactEmail: null,
    contactName: null,
    contactPhone: null,
    taxId: null,
  });

  const resetNewClientData = () => {
    setNewClientData({
      name: "",
      contactEmail: null,
      contactName: null,
      contactPhone: null,
      taxId: null,
    });
  };

  const updateNewClientData = (newData: Partial<ClientCreate>) => {
    setNewClientData((c) => ({
      ...c,
      ...newData,
    }));
  };

  const handleCreateClient = async () => {
    // TODO Validate all data
    const newClientName = String(newClientData?.name || "").trim();

    if (!newClientName) {
      toast("Client name is required");
      return;
    }

    const newClient = await createClientMutation.mutateAsync({
      name: newClientName,
      taxId: newClientData?.taxId || null,
      contactEmail: newClientData?.contactEmail || null,
      contactName: newClientData?.contactName || null,
      contactPhone: newClientData?.contactPhone || null,
    });

    console.log("new Client", newClient);
    toast("The client has been created successfully.");

    resetNewClientData();
    setIsNewClientOpen(false);
    await loadClients();
  };

  /**
   * - - --  Client update logic
   */

  // Mutation
  const updateClientMutation = useMutation<
    Client,
    Error,
    { clientId: string; data: ClientUpdate }
  >({
    mutationKey: ["updateClientMutation"],
    mutationFn: async ({ clientId, data }) =>
      await updateClient(clientId, data),
    onError(error) {
      toast(`Failure updating client. ${error}`);
    },
  });

  const { isOpen: isEditClientOpen, setIsOpen: setIsEditClientOpen } =
    useDialog();

  const [editClientData, setEditClientData] = useState<ClientUpdate>({
    name: "",
  });

  const updateEditClientData = (editData: ClientUpdate) => {
    setEditClientData((c) => ({
      ...c,
      ...editData,
    }));
  };

  const handleEditClient = async () => {
    // TODO validate data
    const editClientName = editClientData?.name?.trim();

    if (!editClientName) {
      toast("Client name is required");
      return;
    }

    if (!currentClient) {
      toast("Unable to get client data");
      return;
    }

    const updatedClient = await updateClientMutation.mutateAsync({
      clientId: currentClient.clientId,
      data: {
        name: editClientName,
        taxId: editClientData?.taxId || null,
        contactEmail: editClientData?.contactEmail || null,
        contactName: editClientData?.contactName || null,
        contactPhone: editClientData?.contactPhone || null,
      },
    });

    toast(`The client ${updatedClient?.name} has been updated successfully.`);

    setIsEditClientOpen(false);
    await loadClients();
  };

  const openEditDialog = (client: Client) => {
    setCurrentClient(client);
    setEditClientData({
      name: client?.name,
      taxId: client?.taxId,
      contactEmail: client?.contactEmail,
      contactName: client?.contactName,
      contactPhone: client?.contactPhone,
    });

    setIsEditClientOpen(true);
  };

  /**
   *  - - - - Delete client logic
   */

  // Mutation
  const deleteClientMutation = useMutation<boolean, Error, string>({
    mutationKey: ["deleteClientMutation"],
    mutationFn: async (clientId) => await deleteClient(clientId),
    onError(error) {
      toast(`Failure deleting client. ${error}`);
    },
  });

  const { isOpen: isDeleteClientOpen, setIsOpen: setIsDeleteClientOpen } =
    useDialog();

  const [deleteConfirmationText, setDeleteConfirmationText] =
    useState<string>("");

  const openDeleteConfirmationDialog = () => {
    setDeleteConfirmationText("");
    setIsDeleteClientOpen(true);
  };

  const handleDeleteClient = async (id: string) => {
    if (!id) {
      toast("Unable to delete client. No ID found");
      return;
    }

    const success = await deleteClientMutation.mutateAsync(id);

    if (success) {
      // Close modal
      setIsDeleteClientOpen(false);
      toast("The client has been deleted successfully.");
      await loadClients();
    } else {
      toast("Failed to delete the client.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your clients</p>
        </div>
        {/* Create client modal */}
        <Dialog open={isNewClientOpen} onOpenChange={setIsNewClientOpen}>
          <DialogTrigger asChild>
            {/* Create client button */}
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Client
            </Button>
          </DialogTrigger>
          {/* Actual Dialog */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Client</DialogTitle>
              <DialogDescription>
                Add a new client to your system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Client name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="name"
                  value={newClientData?.name || ""}
                  onChange={(e) =>
                    updateNewClientData({ name: e.target.value })
                  }
                  placeholder="The Client LLC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  value={newClientData?.taxId || ""}
                  onChange={(e) =>
                    updateNewClientData({ taxId: e.target.value })
                  }
                  placeholder="Enter tax ID"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact name</Label>
                  <Input
                    id="contactName"
                    value={newClientData?.contactName || ""}
                    onChange={(e) =>
                      updateNewClientData({ contactName: e.target.value })
                    }
                    placeholder="Teresa Torres"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact phone</Label>
                  <Input
                    id="contactPhone"
                    value={newClientData?.contactPhone || ""}
                    onChange={(e) =>
                      updateNewClientData({ contactPhone: e.target.value })
                    }
                    placeholder="+12 456 78 90"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact email</Label>
                <Input
                  id="contactEmail"
                  value={newClientData?.contactEmail || ""}
                  onChange={(e) =>
                    updateNewClientData({ contactEmail: e.target.value })
                  }
                  placeholder="client@email.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewClientOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateClient}
                disabled={createClientMutation.isPending}
                loading={createClientMutation.isPending}
              >
                {createClientMutation.isPending ? "Creating..." : "Create"}
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
            placeholder="Search clients..."
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
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientsQuery.isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : clientsIsError ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  Unable to get clients (Details:{" "}
                  {String(clientsError || "unknown")})
                </TableCell>
              </TableRow>
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.clientId}>
                  <TableCell
                    className="font-medium"
                    onClick={() => openDetailsDialog(client)}
                  >
                    {client.name || "-"}
                  </TableCell>
                  <TableCell
                    className=""
                    onClick={() => openDetailsDialog(client)}
                  >
                    {client?.contactName || "-"}
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
                          onClick={() => openDetailsDialog(client)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(client)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem
                          onClick={() => openCommentDialog(client)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Add Comment
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          // onClick={() => handleDeleteClient(client.clientId)}
                          onClick={() => {
                            setCurrentClient(client);
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
        open={clientDetailsDialogData.isOpen}
        onOpenChange={clientDetailsDialogData.setIsOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Client details</DialogTitle>
            <DialogDescription className="text-xs">
              View client information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Client name</Label>
              <div>{currentClient?.name || "-"}</div>
            </div>
            <div className="space-y-2">
              <Label>Tax ID</Label>
              <div>{currentClient?.taxId || "-"}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact name</Label>
                <div>{currentClient?.contactName || "-"}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact phone</Label>
                <div>{currentClient?.contactPhone || "-"}</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact email</Label>
              <div>{currentClient?.contactEmail || "-"}</div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-xs mt-6">
              <div className="space-y-2">
                <Label>Internal ID</Label>
                <div className="whitespace-nowrap">
                  {currentClient?.clientId || "-"}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Created at</Label>
                <div className="whitespace-nowrap">
                  {currentClient?.createdAt || "-"}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                if (!currentClient) {
                  console.error(
                    "No selected client found. Unable to open edit dialog after details dialog"
                  );
                  return;
                }

                // close details dialog
                clientDetailsDialogData.close();

                openEditDialog(currentClient);
              }}
            >
              Edit
            </Button>
            <Button variant="outline" onClick={clientDetailsDialogData.close}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update client information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Client name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="name"
                value={editClientData?.name || ""}
                onChange={(e) =>
                  updateEditClientData({ name: e.target.value || undefined })
                }
                placeholder="The Client LLC"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={editClientData?.taxId || ""}
                onChange={(e) =>
                  updateEditClientData({ taxId: e.target.value })
                }
                placeholder="Enter tax ID"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact name</Label>
                <Input
                  id="contactName"
                  value={editClientData?.contactName || ""}
                  onChange={(e) =>
                    updateEditClientData({ contactName: e.target.value })
                  }
                  placeholder="Teresa Torres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact phone</Label>
                <Input
                  id="contactPhone"
                  value={editClientData?.contactPhone || ""}
                  onChange={(e) =>
                    updateEditClientData({ contactPhone: e.target.value })
                  }
                  placeholder="+12 456 78 90"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input
                id="contactEmail"
                value={editClientData?.contactEmail || ""}
                onChange={(e) =>
                  updateEditClientData({ contactEmail: e.target.value })
                }
                placeholder="client@email.com"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditClientOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={
                updateClientMutation.isPending || userRole !== UserRoles.ADMIN
              }
              onClick={() => {
                setIsEditClientOpen(false);
                openDeleteConfirmationDialog();
              }}
            >
              Delete
            </Button>
            <Button
              onClick={handleEditClient}
              disabled={updateClientMutation.isPending}
              loading={updateClientMutation.isPending}
            >
              {updateClientMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete client confirmation dialog */}
      <DeleteConfirmationDialog
        DialogProps={{
          open: isDeleteClientOpen,
          onOpenChange: setIsDeleteClientOpen,
        }}
        title={"Client delete"}
        description={"Delete client information"}
        body={
          <div className="">
            You are about to delete the client{" "}
            <span className="font-semibold underline">
              {currentClient?.name}
            </span>{" "}
            and all their associated data permanently, including operations.
            This cannot be undone.
          </div>
        }
        confirmationText={deleteConfirmationText}
        updateConfirmationText={(val) => setDeleteConfirmationText(val)}
        onDelete={() => {
          handleDeleteClient(currentClient?.clientId || "");
        }}
        onCancel={() => setIsDeleteClientOpen(false)}
        isDeleting={deleteClientMutation.isPending}
      />
    </div>
  );
}
