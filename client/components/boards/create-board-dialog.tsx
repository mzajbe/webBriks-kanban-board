"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useBoards } from "@/hooks/use-boards";
import { ApiError } from "@/lib/api/client";

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBoardDialog({ open, onOpenChange }: CreateBoardDialogProps) {
  const router = useRouter();
  const { createBoard } = useBoards();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Board name is required");
      return;
    }

    try {
      setIsLoading(true);
      const newBoard = await createBoard({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      setName("");
      setDescription("");
      onOpenChange(false);
      router.push(`/boards/${newBoard.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create board");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Create New Board
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Organize your tasks and workflow with a dedicated Kanban board.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-lg p-2.5 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="board-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Board Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="board-name"
              placeholder="e.g. Product Roadmap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="board-desc" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description <span className="text-slate-400 dark:text-slate-500 font-normal">(optional)</span>
            </Label>
            <Input
              id="board-desc"
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
              className="bg-[#1b4332] hover:bg-[#143627] dark:bg-emerald-800 dark:hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold"
            >
              {isLoading ? "Creating..." : "Create Board"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
