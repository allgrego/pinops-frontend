"use client";

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
import { Textarea } from "@/core/components/ui/textarea";
import { addComment } from "@/core/lib/data";
import {
  createClient,
  deleteClient,
  getAllClients,
  updateClient,
} from "@/modules/clients/lib/clients";
import {
  Client,
  ClientCreate,
  ClientUpdate,
} from "@/modules/clients/types/clients";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Edit,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ClientsPage() {
  /**
   * - - - Clients fetching
   */
  const clientsQuery = useQuery<Client[]>({
    queryKey: ["ClientsQuery"],
    queryFn: async () => {
      try {
        return await getAllClients();
      } catch (error) {
        console.error("Failure fetching clients", error);
        return Promise.reject(`${error}`);
      }
    },
  });

  const clients = clientsQuery.data || [];

  /**
   * - - --  Client create
   */
  const createClientMutation = useMutation<Client, Error, ClientCreate>({
    mutationKey: ["createClientMutation"],
    mutationFn: async (newData) => await createClient(newData),
    onError(error) {
      toast(`Failure creating client. ${error}`);
    },
  });

  /**
   * - - --  Client update
   */
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

  /**
   * - - --  Client delete
   */
  const deleteClientMutation = useMutation<boolean, Error, string>({
    mutationKey: ["deleteClientMutation"],
    mutationFn: async (clientId) => await deleteClient(clientId),
    onError(error) {
      toast(`Failure deleting client. ${error}`);
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [newClientName, setNewClientName] = useState("");
  const [editClientName, setEditClientName] = useState("");
  const [comment, setComment] = useState("");

  const loadClients = async () => {
    await clientsQuery.refetch();
  };

  const handleCreateClient = async () => {
    if (!newClientName.trim()) return;

    const newClient = await createClientMutation.mutateAsync({
      name: newClientName,
    });

    console.log("new Client", newClient);
    toast("The client has been created successfully.");

    setNewClientName("");
    setIsNewClientOpen(false);
    await loadClients();
  };

  const handleEditClient = async () => {
    if (!currentClient || !editClientName.trim()) return;

    const updatedClient = await updateClientMutation.mutateAsync({
      clientId: currentClient.client_id,
      data: {
        name: editClientName,
      },
    });

    toast(`The client ${updatedClient?.name} has been updated successfully.`);

    setIsEditClientOpen(false);
    await loadClients();
  };

  const handleDeleteClient = async (id: string) => {
    const success = await deleteClientMutation.mutateAsync(id);
    if (success) {
      toast("The client has been deleted successfully.");
      await loadClients();
    } else {
      toast("Failed to delete the client.");
    }
  };

  const handleAddComment = () => {
    if (!currentClient || !comment.trim()) return;

    const newComment = addComment("client", currentClient.client_id, comment);
    if (newComment) {
      toast("Your comment has been added successfully.");
      setComment("");
      setIsCommentOpen(false);
      loadClients();
    } else {
      toast("Failed to add comment.");
    }
  };

  const openEditDialog = (client: Client) => {
    setCurrentClient(client);
    setEditClientName(client.name);
    setIsEditClientOpen(true);
  };

  const openCommentDialog = (client: Client) => {
    setCurrentClient(client);
    setIsCommentOpen(true);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your clients</p>
        </div>
        <Dialog open={isNewClientOpen} onOpenChange={setIsNewClientOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Client</DialogTitle>
              <DialogDescription>
                Add a new client to your system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Client Name</Label>
                <Input
                  id="name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Enter client name"
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
              <Button onClick={handleCreateClient}>Create</Button>
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

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>ID</TableHead>
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
                <TableRow key={client.client_id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="text-xs">{client.client_id}</TableCell>
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
                          onClick={() => openEditDialog(client)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openCommentDialog(client)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Add Comment
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClient(client.client_id)}
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

      {/* Edit Client Dialog */}
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update client information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Client Name</Label>
              <Input
                id="edit-name"
                value={editClientName}
                onChange={(e) => setEditClientName(e.target.value)}
              />
            </div>
            {/* {currentClient?.comments && currentClient.comments.length > 0 && (
              <div className="space-y-2">
                <Label>Comments</Label>
                <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                  {currentClient.comments.map((comment) => (
                    <div key={comment.id} className="text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditClientOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditClient}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Comment Dialog */}
      <Dialog open={isCommentOpen} onOpenChange={setIsCommentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Add a comment to {currentClient?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment"
                rows={4}
              />
            </div>
            {/* {currentClient?.comments && currentClient.comments.length > 0 && (
              <div className="space-y-2">
                <Label>Previous Comments</Label>
                <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                  {currentClient.comments.map((comment) => (
                    <div key={comment.id} className="text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddComment}>Add Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
