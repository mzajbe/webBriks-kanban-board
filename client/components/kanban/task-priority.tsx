import React from "react";
import { TaskPriority as PriorityType } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskPriorityProps {
  priority: PriorityType;
  className?: string;
}

export function TaskPriority({ priority, className }: TaskPriorityProps) {
  const configs: Record<PriorityType, { label: string; dot: string; text: string }> = {
    URGENT: {
      label: "URGENT",
      dot: "bg-rose-500",
      text: "text-rose-700 dark:text-rose-400",
    },
    HIGH: {
      label: "HIGH",
      dot: "bg-amber-500",
      text: "text-amber-700 dark:text-amber-400",
    },
    MEDIUM: {
      label: "MEDIUM",
      dot: "bg-amber-600",
      text: "text-amber-800 dark:text-amber-300",
    },
    LOW: {
      label: "LOW",
      dot: "bg-sky-500",
      text: "text-sky-700 dark:text-sky-400",
    },
  };

  const config = configs[priority] || configs.LOW;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
      <span className={cn("text-[10px] font-bold tracking-wider uppercase", config.text)}>
        {config.label}
      </span>
    </div>
  );
}
