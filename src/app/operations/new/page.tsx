"use client";

import type React from "react";

import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Textarea } from "@/core/components/ui/textarea";
import {
  createOperation,
  getAgents,
  getCarriers,
  getClients,
  statuses,
  type Agent,
  type Carrier,
  type Client,
} from "@/core/lib/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NewOperationPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  const [formData, setFormData] = useState({
    origin_location: "",
    origin_country: "",
    destination_location: "",
    destination_country: "",
    estimated_time_departure: "",
    actual_time_departure: "",
    estimated_time_arrival: "",
    actual_time_arrival: "",
    cargo_description: "",
    units_quantity: "",
    units_type: "",
    gross_weight_value: "",
    gross_weight_unit: "Kg",
    volume_value: "",
    volume_unit: "m³",
    master_transport_doc: "",
    house_transport_doc: "",
    incoterm: "CIF",
    modality: "FCL",
    voyage: "",
    client_id: "",
    status_id: "1",
    carrier_id: "",
    agent_id: "",
  });

  useEffect(() => {
    setClients(getClients());
    setCarriers(getCarriers());
    setAgents(getAgents());
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Find the selected client, carrier, agent
      const client = clients.find((c) => c.client_id === formData.client_id);
      const carrier = formData.carrier_id
        ? carriers.find((c) => c.carrier_id === formData.carrier_id)
        : null;
      const agent = formData.agent_id
        ? agents.find((a) => a.agent_id === formData.agent_id)
        : null;
      const status = statuses.find(
        (s) => s.status_id.toString() === formData.status_id
      );

      if (!client || !status) {
        toast("Client and status are required.");
        return;
      }

      // Create the operation
      const newOperation = createOperation({
        origin_location: formData.origin_location,
        origin_country: formData.origin_country,
        destination_location: formData.destination_location,
        destination_country: formData.destination_country,
        estimated_time_departure: formData.estimated_time_departure || null,
        actual_time_departure: formData.actual_time_departure || null,
        estimated_time_arrival: formData.estimated_time_arrival || null,
        actual_time_arrival: formData.actual_time_arrival || null,
        cargo_description: formData.cargo_description,
        units_quantity: formData.units_quantity
          ? Number(formData.units_quantity)
          : null,
        units_type: formData.units_type || null,
        gross_weight_value: formData.gross_weight_value
          ? Number(formData.gross_weight_value)
          : null,
        gross_weight_unit: formData.gross_weight_unit || null,
        volume_value: formData.volume_value
          ? Number(formData.volume_value)
          : null,
        volume_unit: formData.volume_unit || null,
        master_transport_doc: formData.master_transport_doc || null,
        house_transport_doc: formData.house_transport_doc || null,
        incoterm: formData.incoterm || null,
        modality: formData.modality || null,
        voyage: formData.voyage || null,
        client,
        status,
        carrier: carrier || null,
        agent: agent || null,
      });

      toast("The operation has been created successfully.");

      router.push(`/operations/${newOperation.op_id}`);
    } catch (error) {
      toast("Failed to create the operation.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/operations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">New Operation</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin_location">Origin Location</Label>
                  <Input
                    id="origin_location"
                    name="origin_location"
                    value={formData.origin_location}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origin_country">Origin Country</Label>
                  <Input
                    id="origin_country"
                    name="origin_country"
                    value={formData.origin_country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination_location">
                    Destination Location
                  </Label>
                  <Input
                    id="destination_location"
                    name="destination_location"
                    value={formData.destination_location}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination_country">
                    Destination Country
                  </Label>
                  <Input
                    id="destination_country"
                    name="destination_country"
                    value={formData.destination_country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargo_description">Cargo Description</Label>
                <Textarea
                  id="cargo_description"
                  name="cargo_description"
                  value={formData.cargo_description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="units_quantity">Units Quantity</Label>
                  <Input
                    id="units_quantity"
                    name="units_quantity"
                    type="number"
                    value={formData.units_quantity}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units_type">Units Type</Label>
                  <Input
                    id="units_type"
                    name="units_type"
                    value={formData.units_type}
                    onChange={handleChange}
                    placeholder="pallets, containers, boxes..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gross_weight_value">Gross Weight</Label>
                  <Input
                    id="gross_weight_value"
                    name="gross_weight_value"
                    type="number"
                    step="0.01"
                    value={formData.gross_weight_value}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gross_weight_unit">Weight Unit</Label>
                  <Select
                    value={formData.gross_weight_unit}
                    onValueChange={(value) =>
                      handleSelectChange("gross_weight_unit", value)
                    }
                  >
                    <SelectTrigger id="gross_weight_unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kg">Kg</SelectItem>
                      <SelectItem value="Lb">Lb</SelectItem>
                      <SelectItem value="Ton">Ton</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="volume_value">Volume</Label>
                  <Input
                    id="volume_value"
                    name="volume_value"
                    type="number"
                    step="0.01"
                    value={formData.volume_value}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume_unit">Volume Unit</Label>
                  <Select
                    value={formData.volume_unit}
                    onValueChange={(value) =>
                      handleSelectChange("volume_unit", value)
                    }
                  >
                    <SelectTrigger id="volume_unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m³">m³</SelectItem>
                      <SelectItem value="ft³">ft³</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_time_departure">
                    Est. Departure
                  </Label>
                  <Input
                    id="estimated_time_departure"
                    name="estimated_time_departure"
                    type="date"
                    value={formData.estimated_time_departure}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actual_time_departure">Act. Departure</Label>
                  <Input
                    id="actual_time_departure"
                    name="actual_time_departure"
                    type="date"
                    value={formData.actual_time_departure}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_time_arrival">Est. Arrival</Label>
                  <Input
                    id="estimated_time_arrival"
                    name="estimated_time_arrival"
                    type="date"
                    value={formData.estimated_time_arrival}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actual_time_arrival">Act. Arrival</Label>
                  <Input
                    id="actual_time_arrival"
                    name="actual_time_arrival"
                    type="date"
                    value={formData.actual_time_arrival}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="master_transport_doc">Master Doc</Label>
                  <Input
                    id="master_transport_doc"
                    name="master_transport_doc"
                    value={formData.master_transport_doc}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="house_transport_doc">House Doc</Label>
                  <Input
                    id="house_transport_doc"
                    name="house_transport_doc"
                    value={formData.house_transport_doc}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incoterm">Incoterm</Label>
                  <Select
                    value={formData.incoterm}
                    onValueChange={(value) =>
                      handleSelectChange("incoterm", value)
                    }
                  >
                    <SelectTrigger id="incoterm">
                      <SelectValue placeholder="Select incoterm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CIF">CIF</SelectItem>
                      <SelectItem value="FOB">FOB</SelectItem>
                      <SelectItem value="EXW">EXW</SelectItem>
                      <SelectItem value="FCA">FCA</SelectItem>
                      <SelectItem value="CPT">CPT</SelectItem>
                      <SelectItem value="CIP">CIP</SelectItem>
                      <SelectItem value="DAP">DAP</SelectItem>
                      <SelectItem value="DDP">DDP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modality">Modality</Label>
                  <Select
                    value={formData.modality}
                    onValueChange={(value) =>
                      handleSelectChange("modality", value)
                    }
                  >
                    <SelectTrigger id="modality">
                      <SelectValue placeholder="Select modality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FCL">FCL</SelectItem>
                      <SelectItem value="LCL">LCL</SelectItem>
                      <SelectItem value="Air">Air</SelectItem>
                      <SelectItem value="Road">Road</SelectItem>
                      <SelectItem value="Rail">Rail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voyage">Voyage</Label>
                <Input
                  id="voyage"
                  name="voyage"
                  value={formData.voyage}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status_id">Status</Label>
                <Select
                  value={formData.status_id}
                  onValueChange={(value) =>
                    handleSelectChange("status_id", value)
                  }
                >
                  <SelectTrigger id="status_id">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem
                        key={status.status_id}
                        value={status.status_id.toString()}
                      >
                        {status.status_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_id">Client</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) =>
                    handleSelectChange("client_id", value)
                  }
                  required
                >
                  <SelectTrigger id="client_id">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem
                        key={client.client_id}
                        value={client.client_id}
                      >
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="carrier_id">Carrier</Label>
                <Select
                  value={formData.carrier_id}
                  onValueChange={(value) =>
                    handleSelectChange("carrier_id", value)
                  }
                >
                  <SelectTrigger id="carrier_id">
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {carriers.map((carrier) => (
                      <SelectItem
                        key={carrier.carrier_id}
                        value={carrier.carrier_id}
                      >
                        {carrier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent_id">Agent</Label>
                <Select
                  value={formData.agent_id}
                  onValueChange={(value) =>
                    handleSelectChange("agent_id", value)
                  }
                >
                  <SelectTrigger id="agent_id">
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.agent_id} value={agent.agent_id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" asChild>
            <Link href="/operations">Cancel</Link>
          </Button>
          <Button type="submit">Create Operation</Button>
        </div>
      </form>
    </div>
  );
}
