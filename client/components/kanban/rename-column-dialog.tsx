"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Column } from "@/types/column";
import { updateColumn } from "@/lib/api/columns";
import { ApiError } from "@/lib/api/client";

interface RenameColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  column: Column | null;
  onRenameColumn: (updatedColumn: Column) => void;
}

export function RenameColumnDialog({
  open,
  onOpenChange,
  column,
  onRenameColumn,
}: RenameColumnDialogProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (column) {
      setName(column.name);
    }
  }, [column, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!column || !trimmedName) return;

    try {
      setIsSubmitting(true);
      const res = await updateColumn(column.id, { name: trimmedName });
      if (res.data) {
        toast.success("Column renamed successfully");
        onRenameColumn(res.data);
        onOpenChange(false);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to rename column");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
            Rename Column
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Column Name</label>
            <Input
              type="text"
              placeholder="e.g. In Review"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg text-xs"
              disabled={isSubmitting}
              autoFocus
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#1b4332] hover:bg-[#143627] dark:bg-emerald-800 dark:hover:bg-emerald-900 text-white"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
