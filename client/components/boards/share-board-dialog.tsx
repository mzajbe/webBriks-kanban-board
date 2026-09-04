"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Board } from "@/types/board";
import { useBoards } from "@/hooks/use-boards";
import { ApiError } from "@/lib/api/client";
import { UserPlus, Trash2, ShieldCheck, Mail } from "lucide-react";

interface ShareBoardDialogProps {
  board: Board | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareBoardDialog({ board, open, onOpenChange }: ShareBoardDialogProps) {
  const { members, shareBoard, removeMember } = useBoards();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isOwner = board?.isOwner ?? false;

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!board) return;
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      await shareBoard(board.id, email.trim());
      setEmail("");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add member");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!board) return;
    try {
      setRemovingId(userId);
      await removeMember(board.id, userId);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    } finally {
      setRemovingId(null);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6 select-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Share &quot;{board?.name}&quot;</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {isOwner
              ? "Invite team members by email to collaborate on this board."
              : "View team members collaborating on this board."}
          </DialogDescription>
        </DialogHeader>

        {/* Error message banner */}
        {error && (
          <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2.5 font-medium">
            {error}
          </div>
        )}

        {/* Add Member Form (Owner only) */}
        {isOwner && (
          <form onSubmit={handleAddMember} className="flex items-center gap-2 py-1">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                placeholder="registered.user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-xs rounded-xl h-9"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-[#1b4332] hover:bg-[#143627] text-white rounded-xl text-xs font-semibold h-9 shrink-0 gap-1.5"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Adding..." : "Add Member"}</span>
            </Button>
          </form>
        )}

        {/* Members List Section */}
        <div className="space-y-2 pt-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Board Members ({members.length})
          </p>

          <ScrollArea className="max-h-56 pr-2">
            <div className="space-y-2">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar className="h-7 w-7 border-0 shrink-0">
                      <AvatarFallback className="bg-[#1b4332] text-emerald-100 text-[11px] font-bold">
                        {getInitials(m.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {m.name}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate">
                        {m.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {m.isOwner ? (
                      <Badge className="bg-emerald-100 text-emerald-900 hover:bg-emerald-100 text-[10px] font-semibold border-0 gap-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-700" />
                        <span>Owner</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-slate-500 font-medium">
                        Member
                      </Badge>
                    )}

                    {/* Remove button (Only visible to owner, and cannot remove owner) */}
                    {isOwner && !m.isOwner && (
                      <button
                        type="button"
                        onClick={() => handleRemove(m.id)}
                        disabled={removingId === m.id}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
