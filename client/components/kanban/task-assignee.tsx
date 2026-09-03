import React from "react";
import { User } from "@/types/kanban";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TaskAssigneeProps {
  assignee?: User;
  className?: string;
}

export function TaskAssignee({ assignee, className }: TaskAssigneeProps) {
  if (!assignee) {
    return (
      <span className={cn("text-[11px] font-normal text-slate-400 select-none", className)}>
        Unassigned
      </span>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-1.5 cursor-pointer group", className)}>
            <Avatar className="h-6 w-6 border-0">
              <AvatarFallback
                className={cn(
                  "text-[10px] font-bold",
                  assignee.color || "bg-slate-700 text-white"
                )}
              >
                {assignee.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
              {assignee.name}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{assignee.name} ({assignee.email})</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
