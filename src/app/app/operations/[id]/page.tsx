"use client";

import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarArrowDown,
  CalendarArrowUp,
  CircleSmall,
  Edit,
  MapPin,
  MessageSquare,
  Send,
  Trash,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/core/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/core/components/ui/breadcrumb";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import { Textarea } from "@/core/components/ui/textarea";
import { formatDate } from "@/core/lib/dates";
import { shortUUID } from "@/core/lib/misc";
import { numberOrNull } from "@/core/lib/numbers";
import { getRoute } from "@/core/lib/routes";
import { useAuth } from "@/modules/auth/lib/auth";
import { UserRolesIds } from "@/modules/auth/setup/auth";
import CarrierTypeBadge from "@/modules/carriers/components/CarrierTypeBadge/CarrierTypeBadge";
import OpsStatusBadge from "@/modules/ops_files/components/OpsStatusBadge/OpsStatusBadge";
import useOpsFile from "@/modules/ops_files/hooks/useOpsFile";
import {
  createOpsFileComment,
  deleteOpsFileComment,
  getCargoUnitTypesName,
  getOpsTypeIcon,
  getOpsTypeName,
  getVolumeUnitName,
  getWeightUnitName,
} from "@/modules/ops_files/lib/ops_files";
import {
  OperationTypes,
  OpsFileComment,
  OpsfileCommentCreate,
} from "@/modules/ops_files/types/ops_files.types";
import PartnerTypeBadge from "@/modules/partners/components/PartnerTypeBadge/PartnerTypeBadge";

const DEFAULT_USER_NAME = "System user";
const DEFAULT_MISSING_DATA_TAG = "- -";

