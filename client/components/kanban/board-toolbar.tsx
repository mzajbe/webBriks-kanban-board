"use client";

import React from "react";
import { Search, ChevronDown, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskPriority } from "@/types/task";
import { BoardMemberUser } from "@/types/board";

interface BoardToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPriority: TaskPriority | "ALL";
  onPriorityChange: (priority: TaskPriority | "ALL") => void;
  selectedAssigneeId: string | "ALL";
  onAssigneeChange: (assigneeId: string | "ALL") => void;
  totalTaskCount: number;
  members?: BoardMemberUser[];
  onAddTask?: () => void;
  isAddDisabled?: boolean;
}

export function BoardToolbar({
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  selectedAssigneeId,
  onAssigneeChange,
  totalTaskCount,
  members = [],
  onAddTask,
  isAddDisabled = false,
}: BoardToolbarProps) {
  const selectedAssigneeName =
    selectedAssigneeId === "ALL"
      ? "All assignees"
      : members.find((m) => m.id === selectedAssigneeId)?.name || "All assignees";

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedPriority !== "ALL" || selectedAssigneeId !== "ALL";

  const clearFilters = () => {
    onSearchChange("");
    onPriorityChange("ALL");
    onAssigneeChange("ALL");
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 md:px-6 py-4">
      {/* Left side: Search input & Pill filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative min-w-[200px] max-w-xs flex-1 sm:flex-none">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            type="text"
            placeholder="Search tasks"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 h-9 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-200 shadow-2xs border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-600 rounded-full"
          />
        </div>

        {/* Priority Filter Pill Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="pill" size="pillSm" className="gap-1.5 text-xs text-slate-700 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800">
              <span>
                {selectedPriority === "ALL" ? "All priorities" : selectedPriority}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40 dark:bg-slate-900 dark:border-slate-800">
            <DropdownMenuItem onClick={() => onPriorityChange("ALL")} className="dark:focus:bg-slate-800 dark:focus:text-slate-100">
              All priorities
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange("URGENT")} className="dark:focus:bg-slate-800 dark:focus:text-slate-100">
              <span className="h-2 w-2 rounded-full bg-rose-500 mr-2" /> URGENT
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange("HIGH")} className="dark:focus:bg-slate-800 dark:focus:text-slate-100">
              <span className="h-2 w-2 rounded-full bg-amber-500 mr-2" /> HIGH
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange("MEDIUM")} className="dark:focus:bg-slate-800 dark:focus:text-slate-100">
              <span className="h-2 w-2 rounded-full bg-amber-600 mr-2" /> MEDIUM
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange("LOW")} className="dark:focus:bg-slate-800 dark:focus:text-slate-100">
              <span className="h-2 w-2 rounded-full bg-sky-500 mr-2" /> LOW
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Assignee Filter Pill Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="pill" size="pillSm" className="gap-1.5 text-xs text-slate-700 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800">
              <span>{selectedAssigneeName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 dark:bg-slate-900 dark:border-slate-800">
            <DropdownMenuItem onClick={() => onAssigneeChange("ALL")} className="dark:focus:bg-slate-800 dark:focus:text-slate-100">
              All assignees
            </DropdownMenuItem>
            {members.map((member) => (
              <DropdownMenuItem key={member.id} onClick={() => onAssigneeChange(member.id)} className="dark:focus:bg-slate-800 dark:focus:text-slate-100">
                <span className="font-semibold text-slate-900 dark:text-slate-100 mr-1.5">{member.name}</span>
                {member.isOwner && (
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium">(Owner)</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reset Filters button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 rounded-full px-2.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <X className="h-3.5 w-3.5 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Right side: Task count badge & Add Task Button */}
      <div className="flex items-center justify-end gap-2.5">
        <Badge variant="pill" className="bg-slate-100 text-slate-600 border border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/80 px-3 py-1 font-medium text-xs">
          {totalTaskCount} tasks
        </Badge>
        {onAddTask && (
          <Button
            onClick={onAddTask}
            disabled={isAddDisabled}
            className="bg-[#1b4332] hover:bg-[#143627] dark:bg-emerald-800 dark:hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold gap-1.5 h-8 px-3 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add task</span>
          </Button>
        )}
      </div>
    </div>
  );
}
