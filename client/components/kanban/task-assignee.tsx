import React from "react";
import { TaskAssigneeUser } from "@/types/task";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TaskAssigneeProps {
  assignee?: TaskAssigneeUser | null;
  className?: string;
}

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function TaskAssignee({ assignee, className }: TaskAssigneeProps) {
  if (!assignee) {
    return (
      <span className={cn("text-[11px] font-normal text-slate-400 dark:text-slate-500 select-none", className)}>
        Unassigned
      </span>
    );
  }

  const initials = assignee.initials || getInitials(assignee.name);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-1.5 cursor-pointer group", className)}>
            <Avatar className="h-6 w-6 border-0">
              <AvatarFallback
                className={cn(
                  "text-[10px] font-bold",
                  assignee.color || "bg-[#1b4332] text-white"
                )}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors truncate max-w-[120px]">
              {assignee.name}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{assignee.name} {assignee.email ? `(${assignee.email})` : ""}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
