import { Trash } from "lucide-react";
import { ComponentProps, FC, ReactNode } from "react";

import { Button } from "@/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";

const DELETE_CONFIRMATION_TEXT = "confirm";

type DeleteConfirmationDialogProps = {
  confirmationText: string;
  updateConfirmationText: (newVal: string) => void;
  referenceText?: string;
  DialogProps: ComponentProps<typeof Dialog>;
  title: ReactNode;
  description?: ReactNode;
  body?: ReactNode;
  isDeleting?: boolean;
  onDelete: ComponentProps<typeof Button>["onClick"];
  onCancel: ComponentProps<typeof Button>["onClick"];
};

const DeleteConfirmationDialog: FC<DeleteConfirmationDialogProps> = ({
  DialogProps,
  confirmationText,
  updateConfirmationText,
  referenceText = DELETE_CONFIRMATION_TEXT,
  title,
  description,
  body,
  isDeleting = false,
  onDelete,
  onCancel,
}) => {
  return (
    <Dialog {...DialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-xs">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="text-center text-sm font-normal">{body}</div>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              Enter
              <span className="font-semibold text-red-500">
                {'"'}
                {DELETE_CONFIRMATION_TEXT}
                {'"'}
              </span>
              in order to be able to delete
            </Label>
            <Input
              value={confirmationText || ""}
              onChange={(e) => updateConfirmationText(e.target.value)}
              placeholder=""
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={onDelete}
            disabled={
              confirmationText.trim() !== referenceText.trim() || isDeleting
            }
            variant={"destructive"}
          >
            <Trash />

            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
