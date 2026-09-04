"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Users,
  FileText,
  Sparkles,
  Bell,
  Plus,
  ChevronDown,
  Menu,
  LogOut,
  MoreVertical,
  Pencil,
  Trash2,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useBoards } from "@/hooks/use-boards";
import { CreateBoardDialog } from "@/components/boards/create-board-dialog";
import { EditBoardDialog } from "@/components/boards/edit-board-dialog";
import { DeleteBoardDialog } from "@/components/boards/delete-board-dialog";
import { ShareBoardDialog } from "@/components/boards/share-board-dialog";

interface TopbarProps {
  onOpenMobileSidebar?: () => void;
}

export function Topbar({ onOpenMobileSidebar }: TopbarProps) {
  const { user, logout } = useAuth();
  const { activeBoard } = useBoards();
  const router = useRouter();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const initials = getInitials(user?.name);

  const isOwner = activeBoard?.isOwner ?? false;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 dark:border-slate-800/80 dark:bg-[#0F172A]/90 px-4 md:px-6 backdrop-blur-md transition-colors">
        {/* Left side: Mobile menu button + Board Title & Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 rounded-lg dark:hover:bg-slate-800"
            onClick={onOpenMobileSidebar}
          >
            <Menu className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                {activeBoard ? activeBoard.name : "Select a Board"}
              </h1>

              {/* Owner vs Member Badge */}
              {activeBoard && (
                <span className="hidden sm:inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {isOwner ? "Owner" : "Shared Member"}
                </span>
              )}
            </div>
            <p className="hidden sm:block text-xs text-slate-400 dark:text-slate-500 truncate max-w-md">
              {activeBoard?.description || (activeBoard ? "Kanban Board" : "Choose a board from the sidebar to start")}
            </p>
          </div>
        </div>

        {/* Right side: Actions, Share, Board Settings, Profile */}
        <div className="flex items-center gap-2 md:gap-2.5">
          {/* Members / Share Action Button */}
          {activeBoard && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShareDialogOpen(true)}
              className="h-8 rounded-xl text-xs font-semibold gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Users className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Members</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-1.5 py-0.2 rounded-full font-bold">
                {activeBoard.memberCount ? activeBoard.memberCount + 1 : 1}
              </span>
            </Button>
          )}

          {/* Board Owner Action Menu */}
          {activeBoard && isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors outline-none cursor-pointer">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                  Board Settings
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setEditDialogOpen(true)}
                  className="cursor-pointer text-xs font-medium gap-2"
                >
                  <Pencil className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Edit Board</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="cursor-pointer text-xs font-medium text-rose-600 focus:text-rose-700 gap-2"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Board</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Action Pill Buttons */}
          <div className="flex items-center gap-1.5">
            {/* New Board Button */}
            <Button
              variant="darkPill"
              size="pillSm"
              onClick={() => setCreateDialogOpen(true)}
              className="bg-[#1b4332] hover:bg-[#143627] dark:bg-emerald-800 dark:hover:bg-emerald-900 gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden md:inline">New board</span>
              <span className="md:hidden">New</span>
            </Button>
          </div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors outline-none cursor-pointer ml-1">
                <Avatar className="h-7 w-7 border-0">
                  <AvatarFallback className="bg-[#1b4332] dark:bg-emerald-800 text-emerald-100 text-[11px] font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                  {userName.split(" ")[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{userName}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal truncate">{userEmail}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Workspace Members</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-rose-600 focus:text-rose-700 cursor-pointer flex items-center gap-2 text-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Board Modals */}
      <CreateBoardDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <EditBoardDialog
        board={activeBoard}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <DeleteBoardDialog
        board={activeBoard}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />

      <ShareBoardDialog
        board={activeBoard}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </>
  );
}
