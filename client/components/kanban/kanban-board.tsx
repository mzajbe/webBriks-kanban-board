"use client";

import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { ColumnId, Priority, Task } from "@/types/kanban";
import { initialBoard } from "@/data/mock-board";
import { BoardToolbar } from "@/components/kanban/board-toolbar";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { NewTaskDialog } from "@/components/kanban/new-task-dialog";

interface KanbanBoardProps {
  isNewTaskDialogOpen?: boolean;
  onNewTaskDialogChange?: (open: boolean) => void;
}

export function KanbanBoard({ isNewTaskDialogOpen = false, onNewTaskDialogChange }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialBoard.tasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority | "ALL">("ALL");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | "ALL">("ALL");

  // Dialog state
  const [localDialogOpen, setLocalDialogOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<ColumnId>("todo");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const isDialogOpen = isNewTaskDialogOpen || localDialogOpen;

  const handleOpenChange = (open: boolean) => {
    setLocalDialogOpen(open);
    if (onNewTaskDialogChange) {
      onNewTaskDialogChange(open);
    }
    if (!open) {
      setEditingTask(null);
    }
  };

  // Filter tasks based on search, priority, assignee
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search Query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Priority filter
      if (selectedPriority !== "ALL" && task.priority !== selectedPriority) {
        return false;
      }

      // Assignee filter
      if (selectedAssigneeId !== "ALL") {
        if (!task.assignee || task.assignee.id !== selectedAssigneeId) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, searchQuery, selectedPriority, selectedAssigneeId]);

  // Handle adding or updating task
  const handleSaveTask = (taskData: Omit<Task, "id"> & { id?: string }) => {
    if (taskData.id) {
      // Update existing task
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? ({ ...t, ...taskData } as Task) : t))
      );
    } else {
      // Create new task
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        columnId: taskData.columnId,
        assignee: taskData.assignee,
        dueDate: taskData.dueDate,
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  // Handle moving task to target column
  const handleMoveColumn = (taskId: string, targetColId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, columnId: targetColId as ColumnId } : t))
    );
  };

  // Handle deleting task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Open dialog to create task in column
  const handleOpenAddTask = (colId: string) => {
    setEditingTask(null);
    setTargetColumnId(colId as ColumnId);
    handleOpenChange(true);
  };

  // Open dialog to edit task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTargetColumnId(task.columnId);
    handleOpenChange(true);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#F8FAFC]">
      {/* Board Toolbar */}
      <BoardToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedAssigneeId={selectedAssigneeId}
        onAssigneeChange={setSelectedAssigneeId}
        totalTaskCount={filteredTasks.length}
      />

      {/* Columns Container - Scrollable horizontal view */}
      <div className="flex-1 overflow-x-auto px-4 md:px-6 pb-6 pt-2 custom-scrollbar">
        <div className="flex items-start gap-4 md:gap-5 min-w-max">
          {initialBoard.columns.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.columnId === col.id);
            return (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={columnTasks}
                onAddTask={handleOpenAddTask}
                onMoveColumn={handleMoveColumn}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
              />
            );
          })}

          {/* Add Column Container Button */}
          <div className="flex w-64 shrink-0 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/90 bg-slate-50/50 p-6 text-slate-400 hover:border-slate-300 hover:bg-slate-100/50 hover:text-slate-600 transition-all cursor-pointer min-h-[140px]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-2xs border border-slate-200 mb-2">
              <Plus className="h-4 w-4 text-slate-500" />
            </div>
            <span className="text-xs font-semibold text-slate-600">Add column</span>
          </div>
        </div>
      </div>

      {/* Dialog for creating/editing tasks */}
      <NewTaskDialog
        open={isDialogOpen}
        onOpenChange={handleOpenChange}
        defaultColumnId={targetColumnId}
        taskToEdit={editingTask}
        onSaveTask={handleSaveTask}
      />
    </div>
  );
}
