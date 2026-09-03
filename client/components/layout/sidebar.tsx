"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarBoards, currentUser } from "@/data/mock-board";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  className?: string;
  onNavigateBoard?: (boardId: string) => void;
}

export function Sidebar({ className, onNavigateBoard }: SidebarProps) {
  const [activeBoardId, setActiveBoardId] = useState<string>("board-1");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-tasks", label: "My Tasks", icon: CheckSquare },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "team", label: "Team", icon: Users },
  ];

  const generalItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help & search", icon: HelpCircle },
    { id: "logout", label: "Log out", icon: LogOut },
  ];

  const handleBoardClick = (id: string) => {
    setActiveBoardId(id);
    if (onNavigateBoard) {
      onNavigateBoard(id);
    }
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
          <div className="flex items-center gap-2.5">
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
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-colors"
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
              <button className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            {sidebarBoards.map((board) => {
              const isActive = activeBoardId === board.id;
              return (
                <button
                  key={board.id}
                  onClick={() => handleBoardClick(board.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                    isActive
                      ? "bg-emerald-50 text-emerald-950 font-semibold"
                      : "text-slate-600 font-medium hover:bg-slate-100/70 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold shrink-0",
                        board.iconBg,
                        board.iconTextColor
                      )}
                    >
                      {board.iconLetter}
                    </span>
                    <span className="truncate">{board.name}</span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-medium shrink-0",
                      isActive
                        ? "bg-emerald-200/60 text-emerald-900"
                        : "text-slate-400"
                    )}
                  >
                    {board.count}
                  </span>
                </button>
              );
            })}
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
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-colors"
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
            <AvatarFallback className="bg-[#5c232f] text-rose-100 text-xs font-bold">
              {currentUser.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 leading-none">
            <span className="text-xs font-bold text-slate-900 truncate">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-slate-400 truncate mt-0.5">
              {currentUser.email}
            </span>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
