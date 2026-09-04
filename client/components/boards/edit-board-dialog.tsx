"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Board } from "@/types/board";
import { useBoards } from "@/hooks/use-boards";
import { ApiError } from "@/lib/api/client";

interface EditBoardDialogProps {
  board: Board | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBoardDialog({ board, open, onOpenChange }: EditBoardDialogProps) {
  const { updateBoard } = useBoards();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (board) {
      setName(board.name || "");
      setDescription(board.description || "");
    }
  }, [board]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!board) return;
    setError(null);

    if (!name.trim()) {
      setError("Board name cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      await updateBoard(board.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update board");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Edit Board Details
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Update the title and description for this board.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2.5 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-board-name" className="text-xs font-semibold text-slate-700">
              Board Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="edit-board-name"
              placeholder="e.g. Product Roadmap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-board-desc" className="text-xs font-semibold text-slate-700">
              Description
            </Label>
            <Input
              id="edit-board-desc"
              placeholder="e.g. Quarterly planning and feature prioritization"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs rounded-xl"
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="bg-[#1b4332] hover:bg-[#143627] text-white rounded-xl text-xs font-semibold"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
