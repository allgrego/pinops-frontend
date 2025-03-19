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
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Edit,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

  /**
   * - - --  Agent create
   */
  const createAgentMutation = useMutation<Agent, Error, AgentCreate>({
    mutationKey: ["createAgentMutation"],
    mutationFn: async (newData) => await createAgent(newData),
    onError(error) {
      toast(`Failure creating agent. ${error}`);
    },
  });

  /**
   * - - --  Agent update
   */
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

  /**
   * - - --  Agent delete
   */
  const deleteAgentMutation = useMutation<boolean, Error, string>({
    mutationKey: ["deleteAgentMutation"],
    mutationFn: async (agentId) => await deleteAgent(agentId),
    onError(error) {
      toast(`Failure deleting agent. ${error}`);
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isNewAgentOpen, setIsNewAgentOpen] = useState(false);
  const [isEditAgentOpen, setIsEditAgentOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [newAgentName, setNewAgentName] = useState("");
  const [editAgentName, setEditAgentName] = useState("");

  const loadAgents = async () => {
    await agentsQuery.refetch();
  };

  const handleCreateAgent = async () => {
    if (!newAgentName.trim()) return;

    const newAgent = await createAgentMutation.mutateAsync({
      name: newAgentName,
    });

    console.log("newAgent", newAgent);

    toast("The agent has been created successfully.");

    setNewAgentName("");
    setIsNewAgentOpen(false);
    await loadAgents();
  };

  const handleEditAgent = async () => {
    if (!currentAgent || !editAgentName.trim()) return;

    const updatedAgent = await updateAgentMutation.mutateAsync({
      agentId: currentAgent.agent_id,
      data: {
        name: editAgentName,
      },
    });

    toast(`The agent ${updatedAgent?.name} has been updated successfully.`);

    setIsEditAgentOpen(false);
    await loadAgents();
  };

  const handleDeleteAgent = async (id: string) => {
    const success = await deleteAgentMutation.mutateAsync(id);
    if (success) {
      toast("The agent has been deleted successfully.");
      loadAgents();
    } else {
      toast("Failed to delete the agent.");
    }
  };

  const openEditDialog = (agent: Agent) => {
    setCurrentAgent(agent);
    setEditAgentName(agent.name);
    setIsEditAgentOpen(true);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-muted-foreground">Manage your agents</p>
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
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="Enter agent name"
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
              >
                {createAgentMutation.isPending && (
                  <Loader2 className="animate-spin" />
                )}
                Create
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
              <TableHead>ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.length === 0 ? (
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
                <TableRow key={agent.agent_id}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell className="text-xs">{agent.agent_id}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(agent)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteAgent(agent.agent_id)}
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

      {/* Edit Agent Dialog */}
      <Dialog open={isEditAgentOpen} onOpenChange={setIsEditAgentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>Update agent information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Agent Name</Label>
              <Input
                id="edit-name"
                value={editAgentName}
                onChange={(e) => setEditAgentName(e.target.value)}
              />
            </div>
            {/* {currentAgent?.comments && currentAgent.comments.length > 0 && (
              <div className="space-y-2">
                <Label>Comments</Label>
                <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                  {currentAgent.comments.map((comment) => (
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
            <Button variant="outline" onClick={() => setIsEditAgentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAgent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
