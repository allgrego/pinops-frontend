"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Separator } from "@/core/components/ui/separator";
import { Textarea } from "@/core/components/ui/textarea";
import { ArrowLeft, Edit, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { getOperation, type TradeOperation, addComment } from "@/core/lib/data";
import { toast } from "sonner";

export default function OperationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [operation, setOperation] = useState<TradeOperation | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadOperation();
  }, [params.id]);

  const loadOperation = () => {
    setLoading(true);
    const op = getOperation(params.id);
    setOperation(op);
    setLoading(false);
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newComment = addComment("operation", params.id, comment);
    if (newComment) {
      toast("Your comment has been added successfully.");
      setComment("");
      loadOperation();
    } else {
      toast("Failed to add comment.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (!operation) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold">Operation not found</h2>
        <p className="text-muted-foreground mb-4">
          The operation you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/operations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Operations
          </Link>
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/operations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {operation.cargo_description}
            </h1>
            <p className="text-muted-foreground">
              {operation.origin_location} to {operation.destination_location}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/operations/${operation.op_id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Operation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Status
                </h3>
                <Badge variant="outline" className="text-sm">
                  {operation.status.status_name}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Client
                </h3>
                <p>{operation.client.name}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Origin
                </h3>
                <p>
                  {operation.origin_location}, {operation.origin_country}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Destination
                </h3>
                <p>
                  {operation.destination_location},{" "}
                  {operation.destination_country}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Est. Departure
                </h3>
                <p>{formatDate(operation.estimated_time_departure)}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Act. Departure
                </h3>
                <p>{formatDate(operation.actual_time_departure)}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Est. Arrival
                </h3>
                <p>{formatDate(operation.estimated_time_arrival)}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Act. Arrival
                </h3>
                <p>{formatDate(operation.actual_time_arrival)}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Cargo
                </h3>
                <p>{operation.cargo_description}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Quantity
                </h3>
                <p>
                  {operation.units_quantity} {operation.units_type}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Weight
                </h3>
                <p>
                  {operation.gross_weight_value} {operation.gross_weight_unit}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Volume
                </h3>
                <p>
                  {operation.volume_value
                    ? `${operation.volume_value} ${operation.volume_unit}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Master Doc
                </h3>
                <p>{operation.master_transport_doc || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  House Doc
                </h3>
                <p>{operation.house_transport_doc || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Incoterm
                </h3>
                <p>{operation.incoterm || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Modality
                </h3>
                <p>{operation.modality || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Voyage
                </h3>
                <p>{operation.voyage || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Carrier
                </h3>
                <p>{operation.carrier?.name || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Agent
                </h3>
                <p>{operation.agent?.name || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Created
                </h3>
                <p>{new Date(operation.created_at).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {operation.comments && operation.comments.length > 0 ? (
                operation.comments.map((comment) => (
                  <div key={comment.id} className="space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    <Separator className="my-2" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              )}

              <div className="pt-4">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleAddComment}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
