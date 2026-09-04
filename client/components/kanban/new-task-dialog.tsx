"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task, TaskPriority } from "@/types/task";
import { Column } from "@/types/column";
import { BoardMemberUser } from "@/types/board";
import { createTask, updateTask } from "@/lib/api/tasks";
import { ApiError } from "@/lib/api/client";

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
  columns: Column[];
  members: BoardMemberUser[];
  defaultColumnId?: string;
  taskToEdit?: Task | null;
  onTaskCreated?: (newTask: Task) => void;
  onTaskUpdated?: (updatedTask: Task) => void;
}

export function NewTaskDialog({
  open,
  onOpenChange,
  boardId,
  columns,
  members,
  defaultColumnId = "",
  taskToEdit = null,
  onTaskCreated,
  onTaskUpdated,
}: NewTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [columnId, setColumnId] = useState<string>(defaultColumnId);
  const [assigneeId, setAssigneeId] = useState<string>("unassigned");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority || "MEDIUM");
      setColumnId(taskToEdit.columnId);
      setAssigneeId(taskToEdit.assignee ? taskToEdit.assignee.id : "unassigned");
      if (taskToEdit.dueDate) {
        try {
          const d = new Date(taskToEdit.dueDate);
          setDueDate(!isNaN(d.getTime()) ? d.toISOString().split("T")[0] : taskToEdit.dueDate);
        } catch {
          setDueDate(taskToEdit.dueDate);
        }
      } else {
        setDueDate("");
      }
    } else {
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setColumnId(defaultColumnId || columns[0]?.id || "");
      setAssigneeId("unassigned");
      setDueDate("");
    }
  }, [taskToEdit, defaultColumnId, columns, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    try {
      setIsSubmitting(true);
      const formattedDueDate = dueDate.trim() ? new Date(dueDate.trim()).toISOString() : null;
      const targetAssigneeId = assigneeId === "unassigned" ? null : assigneeId;

      if (taskToEdit) {
        // Edit existing task
        const res = await updateTask(taskToEdit.id, {
          title: trimmedTitle,
          description: description.trim() || null,
          priority,
          assigneeId: targetAssigneeId,
          dueDate: formattedDueDate,
        });

        if (res.data) {
          toast.success("Task updated successfully");
          onTaskUpdated && onTaskUpdated(res.data);
          onOpenChange(false);
        }
      } else {
        // Create new task
        const targetColumnId = columnId || defaultColumnId || columns[0]?.id;
        if (!targetColumnId) {
          toast.error("Please select a column for the task");
          return;
        }

        const res = await createTask(boardId, {
          columnId: targetColumnId,
          title: trimmedTitle,
          description: description.trim() || null,
          priority,
          assigneeId: targetAssigneeId,
          dueDate: formattedDueDate,
        });

        if (res.data) {
          toast.success("Task created successfully");
          onTaskCreated && onTaskCreated(res.data);
          onOpenChange(false);
        }
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error(taskToEdit ? "Failed to update task" : "Failed to create task");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">
            {taskToEdit ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Implement authentication module"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg text-xs"
              disabled={isSubmitting}
              autoFocus
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Description</label>
            <textarea
              rows={3}
              placeholder="Add task description or acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Priority */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                disabled={isSubmitting}
                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 cursor-pointer"
              >
                <option value="URGENT">URGENT</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            {/* Column Selection (Only in Create Mode) */}
            {!taskToEdit ? (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Column</label>
                <select
                  value={columnId}
                  onChange={(e) => setColumnId(e.target.value)}
                  disabled={isSubmitting}
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 cursor-pointer"
                >
                  {columns.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Due Date</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={isSubmitting}
                  className="rounded-lg text-xs"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Assignee */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                disabled={isSubmitting}
                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 cursor-pointer"
              >
                <option value="unassigned">Unassigned</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} {member.isOwner ? "(Owner)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date (Create mode) */}
            {!taskToEdit && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Due Date</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={isSubmitting}
                  className="rounded-lg text-xs"
                />
              </div>
            )}
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#1b4332] hover:bg-[#143627] text-white"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {taskToEdit ? "Saving..." : "Creating..."}
                </>
              ) : taskToEdit ? (
                "Save Changes"
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
