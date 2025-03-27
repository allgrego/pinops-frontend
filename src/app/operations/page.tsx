"use client";

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
  deleteOperation,
  getOperations,
  type TradeOperation,
} from "@/core/lib/data";
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OperationsPage() {
  const [operations, setOperations] = useState<TradeOperation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadOperations();
  }, []);

  const loadOperations = () => {
    const ops = getOperations();
    setOperations(ops);
  };

  const handleDelete = (id: string) => {
    const success = deleteOperation(id);
    if (success) {
      toast(
        // title: "Operation deleted",
        "The operation has been deleted successfully."
      );
      loadOperations();
    } else {
      toast(
        // title: "Error",
        "Failed to delete the operation."
        // variant: "destructive",
      );
    }
  };

  const filteredOperations = operations.filter(
    (op) =>
      op.cargo_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.origin_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.destination_location
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      op.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.master_transport_doc?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (statusName: string) => {
    switch (statusName) {
      case "Opened":
        return "bg-blue-100 text-blue-800";
      case "In Transit":
        return "bg-yellow-100 text-yellow-800";
      case "Arrived":
        return "bg-green-100 text-green-800";
      case "Delivered":
        return "bg-purple-100 text-purple-800";
      case "Closed":
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
            {filteredOperations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No operations found
                </TableCell>
              </TableRow>
            ) : (
              filteredOperations.map((operation) => (
                <TableRow key={operation.op_id}>
                  <TableCell>
                    {operation.origin_location}, {operation.origin_country}
                  </TableCell>
                  <TableCell>
                    {operation.destination_location},{" "}
                    {operation.destination_country}
                  </TableCell>
                  <TableCell>{operation.cargo_description}</TableCell>
                  <TableCell>{operation.client.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(operation.status.status_name)}
                    >
                      {operation.status.status_name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {operation.estimated_time_arrival
                      ? new Date(
                          operation.estimated_time_arrival
                        ).toLocaleDateString()
                      : "N/A"}
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
                          <Link href={`/operations/${operation.op_id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/operations/${operation.op_id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(operation.op_id)}
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
    </div>
  );
}
