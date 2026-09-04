"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Board } from "@/types/board";
import { useBoards } from "@/hooks/use-boards";
import { ApiError } from "@/lib/api/client";
import { toast } from "sonner";

interface DeleteBoardDialogProps {
  board: Board | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteBoardDialog({ board, open, onOpenChange }: DeleteBoardDialogProps) {
  const router = useRouter();
  const { deleteBoard } = useBoards();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!board) return;
    try {
      setIsLoading(true);
      await deleteBoard(board.id);
      onOpenChange(false);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to delete board");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md rounded-2xl p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Delete Board &quot;{board?.name}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            This action cannot be undone. All columns, tasks, and member associations for this board will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-4 gap-2">
          <AlertDialogCancel
            disabled={isLoading}
            className="rounded-xl text-xs"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isLoading}
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold"
          >
            {isLoading ? "Deleting..." : "Delete Board"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
