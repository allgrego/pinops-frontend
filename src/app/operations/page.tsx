"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import DeleteConfirmationDialog from "@/core/components/DeleteConfirmationDialog/DeleteConfirmationDialog";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { Input } from "@/core/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import useDialog from "@/core/hooks/useDialog";
import {
  deleteOpsFile,
  getAllOpsFiles,
  getOpsTypeIcon,
  getOpsTypeName,
} from "@/modules/ops_files/lib/ops_files";
import {
  OperationStatuses,
  OpsFile,
} from "@/modules/ops_files/types/ops_files.types";

export default function OperationsPage() {
  /**
   * - - - Ops files fetching
   */
  const opsFilesQuery = useQuery<OpsFile[]>({
    queryKey: ["OpsFilesQuery"],
    queryFn: async () => {
      try {
        return await getAllOpsFiles();
      } catch (error) {
        console.error("Failure fetching ops files", error);
        return Promise.reject(`${error}`);
      }
    },
  });

  const opsFiles = opsFilesQuery.data || [];

  const loadOpsFiles = async () => {
    await opsFilesQuery.refetch();
  };

  /**
   * - - - Search and filters logic
   */
  const [searchTerm, setSearchTerm] = useState("");

  // TODO: improve search by multiple properties
  const filteredOpsFiles = opsFiles.filter((opFile) =>
    opFile.client.name
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

  // const filteredOpsFiles = operations.filter(
  //   (op) =>
  //     op.cargo_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     op.origin_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     op.destination_location
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase()) ||
  //     op.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     op.master_transport_doc?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  /**
   * - - - - Selected client logic (for both details and edit)
   */
  const [currentOpsFile, setCurrentOpsFile] = useState<OpsFile | null>(null);

  /**
   *  - - - - Delete Ops file logic
   */

  // Mutation
  const deleteOpsFileMutation = useMutation<boolean, Error, string>({
    mutationKey: ["DeleteOpsFileMutation"],
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
      await loadOpsFiles();
    } else {
      toast("Failed to delete the operation.");
    }
  };

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case OperationStatuses.OPENED:
        return "bg-blue-100 text-blue-800";
      case OperationStatuses.IN_TRANSIT:
        return "bg-yellow-100 text-yellow-800";
      case OperationStatuses.ON_DESTINATION:
        return "bg-green-100 text-green-800";
      case OperationStatuses.IN_WAREHOUSE:
        return "bg-purple-100 text-purple-800";
      case OperationStatuses.PREALERTED:
        return "bg-gray-100 text-gray-800";
      case OperationStatuses.CLOSED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operations</h1>
          <p className="text-muted-foreground">
            Manage your international trade operations
          </p>
        </div>
        <Button asChild>
          <Link href="/operations/new">
            <Plus className="mr-2 h-4 w-4" />
            New Operation
          </Link>
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search operations..."
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
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opsFilesQuery.isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-4 text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredOpsFiles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-4 text-muted-foreground"
                >
                  No operations found
                </TableCell>
              </TableRow>
            ) : (
              filteredOpsFiles.map((operation) => (
                <TableRow key={operation.opsFileId} className="text-xs">
                  <TableCell className="">
                    {operation?.opsFileId?.substring(0, 8)?.toUpperCase()}
                  </TableCell>

                  <TableCell className="">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {getOpsTypeIcon(operation?.opType || "")}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {getOpsTypeName(operation?.opType || "")}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    {operation.originLocation}, {operation.originCountry}
                  </TableCell>
                  <TableCell>
                    {operation.destinationLocation},{" "}
                    {operation.destinationCountry}
                  </TableCell>
                  <TableCell>{operation.cargoDescription}</TableCell>
                  <TableCell>{operation.client.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(operation.status.statusId)}
                    >
                      {operation.status.statusName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {operation?.estimatedTimeArrival || "-"}
                    {/* {operation.estimatedTimeArrival
                      ? new Date(
                          operation.estimatedTimeArrival
                        ).toLocaleDateString()
                      : "N/A"} */}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/operations/${operation.opsFileId}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/operations/${operation.opsFileId}/edit`}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentOpsFile(operation);
                            openDeleteConfirmationDialog();
                          }}
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
              You are about to delete the operation of client{" "}
              <span className="font-semibold underline">
                {currentOpsFile?.client?.name}
              </span>
              . This cannot be undone.
            </div>
            <div className="mt-4">
              <span className="text-xs font-light">
                Operation ID: {currentOpsFile?.opsFileId}
              </span>
            </div>
          </div>
        }
        confirmationText={deleteConfirmationText}
        updateConfirmationText={(val) => setDeleteConfirmationText(val)}
        onDelete={() => {
          handleDeleteOpsFile(currentOpsFile?.opsFileId || "");
        }}
        onCancel={() => setIsDeleteOpsFileOpen(false)}
        isDeleting={deleteOpsFileMutation.isPending}
      />
    </div>
  );
}
