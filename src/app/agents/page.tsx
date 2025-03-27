"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
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
import {
  createAgent,
  deleteAgent,
  getAllAgents,
  updateAgent,
} from "@/modules/providers/lib/agents";
import {
  Agent,
  AgentCreate,
  AgentUpdate,
} from "@/modules/providers/types/agents";

export default function AgentsPage() {
  /**
   * - - - Agents fetching
   */
  const agentsQuery = useQuery<Agent[]>({
    queryKey: ["agentsQuery"],
    queryFn: async () => {
      try {
        return await getAllAgents();
      } catch (error) {
        console.error("Failure fetching agents", error);
        return Promise.reject(`${error}`);
      }
    },
  });

  const agents = agentsQuery.data || [];

  const loadAgents = async () => {
    await agentsQuery.refetch();
  };

  /**
   * - - - Search and filters logic
   */

  const [searchTerm, setSearchTerm] = useState("");

  const filteredAgents = agents.filter((agent) =>
    agent.name
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
   * - - - - Selected agent logic (for both details and edit)
   */
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);

  /**
   * - - -  Agent details
   */

  const agentDetailsDialogData = useDialog();

  const openDetailsDialog = (agent: Agent) => {
    setCurrentAgent(agent);

    agentDetailsDialogData.open();
  };

  /**
   * - - --  Agent create logic
   */

  // Mutation
  const createAgentMutation = useMutation<Agent, Error, AgentCreate>({
    mutationKey: ["createAgentMutation"],
    mutationFn: async (newData) => await createAgent(newData),
    onError(error) {
      toast(`Failure creating agent. ${error}`);
    },
  });

  const { isOpen: isNewAgentOpen, setIsOpen: setIsNewAgentOpen } = useDialog();

  // Data for new Agent on form in dialog
  const [newAgentData, setNewAgentData] = useState<AgentCreate>({
    name: "",
    contactEmail: null,
    contactName: null,
    contactPhone: null,
  });

  const resetNewAgentData = () => {
    setNewAgentData({
      name: "",
      contactEmail: null,
      contactName: null,
      contactPhone: null,
    });
  };

  const updateNewAgentData = (newData: Partial<AgentCreate>) => {
    setNewAgentData((c) => ({
      ...c,
      ...newData,
    }));
  };

  const handleCreateAgent = async () => {
    // TODO Validate all data
    const newAgentName = String(newAgentData?.name || "").trim();

    if (!newAgentName) {
      toast("Agent name is required");
      return;
    }

    const newAgent = await createAgentMutation.mutateAsync({
      name: newAgentName,
      contactEmail: newAgentData?.contactEmail || null,
      contactName: newAgentData?.contactName || null,
      contactPhone: newAgentData?.contactPhone || null,
    });

    console.log("newAgent", newAgent);

    toast("The Agent has been created successfully.");

    resetNewAgentData();
    setIsNewAgentOpen(false);
    await loadAgents();
  };

  /**
   * - - --  Agent update
   */

  // Mutation
  const updateAgentMutation = useMutation<
    Agent,
    Error,
    { agentId: string; data: AgentUpdate }
  >({
    mutationKey: ["updateAgentMutation"],
    mutationFn: async ({ agentId, data }) => await updateAgent(agentId, data),
    onError(error) {
      toast(`Failure updating agent. ${error}`);
    },
  });

  const { isOpen: isEditAgentOpen, setIsOpen: setIsEditAgentOpen } =
    useDialog();

  const [editAgentData, setEditAgentData] = useState<AgentUpdate>({
    name: "",
  });

  const updateEditAgentData = (editData: AgentUpdate) => {
    setEditAgentData((c) => ({
      ...c,
      ...editData,
    }));
  };

  const handleEditAgent = async () => {
    // TODO validate data
    const editAgentName = editAgentData?.name?.trim();

    if (!editAgentName) {
      toast("agent name is required");
      return;
    }

    if (!currentAgent) {
      toast("Unable to get agent data");
      return;
    }

    const updatedAgent = await updateAgentMutation.mutateAsync({
      agentId: currentAgent.agentId,
      data: {
        name: editAgentName,
        contactEmail: editAgentData?.contactEmail || null,
        contactName: editAgentData?.contactName || null,
        contactPhone: editAgentData?.contactPhone || null,
      },
    });

    toast(`The agent ${updatedAgent?.name} has been updated successfully.`);

    setIsEditAgentOpen(false);
    await loadAgents();
  };

  const openEditDialog = (agent: Agent) => {
    setCurrentAgent(agent);
    setEditAgentData({
      name: agent?.name,
      contactEmail: agent?.contactEmail,
      contactName: agent?.contactName,
      contactPhone: agent?.contactPhone,
    });

    setIsEditAgentOpen(true);
  };

  /**
   * - - --  Agent delete logic
   */

  // Mutation
  const deleteAgentMutation = useMutation<boolean, Error, string>({
    mutationKey: ["deleteAgentMutation"],
    mutationFn: async (agentId) => await deleteAgent(agentId),
    onError(error) {
      toast(`Failure deleting agent. ${error}`);
    },
  });

  const { isOpen: isDeleteAgentOpen, setIsOpen: setIsDeleteAgentOpen } =
    useDialog();

  const [deleteConfirmationText, setDeleteConfirmationText] =
    useState<string>("");

  const openDeleteConfirmationDialog = () => {
    setDeleteConfirmationText("");
    setIsDeleteAgentOpen(true);
  };

  const handleDeleteAgent = async (id: string) => {
    if (!id) {
      toast("Unable to delete agent. No ID found");
      return;
    }

    const success = await deleteAgentMutation.mutateAsync(id);

    if (success) {
      // Close modal
      setIsDeleteAgentOpen(false);
      toast("The agent has been deleted successfully.");
      await loadAgents();
    } else {
      toast("Failed to delete the agent.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            International agents
          </h1>
          <p className="text-muted-foreground">
            Manage your international agent partners
          </p>
        </div>
        <Dialog open={isNewAgentOpen} onOpenChange={setIsNewAgentOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
              <DialogDescription>
                Add a new agent to your system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  value={newAgentData?.name || ""}
                  onChange={(e) => updateNewAgentData({ name: e.target.value })}
                  placeholder="Enter agent name"
                />
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact name</Label>
                  <Input
                    id="contactName"
                    value={newAgentData?.contactName || ""}
                    onChange={(e) =>
                      updateNewAgentData({ contactName: e.target.value })
                    }
                    placeholder="Teresa Torres"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact phone</Label>
                  <Input
                    id="contactPhone"
                    value={newAgentData?.contactPhone || ""}
                    onChange={(e) =>
                      updateNewAgentData({ contactPhone: e.target.value })
                    }
                    placeholder="+12 456 78 90"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact email</Label>
                <Input
                  id="contactEmail"
                  value={newAgentData?.contactEmail || ""}
                  onChange={(e) =>
                    updateNewAgentData({ contactEmail: e.target.value })
                  }
                  placeholder="agent@email.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewAgentOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={createAgentMutation.isPending}
                onClick={handleCreateAgent}
                loading={createAgentMutation.isPending}
              >
                {createAgentMutation.isPending ? "Creating..." : "Create"}
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
            placeholder="Search agents..."
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
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agentsQuery.isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredAgents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-muted-foreground"
                >
                  No agents found
                </TableCell>
              </TableRow>
            ) : (
              filteredAgents.map((agent) => (
                <TableRow key={agent.agentId}>
                  <TableCell
                    className="font-medium"
                    onClick={() => openDetailsDialog(agent)}
                  >
                    {agent?.name || "-"}
                  </TableCell>
                  <TableCell
                    className=""
                    onClick={() => openDetailsDialog(agent)}
                  >
                    {agent?.contactName || "-"}
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
                          onClick={() => openDetailsDialog(agent)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(agent)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentAgent(agent);
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

      {/* Details modal */}
      <Dialog
        open={agentDetailsDialogData.isOpen}
        onOpenChange={agentDetailsDialogData.setIsOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agent details</DialogTitle>
            <DialogDescription className="text-xs">
              View international agent information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Agent name</Label>
              <div>{currentAgent?.name || "-"}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact name</Label>
                <div>{currentAgent?.contactName || "-"}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact phone</Label>
                <div>{currentAgent?.contactPhone || "-"}</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact email</Label>
              <div>{currentAgent?.contactEmail || "-"}</div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-xs mt-6">
              <div className="space-y-2">
                <Label>Internal ID</Label>
                <div className="whitespace-nowrap">
                  {currentAgent?.agentId || "-"}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Created at</Label>
                <div className="whitespace-nowrap">
                  {currentAgent?.createdAt || "-"}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                if (!currentAgent) {
                  console.error(
                    "No selected agent found. Unable to open edit dialog after details dialog"
                  );
                  return;
                }

                // close details dialog
                agentDetailsDialogData.close();

                openEditDialog(currentAgent);
              }}
            >
              Edit
            </Button>
            <Button variant="outline" onClick={agentDetailsDialogData.close}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Agent Dialog */}
      <Dialog open={isEditAgentOpen} onOpenChange={setIsEditAgentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>Update agent information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                value={editAgentData?.name || ""}
                onChange={(e) => updateEditAgentData({ name: e.target.value })}
                placeholder="Enter agent name"
              />
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact name</Label>
                <Input
                  id="contactName"
                  value={editAgentData?.contactName || ""}
                  onChange={(e) =>
                    updateEditAgentData({ contactName: e.target.value })
                  }
                  placeholder="Teresa Torres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact phone</Label>
                <Input
                  id="contactPhone"
                  value={editAgentData?.contactPhone || ""}
                  onChange={(e) =>
                    updateEditAgentData({ contactPhone: e.target.value })
                  }
                  placeholder="+12 456 78 90"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input
                id="contactEmail"
                value={editAgentData?.contactEmail || ""}
                onChange={(e) =>
                  updateEditAgentData({ contactEmail: e.target.value })
                }
                placeholder="agent@email.com"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditAgentOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={updateAgentMutation.isPending}
              onClick={() => {
                setIsEditAgentOpen(false);
                openDeleteConfirmationDialog();
              }}
            >
              Delete
            </Button>
            <Button
              onClick={handleEditAgent}
              disabled={updateAgentMutation.isPending}
              loading={updateAgentMutation.isPending}
            >
              {updateAgentMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation modal */}
      <DeleteConfirmationDialog
        DialogProps={{
          open: isDeleteAgentOpen,
          onOpenChange: setIsDeleteAgentOpen,
        }}
        title={"Agent delete"}
        description={"Delete agent information"}
        body={
          <div className="">
            You are about to delete the international agent{" "}
            <span className="font-semibold underline">
              {currentAgent?.name}
            </span>{" "}
            and all their associated data permanently, including operations.
            This cannot be undone.
          </div>
        }
        confirmationText={deleteConfirmationText}
        updateConfirmationText={(val) => setDeleteConfirmationText(val)}
        onDelete={() => {
          handleDeleteAgent(currentAgent?.agentId || "");
        }}
        onCancel={() => setIsDeleteAgentOpen(false)}
        isDeleting={deleteAgentMutation.isPending}
      />
    </div>
  );
}
