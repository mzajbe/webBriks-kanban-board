"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Zap,
  ChevronLeft,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Users,
  Plus,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  Loader2,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useBoards } from "@/hooks/use-boards";
import { CreateBoardDialog } from "@/components/boards/create-board-dialog";

interface SidebarProps {
  className?: string;
  onNavigateBoard?: (boardId: string) => void;
}

export function Sidebar({ className, onNavigateBoard }: SidebarProps) {
  const router = useRouter();
  const params = useParams();
  const activeBoardIdFromUrl = params?.boardId as string | undefined;

  const { user, logout } = useAuth();
  const { boards, activeBoard, isLoadingBoards } = useBoards();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const currentBoardId = activeBoardIdFromUrl || activeBoard?.id;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-tasks", label: "My Tasks", icon: CheckSquare },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "team", label: "Team", icon: Users },
  ];

  const generalItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help & search", icon: HelpCircle },
    { id: "logout", label: "Log out", icon: LogOut, action: () => logout().then(() => router.push("/login")) },
  ];

  const handleBoardClick = (id: string) => {
    if (onNavigateBoard) {
      onNavigateBoard(id);
    } else {
      router.push(`/boards/${id}`);
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

  // Helper for icon background colors
  const getIconColor = (index: number) => {
    const colors = [
      { bg: "bg-blue-100", text: "text-blue-900" },
      { bg: "bg-rose-100", text: "text-rose-900" },
      { bg: "bg-emerald-100", text: "text-emerald-900" },
      { bg: "bg-amber-100", text: "text-amber-900" },
      { bg: "bg-purple-100", text: "text-purple-900" },
    ];
    return colors[index % colors.length];
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "flex h-full w-[220px] flex-col border-r border-slate-200/80 bg-white px-3 py-4 text-slate-700 select-none shrink-0",
          className
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 mb-6">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-white shadow-xs">
              <Zap className="h-4 w-4 fill-white text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900">
              webBriks
            </span>
          </div>
          <button className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5 custom-scrollbar">
          {/* MENU Section */}
          <div className="space-y-1">
            <p className="px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              MENU
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => router.push("/")}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* BOARDS Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2.5 mb-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                BOARDS
              </p>
              <button
                onClick={() => setCreateDialogOpen(true)}
                className="text-slate-400 hover:text-emerald-800 transition-colors p-0.5 rounded cursor-pointer"
                title="Create New Board"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {isLoadingBoards ? (
              <div className="flex items-center justify-center py-4 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : boards.length === 0 ? (
              <div className="px-2.5 py-2 text-center text-xs text-slate-400 font-medium">
                No boards yet
              </div>
            ) : (
              boards.map((board, idx) => {
                const isActive = currentBoardId === board.id;
                const style = getIconColor(idx);

                return (
                  <button
                    key={board.id}
                    onClick={() => handleBoardClick(board.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer",
                      isActive
                        ? "bg-emerald-50 text-emerald-950 font-semibold"
                        : "text-slate-600 font-medium hover:bg-slate-100/70 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold shrink-0",
                          style.bg,
                          style.text
                        )}
                      >
                        {board.name[0]?.toUpperCase() || "B"}
                      </span>
                      <span className="truncate max-w-[100px] text-left">{board.name}</span>
                    </div>
                    {!board.isOwner && (
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-500 shrink-0"
                        title="Shared with you"
                      >
                        Shared
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* GENERAL Section */}
          <div className="space-y-1">
            <p className="px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              GENERAL
            </p>
            {generalItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Promo AI Banner Card */}
        <div className="mt-3 mb-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#143627] p-3 text-white shadow-md border border-emerald-800/40">
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
            </div>
            <h4 className="text-xs font-bold tracking-tight text-white">
              Plan with AI
            </h4>
            <p className="mt-1 text-[11px] text-emerald-100/85 leading-tight font-normal">
              Turn a goal into a backlog in seconds.
            </p>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2.5 px-1">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-[#1b4332] text-emerald-100 text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 leading-none">
            <span className="text-xs font-bold text-slate-900 truncate">
              {userName}
            </span>
            <span className="text-[10px] text-slate-400 truncate mt-0.5">
              {userEmail}
            </span>
          </div>
        </div>
      </aside>

      {/* Create Board Modal */}
      <CreateBoardDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </TooltipProvider>
  );
}
