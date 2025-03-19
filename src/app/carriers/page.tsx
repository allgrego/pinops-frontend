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
import { Textarea } from "@/core/components/ui/textarea";
import { addComment } from "@/core/lib/data";
import {
  createCarrier,
  deleteCarrier,
  getAllCarriers,
  getCarrierTypeName,
  updateCarrier,
} from "@/modules/providers/lib/carriers";
import {
  Carrier,
  CarrierCreate,
  CarrierType,
  CarrierTypes,
  CarrierUpdate,
} from "@/modules/providers/types/carriers.types";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CarriersPage() {
  /**
   * - - - Carriers fetching
   */
  const carriersQuery = useQuery<Carrier[]>({
    queryKey: ["carriersQuery"],
    queryFn: async () => {
      try {
        return await getAllCarriers();
      } catch (error) {
        console.error("Failure fetching carriers", error);
        return Promise.reject(`${error}`);
      }
    },
  });

  const carriers = carriersQuery.data || [];

  /**
   * - - --  Carrier create
   */
  const createCarrierMutation = useMutation<Carrier, Error, CarrierCreate>({
    mutationKey: ["createCarrierMutation"],
    mutationFn: async (newData) => await createCarrier(newData),
    onError(error) {
      toast(`Failure creating carrier. ${error}`);
    },
  });

  /**
   * - - --  Carrier update
   */
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

  /**
   * - - --  Client delete
   */
  const deleteCarrierMutation = useMutation<boolean, Error, string>({
    mutationKey: ["deleteCarrierMutation"],
    mutationFn: async (carrierId) => await deleteCarrier(carrierId),
    onError(error) {
      toast(`Failure deleting carrier. ${error}`);
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isNewCarrierOpen, setIsNewCarrierOpen] = useState(false);
  const [isEditCarrierOpen, setIsEditCarrierOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [currentCarrier, setCurrentCarrier] = useState<Carrier | null>(null);
  const [newCarrierName, setNewCarrierName] = useState("");
  const [newCarrierType, setNewCarrierType] = useState("");
  const [editCarrierName, setEditCarrierName] = useState("");
  const [editCarrierType, setEditCarrierType] = useState("");
  const [comment, setComment] = useState("");

  const loadCarriers = async () => {
    await carriersQuery.refetch();
  };

  const handleCreateCarrier = async () => {
    if (!newCarrierName.trim()) return;

    const newCarrier = await createCarrierMutation.mutateAsync({
      name: newCarrierName,
      type: newCarrierType as CarrierType,
    });

    console.log("newCarrier", newCarrier);

    toast("The carrier has been created successfully.");

    setNewCarrierName("");
    setNewCarrierType("");
    setIsNewCarrierOpen(false);

    await loadCarriers();
  };

  const handleEditCarrier = async () => {
    if (!currentCarrier || !editCarrierName.trim()) return;

    await updateCarrierMutation.mutateAsync({
      carrierId: currentCarrier.carrier_id,
      data: {
        name: editCarrierName,
        type: editCarrierType as CarrierType,
      },
    });

    toast("The carrier has been updated successfully.");

    setIsEditCarrierOpen(false);
    await loadCarriers();
  };

  const handleDeleteCarrier = async (id: string) => {
    const success = await deleteCarrierMutation.mutateAsync(id);
    if (success) {
      toast("The carrier has been deleted successfully.");
      await loadCarriers();
    } else {
      toast("Failed to delete the carrier.");
    }
  };

  const handleAddComment = () => {
    if (!currentCarrier || !comment.trim()) return;

    const newComment = addComment(
      "carrier",
      currentCarrier.carrier_id,
      comment
    );
    if (newComment) {
      toast("Your comment has been added successfully.");
      setComment("");
      setIsCommentOpen(false);
      loadCarriers();
    } else {
      toast("Failed to add comment.");
    }
  };

  const openEditDialog = (carrier: Carrier) => {
    setCurrentCarrier(carrier);
    setEditCarrierName(carrier.name);
    setEditCarrierType(carrier.type);
    setIsEditCarrierOpen(true);
  };

  const filteredCarriers = carriers.filter((carrier) =>
    carrier.name
      .normalize("NFD")
      .toLowerCase()
      .includes(searchTerm.normalize("NFD").toLowerCase())
  );

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
                <Label htmlFor="name">Carrier Name</Label>
                <Input
                  id="name"
                  value={newCarrierName}
                  onChange={(e) => setNewCarrierName(e.target.value)}
                  placeholder="Enter carrier name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-type">Carrier type</Label>

                <Select
                  value={newCarrierType}
                  onValueChange={(value) => setNewCarrierType(value)}
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
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewCarrierOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateCarrier}>Create</Button>
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

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCarriers.length === 0 ? (
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
                <TableRow key={carrier.carrier_id}>
                  <TableCell className="font-medium">{carrier.name}</TableCell>
                  <TableCell>{getCarrierTypeName(carrier.type)}</TableCell>
                  <TableCell className="text-xs">{carrier.carrier_id}</TableCell>
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
                          onClick={() => openEditDialog(carrier)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem
                          onClick={() => openCommentDialog(carrier)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Add Comment
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteCarrier(carrier.carrier_id)
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

      {/* Edit Carrier Dialog */}
      <Dialog open={isEditCarrierOpen} onOpenChange={setIsEditCarrierOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Carrier</DialogTitle>
            <DialogDescription>Update carrier information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Carrier Name</Label>
              <Input
                id="edit-name"
                value={editCarrierName}
                onChange={(e) => setEditCarrierName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">Carrier type</Label>

              <Select
                value={editCarrierType}
                onValueChange={(value) => setEditCarrierType(value)}
              >
                <SelectTrigger id="edit-type">
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

            {/* {currentCarrier?.comments && currentCarrier.comments.length > 0 && (
              <div className="space-y-2">
                <Label>Comments</Label>
                <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                  {currentCarrier.comments.map((comment) => (
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
              onClick={() => setIsEditCarrierOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditCarrier}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Comment Dialog */}
      <Dialog open={isCommentOpen} onOpenChange={setIsCommentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Add a comment to {currentCarrier?.name}.
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
            {/* {currentCarrier?.comments && currentCarrier.comments.length > 0 && (
              <div className="space-y-2">
                <Label>Previous Comments</Label>
                <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                  {currentCarrier.comments.map((comment) => (
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
