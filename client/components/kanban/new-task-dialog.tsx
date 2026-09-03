"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColumnId, Priority, Task } from "@/types/kanban";
import { teamMembers } from "@/data/mock-board";

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultColumnId?: ColumnId;
  taskToEdit?: Task | null;
  onSaveTask: (taskData: Omit<Task, "id" | "position"> & { id?: string }) => void;
}

export function NewTaskDialog({
  open,
  onOpenChange,
  defaultColumnId = "todo",
  taskToEdit = null,
  onSaveTask,
}: NewTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("HIGH");
  const [columnId, setColumnId] = useState<ColumnId>(defaultColumnId);
  const [assigneeId, setAssigneeId] = useState<string>("unassigned");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority);
      setColumnId(taskToEdit.columnId);
      setAssigneeId(taskToEdit.assignee ? taskToEdit.assignee.id : "unassigned");
      setDueDate(taskToEdit.dueDate || "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("HIGH");
      setColumnId(defaultColumnId);
      setAssigneeId("unassigned");
      setDueDate("");
    }
  }, [taskToEdit, defaultColumnId, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignee =
      assigneeId === "unassigned"
        ? undefined
        : teamMembers.find((m) => m.id === assigneeId);

    onSaveTask({
      id: taskToEdit ? taskToEdit.id : undefined,
      title: title.trim(),
      description: description.trim(),
      priority,
      columnId,
      assignee,
      dueDate: dueDate.trim() || undefined,
    });

    onOpenChange(false);
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
              placeholder="e.g. Implement Shipping Address & Method Selection"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg text-xs"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Description</label>
            <textarea
              rows={3}
              placeholder="Add key details or acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Priority */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 cursor-pointer"
              >
                <option value="URGENT">URGENT</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            {/* Column Status */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value as ColumnId)}
                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 cursor-pointer"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Assignee */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 cursor-pointer"
              >
                <option value="unassigned">Unassigned</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Due Date</label>
              <Input
                type="text"
                placeholder="e.g. Jul 24 or Tomorrow"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded-lg text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="emerald" size="sm" className="bg-[#1b4332] hover:bg-[#143627]">
              {taskToEdit ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