export default function OperationDetailPage() {
  const params = useParams();

  /**
   * - - - Auth
   */
  const { user } = useAuth();
  const userRole = user?.role;

  /**
   * - - - - Operation file logic
   */

  const operationId = String(params?.id || "");

  const operationData = useOpsFile(operationId, {
    queryProps: { enabled: !!operationId },
  });

  const { operation } = operationData;

  /**
   * Refetch the operation data
   */
  const reloadOperation = () => {
    operationData.query.refetch();
  };

  /**
   * - - - - New comment logic
   */

  const [comment, setComment] = useState("");

  // Mutation
  const createCommentMutation = useMutation<
    OpsFileComment,
    Error,
    OpsfileCommentCreate
  >({
    mutationKey: ["CreateOperationComment", operationId],
    mutationFn: async (newCommentData) => {
      return await createOpsFileComment(newCommentData);
    },
    onError(error) {
      toast(`Unable to create comment. ${error}`);
    },
  });

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    const newComment = await createCommentMutation.mutateAsync({
      opsFileid: operationId,
      content: comment.trim(),
      authorUserId: user?.userId || null, // Current user is the author
    });

    if (newComment) {
      toast("Your comment has been added successfully.");
      setComment("");
      reloadOperation();
    } else {
      toast("Failed to add comment.");
    }
  };

  /**
   *  - - - - Delete comment logic
   */

  // Mutation
  const deleteCommentMutation = useMutation<boolean, Error, string>({
    mutationKey: ["deleteOpsFileCommentMutation"],
    mutationFn: async (commentId) => await deleteOpsFileComment(commentId),
    onError(error) {
      toast(`Failure deleting comment. ${error}`);
    },
  });

  const handleDeleteComment = async (id: string) => {
    if (!id) {
      toast("Unable to delete comment. No ID found");
      return;
    }

    if (!confirm("Are you sure?")) {
      return;
    }

    const success = await deleteCommentMutation.mutateAsync(id);

    if (success) {
      toast("The comment has been deleted successfully.");
      reloadOperation();
    } else {
      toast("Failed to delete the comment.");
    }
  };

  if (operationData.isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (operationData.isError) {
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold">Failure fetching operation</h2>
      <p className="text-muted-foreground mb-4">
        We were unable to obtained operation data.{" "}
        {String(operationData?.error || "No further details")}
      </p>
      <Button asChild>
        <Link href={getRoute("operations")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to operations
        </Link>
      </Button>
    </div>;
  }

  if (!operation) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold">Operation not found</h2>
        <p className="text-muted-foreground mb-4">
          The operation you{"'"}re looking for doesn{"'"}t exist.
        </p>
        <Button asChild>
          <Link href={getRoute("operations")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to operations
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/app/operations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Operation details
              {/* {operation.cargoDescription} */}
            </h1>
            <p className="text-muted-foreground">
              Review your operation
              {/* {operation.origin_location} to {operation.destination_location} */}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild disabled>
            <Link href={getRoute("operations-by-id-edit", [operationId])}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={getRoute("operations")}>Operations</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{shortUUID(operationId)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Operation details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Status
                </h3>
                <OpsStatusBadge statusId={operation?.status?.statusId}>
                  {operation?.status?.statusName || "undefined"}
                </OpsStatusBadge>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Operation type
                </h3>
                <p className="flex gap-2">
                  <span className="">
                    {getOpsTypeIcon(operation?.opType || "", {
                      className: "w-4",
                    })}
                  </span>{" "}
                  {getOpsTypeName(operation?.opType, DEFAULT_MISSING_DATA_TAG)}
                </p>
              </div>
              {/* Client */}
              <div className="">
                <h3 className="font-medium text-sm text-muted-foreground mb-1 flex gap-2">
                  <UserRound className="h-4" /> Client
                </h3>
                <p className="ml-1">{operation.client.name}</p>
              </div>
              {/* Assignee */}
              <div className="">
                <h3 className="font-medium text-sm text-muted-foreground mb-1 flex gap-2">
                  <UserRound className="h-4" /> Assignee
                </h3>
                <div className="ml-1">
                  {/* Show assignee data if there is */}
                  {operation?.assignee ? (
                    <div className="flex flex-col gap-0">
                      <p>
                        {operation.assignee?.name || DEFAULT_MISSING_DATA_TAG}{" "}
                      </p>
                      {operation?.assignee?.email && (
                        <p className="text-xs text-muted-foreground flex gap-1 items-center">
                          {operation.assignee.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    DEFAULT_MISSING_DATA_TAG
                  )}
                </div>
              </div>

              <Separator className="col-span-2 my-2" />

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1 flex gap-2">
                  <MapPin className="h-4 text-emerald-500" /> Origin
                </h3>
                <p className="ml-2">
                  {[
                    operation?.originLocation || "",
                    operation?.originCountry?.iso2Code || "",
                  ]
                    // Remove empty ones
                    .filter((l) => l.trim())
                    .join(", ") || DEFAULT_MISSING_DATA_TAG}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1 flex gap-2">
                  <MapPin className="h-4 text-blue-500" />
                  Destination
                </h3>
                <p className="ml-2">
                  {[
                    operation?.destinationLocation || "",
                    operation?.destinationCountry?.iso2Code || "",
                  ]
                    // Remove empty ones
                    .filter((l) => l.trim())
                    .join(", ") || DEFAULT_MISSING_DATA_TAG}
                </p>
              </div>

              <Separator className="col-span-2 my-2" />

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1 flex gap-2">
                  <CalendarArrowUp className="h-4 text-emerald-500" /> ETD
                </h3>
                <p className="ml-2">
                  {formatDate(
                    operation?.estimatedTimeDeparture,
                    DEFAULT_MISSING_DATA_TAG,
                    {
                      timeZone: "UTC", // Try specifying the timezone
                    }
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1 flex gap-2">
                  <CalendarArrowDown className="h-4 text-blue-500" /> ETA
                </h3>
                <p className="ml-2">
                  {formatDate(
                    operation?.estimatedTimeArrival,
                    DEFAULT_MISSING_DATA_TAG,
                    {
                      timeZone: "UTC", // Try specifying the timezone
                    }
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1 flex gap-2">
                  <CalendarArrowUp className="h-4 text-emerald-500" /> ATD
                </h3>
                <p className="ml-2">
                  {formatDate(
                    operation?.actualTimeDeparture,
                    DEFAULT_MISSING_DATA_TAG
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1 flex gap-2">
                  <CalendarArrowDown className="h-4 text-blue-500" /> ATA
                </h3>
                <p className="ml-2">
                  {formatDate(
                    operation?.actualTimeArrival,
                    DEFAULT_MISSING_DATA_TAG
                  )}
                </p>
              </div>

              <Separator className="col-span-2 my-2" />

              <div className="col-span-2">
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Commodities / Cargo description
                </h3>
                <p>{operation?.cargoDescription || DEFAULT_MISSING_DATA_TAG}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Gross weight
                </h3>
                <p>
                  {operation.grossWeightValue
                    ? `${operation.grossWeightValue} ${getWeightUnitName(
                        operation?.grossWeightUnit || ""
                      )}`.trim()
                    : DEFAULT_MISSING_DATA_TAG}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Volume
                </h3>
                <p>
                  {operation.volumeValue
                    ? `${operation.volumeValue} ${getVolumeUnitName(
                        operation?.volumeUnit || ""
                      )}`.trim()
                    : DEFAULT_MISSING_DATA_TAG}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Packaging
                </h3>
                {!!operation.packaging && operation.packaging.length > 0 ? (
                  <ul className="list-inside space-y-1">
                    {operation.packaging.map((packaging) => (
                      <li
                        key={packaging.packageId}
                        className="flex items-center"
                      >
                        <CircleSmall className="h-3" />
                        <Badge variant={"outline"} className="text-sm">
                          {numberOrNull(packaging.quantity)}{" "}
                          {getCargoUnitTypesName(
                            packaging?.units,
                            packaging.quantity === 1
                          ) || "unknown units"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{DEFAULT_MISSING_DATA_TAG}</p>
                )}
              </div>

              <Separator className="col-span-2 my-2" />

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  {operation?.opType === OperationTypes.MARITIME
                    ? "MBL"
                    : operation?.opType === OperationTypes.AIR
                    ? "MAWB"
                    : "Master document number"}
                </h3>
                <p>
                  {operation.masterTransportDoc || DEFAULT_MISSING_DATA_TAG}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  {operation?.opType === OperationTypes.MARITIME
                    ? "HBL"
                    : operation?.opType === OperationTypes.AIR
                    ? "HAWB"
                    : "House document number"}
                </h3>
                <p>
                  {operation?.houseTransportDoc || DEFAULT_MISSING_DATA_TAG}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Incoterm
                </h3>
                <p>{operation?.incoterm || DEFAULT_MISSING_DATA_TAG}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Modality
                </h3>
                <p>{operation?.modality || DEFAULT_MISSING_DATA_TAG}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Voyage
                </h3>
                <p>{operation?.voyage || DEFAULT_MISSING_DATA_TAG}</p>
              </div>

              <Separator className="col-span-2 my-2" />

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Carrier
                </h3>
                <div className="flex gap-2">
                  <p>{operation?.carrier?.name || DEFAULT_MISSING_DATA_TAG}</p>
                  {!!operation?.carrier && (
                    <CarrierTypeBadge
                      carrierTypeId={
                        operation?.carrier.carrierType.carrierTypeId
                      }
                    >
                      {operation?.carrier?.carrierType.name ||
                        DEFAULT_MISSING_DATA_TAG}
                    </CarrierTypeBadge>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Partners
                </h3>
                {operation.partners && operation.partners.length > 0 ? (
                  <ul className="list-inside space-y-1">
                    {operation.partners.map((partner) => (
                      <li key={partner.partnerId} className="flex items-center">
                        <CircleSmall className="h-3" />
                        <p>{partner.name}</p>
                        <PartnerTypeBadge
                          partnerTypeId={partner.partnerType.partnerTypeId}
                          className="text-xs scale-90"
                        >
                          {partner.partnerType.name || DEFAULT_MISSING_DATA_TAG}
                        </PartnerTypeBadge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{DEFAULT_MISSING_DATA_TAG}</p>
                )}
              </div>

              <Separator className="col-span-2 my-2" />

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Operation ID
                </h3>
                <p className="text-sm">{operation?.opsFileId}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Last update at
                </h3>
                <p className="text-sm">{formatDate(operation.updatedAt)}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Created at
                </h3>
                <p className="text-sm">{formatDate(operation.createdAt)}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Created by
                </h3>
                <div className="text-sm">
                  {/* Show creator user data if there is */}
                  {operation?.creator ? (
                    <div className="flex flex-col gap-0">
                      <p>
                        {operation.creator?.name || DEFAULT_MISSING_DATA_TAG}{" "}
                      </p>
                      {operation?.creator?.email && (
                        <p className="text-xs text-muted-foreground flex gap-1 items-center">
                          {operation.creator?.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    DEFAULT_MISSING_DATA_TAG
                  )}
                </div>
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
                  <div key={comment.commentId} className="space-y-1  group">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">
                        {comment?.author?.name || DEFAULT_USER_NAME}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(
                          comment?.createdAt,
                          DEFAULT_MISSING_DATA_TAG,
                          {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </p>
                    </div>
                    <div className="w-full flex gap-2 items-center justify-between">
                      <p className="text-sm">{comment.content}</p>

                      <div className="w-fit invisible opacity-0 group-hover:visible group-hover:opacity-100 transition">
                        <Button
                          variant="outline"
                          className="cursor-pointer"
                          disabled={userRole?.roleId !== UserRolesIds.ADMIN}
                          onClick={() => {
                            handleDeleteComment(comment?.commentId || "");
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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
                  <Button
                    size="icon"
                    onClick={handleAddComment}
                    disabled={
                      createCommentMutation.isPending || !comment.trim()
                    }
                    className="cursor-pointer"
                  >
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
