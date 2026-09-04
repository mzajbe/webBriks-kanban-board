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
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search tasks"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 h-9 bg-white text-xs text-slate-700 shadow-2xs border-slate-200 focus-visible:ring-emerald-600 rounded-full"
          />
        </div>

        {/* Priority Filter Pill Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="pill" size="pillSm" className="gap-1.5 text-xs text-slate-700">
              <span>
                {selectedPriority === "ALL" ? "All priorities" : selectedPriority}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem onClick={() => onPriorityChange("ALL")}>
              All priorities
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange("URGENT")}>
              <span className="h-2 w-2 rounded-full bg-rose-500 mr-2" /> URGENT
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange("HIGH")}>
              <span className="h-2 w-2 rounded-full bg-amber-500 mr-2" /> HIGH
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange("MEDIUM")}>
              <span className="h-2 w-2 rounded-full bg-amber-600 mr-2" /> MEDIUM
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPriorityChange("LOW")}>
              <span className="h-2 w-2 rounded-full bg-sky-500 mr-2" /> LOW
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Assignee Filter Pill Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="pill" size="pillSm" className="gap-1.5 text-xs text-slate-700">
              <span>{selectedAssigneeName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => onAssigneeChange("ALL")}>
              All assignees
            </DropdownMenuItem>
            {members.map((member) => (
              <DropdownMenuItem key={member.id} onClick={() => onAssigneeChange(member.id)}>
                <span className="font-semibold text-slate-900 mr-1.5">{member.name}</span>
                {member.isOwner && (
                  <span className="text-[10px] text-emerald-800 font-medium">(Owner)</span>
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
            className="h-8 rounded-full px-2.5 text-xs text-slate-500 hover:text-slate-900"
          >
            <X className="h-3.5 w-3.5 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Right side: Task count badge & Add Task Button */}
      <div className="flex items-center justify-end gap-2.5">
        <Badge variant="pill" className="bg-slate-100 text-slate-600 border border-slate-200/80 px-3 py-1 font-medium text-xs">
          {totalTaskCount} tasks
        </Badge>
        {onAddTask && (
          <Button
            onClick={onAddTask}
            disabled={isAddDisabled}
            className="bg-[#1b4332] hover:bg-[#143627] text-white rounded-xl text-xs font-semibold gap-1.5 h-8 px-3 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add task</span>
          </Button>
        )}
      </div>
    </div>
  );
}
