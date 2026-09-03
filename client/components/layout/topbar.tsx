"use client";

import React from "react";
import {
  Search,
  Activity,
  Users,
  FileText,
  Sparkles,
  Bell,
  Plus,
  ChevronDown,
  Menu,
} from "lucide-react";
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
import { currentUser } from "@/data/mock-board";

interface TopbarProps {
  onOpenMobileSidebar?: () => void;
  onNewTaskClick?: () => void;
}

export function Topbar({ onOpenMobileSidebar, onNewTaskClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 md:px-6 backdrop-blur-md">
      {/* Left side: Mobile menu button + Title & Subtitle */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-8 w-8 rounded-lg"
          onClick={onOpenMobileSidebar}
        >
          <Menu className="h-4 w-4 text-slate-600" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900 truncate">
              Product Roadmap
            </h1>
          </div>
          <p className="hidden sm:block text-xs text-slate-400 truncate">
            Quarterly planning, OKRs and feature prioritization.
          </p>
        </div>
      </div>

      {/* Right side: Search, indicators, actions, user profile */}
      <div className="flex items-center gap-2 md:gap-2.5">
        {/* Global Search Pill Bar (Desktop) */}
        <div className="hidden xl:flex items-center gap-2 rounded-full border border-slate-200/90 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-300 transition-colors w-52 cursor-pointer">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate flex-1 text-[11px]">Search tasks, boards...</span>
          <kbd className="hidden sm:inline-flex h-4 items-center rounded border border-slate-200 bg-white px-1 text-[9px] font-medium text-slate-400">
            ⌘K
          </kbd>
        </div>

        {/* Viewing Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400">
          <span className="text-[11px]">Viewing</span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold">
            DS
          </div>
        </div>

        {/* Icon Actions */}
        <div className="hidden md:flex items-center gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <Activity className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <Users className="h-4 w-4" />
          </button>
        </div>

        {/* Action Pill Buttons */}
        <div className="flex items-center gap-1.5">
          <Button variant="pill" size="pillSm" className="hidden sm:inline-flex gap-1.5">
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            <span>Summary</span>
          </Button>

          <Button variant="darkPill" size="pillSm" className="bg-[#1b4332] hover:bg-[#143627] gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span className="hidden xs:inline">AI tasks</span>
          </Button>

          {/* Notification Icon */}
          <button className="relative flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>

          {/* New Board / Task Button */}
          <Button
            variant="darkPill"
            size="pillSm"
            onClick={onNewTaskClick}
            className="bg-[#1b4332] hover:bg-[#143627] gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden md:inline">New board</span>
            <span className="md:hidden">New</span>
          </Button>
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 rounded-full p-1 hover:bg-slate-100 transition-colors outline-none cursor-pointer">
              <Avatar className="h-7 w-7 border-0">
                <AvatarFallback className="bg-[#5c232f] text-rose-100 text-[11px] font-bold">
                  {currentUser.initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-xs font-semibold text-slate-700">
                Alex
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <p className="font-semibold text-slate-900">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 font-normal">{currentUser.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Workspace Members</DropdownMenuItem>
            <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-600 focus:text-rose-700">
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
