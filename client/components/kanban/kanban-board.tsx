"use client";

import React, { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  CollisionDetection,
  pointerWithin,
  rectIntersection,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Column, ColumnId, Priority, Task } from "@/types/kanban";
import { initialBoard } from "@/data/mock-board";
import { BoardToolbar } from "@/components/kanban/board-toolbar";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { TaskCard } from "@/components/kanban/task-card";
import { NewTaskDialog } from "@/components/kanban/new-task-dialog";
import { RenameColumnDialog } from "@/components/kanban/rename-column-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface KanbanBoardProps {
  isNewTaskDialogOpen?: boolean;
  onNewTaskDialogChange?: (open: boolean) => void;
}

export function KanbanBoard({
  isNewTaskDialogOpen = false,
  onNewTaskDialogChange,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(initialBoard.columns);
  const [tasks, setTasks] = useState<Task[]>(initialBoard.tasks);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority | "ALL">("ALL");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | "ALL">("ALL");

  // Drag Overlay state
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Dialog & Modal state
  const [localDialogOpen, setLocalDialogOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<ColumnId>("todo");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Delete Task confirmation modal state
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Rename Column modal state
  const [renamingColumn, setRenamingColumn] = useState<Column | null>(null);

  // Delete Column confirmation modal state
  const [deletingColumn, setDeletingColumn] = useState<Column | null>(null);

  const isDialogOpen = isNewTaskDialogOpen || localDialogOpen;

  // Crisp mouse pointer sensor with low activation constraint (3px)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleOpenChange = (open: boolean) => {
    setLocalDialogOpen(open);
    if (onNewTaskDialogChange) {
      onNewTaskDialogChange(open);
    }
    if (!open) {
      setEditingTask(null);
    }
  };

  // Helper function to re-calculate sequential positions for tasks in a column
  const updateTaskPositions = (taskList: Task[]): Task[] => {
    const colTaskMap: Record<string, Task[]> = {};
    columns.forEach((col) => {
      colTaskMap[col.id] = [];
    });

    // Group tasks by columnId preserving current array order
    taskList.forEach((task) => {
      if (!colTaskMap[task.columnId]) {
        colTaskMap[task.columnId] = [];
      }
      colTaskMap[task.columnId].push(task);
    });

    // Re-index positions
    const result: Task[] = [];
    Object.keys(colTaskMap).forEach((colId) => {
      colTaskMap[colId].forEach((task, index) => {
        result.push({
          ...task,
          position: index,
        });
      });
    });

    return result;
  };

  // Custom collision detection strategy optimal for multi-column Kanban boards
  const customCollisionDetection: CollisionDetection = (args) => {
    // 1. First check if mouse pointer is inside any card or column container
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    // 2. Fall back to rectIntersection for bounding box overlaps
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) {
      return rectCollisions;
    }

    // 3. Final fallback to closestCorners
    return closestCorners(args);
  };

  // Filter tasks based on search, priority, assignee
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
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
      })
      .sort((a, b) => a.position - b.position);
  }, [tasks, searchQuery, selectedPriority, selectedAssigneeId]);

  // ----------------------------------------------------
  // Drag & Drop Handlers (@dnd-kit)
  // ----------------------------------------------------

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    const isOverColumn = columns.some((col) => col.id === overId);
    const overTaskItem = tasks.find((t) => t.id === overId);

    // Scenario A: Dragged over a column background container
    if (isOverColumn) {
      const overColId = overId as ColumnId;
      if (activeTaskItem.columnId !== overColId) {
        setTasks((prev) => {
          const updated = prev.map((t) =>
            t.id === activeId ? { ...t, columnId: overColId } : t
          );
          return updateTaskPositions(updated);
        });
      }
      return;
    }

    // Scenario B: Dragged over another task card
    if (overTaskItem) {
      // B1: Moving across columns
      if (activeTaskItem.columnId !== overTaskItem.columnId) {
        setTasks((prev) => {
          const activeIndex = prev.findIndex((t) => t.id === activeId);
          const overIndex = prev.findIndex((t) => t.id === overId);

          const updated = prev.map((t, idx) => {
            if (idx === activeIndex) {
              return { ...t, columnId: overTaskItem.columnId };
            }
            return t;
          });

          return updateTaskPositions(arrayMove(updated, activeIndex, overIndex));
        });
      } else {
        // B2: Reordering within the same column in real time
        setTasks((prev) => {
          const oldIndex = prev.findIndex((t) => t.id === activeId);
          const newIndex = prev.findIndex((t) => t.id === overId);
          return updateTaskPositions(arrayMove(prev, oldIndex, newIndex));
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    // Ensure final positions are clean and calculated
    setTasks((prev) => {
      const updated = updateTaskPositions(prev);
      const finalTask = updated.find((t) => t.id === activeId);
      const targetCol = columns.find((c) => c.id === finalTask?.columnId);

      toast.success(
        `Task moved to ${targetCol?.title || "column"} (position ${finalTask?.position ?? 0})`
      );
      return updated;
    });
  };

  // ----------------------------------------------------
  // Task CRUD Handlers
  // ----------------------------------------------------

  const handleSaveTask = (taskData: Omit<Task, "id" | "position"> & { id?: string }) => {
    if (taskData.id) {
      // Edit existing task
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? ({ ...t, ...taskData } as Task) : t))
      );
      toast.success("Task updated successfully");
    } else {
      // Create new task
      const columnTasks = tasks.filter((t) => t.columnId === taskData.columnId);
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        columnId: taskData.columnId,
        position: columnTasks.length,
        assignee: taskData.assignee,
        dueDate: taskData.dueDate,
      };
      setTasks((prev) => [newTask, ...prev]);
      toast.success("New task created");
    }
  };

  const handleMoveColumn = (taskId: string, targetColId: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === taskId ? { ...t, columnId: targetColId as ColumnId } : t
      );
      return updateTaskPositions(updated);
    });
    const colName = columns.find((c) => c.id === targetColId)?.title || "column";
    toast.success(`Moved task to ${colName}`);
  };

  const confirmDeleteTask = () => {
    if (!deletingTask) return;
    setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
    toast.success(`Deleted task "${deletingTask.title.slice(0, 20)}..."`);
    setDeletingTask(null);
  };

  // ----------------------------------------------------
  // Column Actions (Rename / Delete / Add Column)
  // ----------------------------------------------------

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, title: newTitle } : col))
    );
    toast.success(`Renamed column to "${newTitle}"`);
  };

  const handleDeleteColumnRequest = (col: Column) => {
    const colTasks = tasks.filter((t) => t.columnId === col.id);
    if (colTasks.length > 0) {
      toast.error(
        `Cannot delete "${col.title}" column because it contains ${colTasks.length} task(s). Move or delete tasks first.`
      );
    } else {
      setDeletingColumn(col);
    }
  };

  const confirmDeleteColumn = () => {
    if (!deletingColumn) return;
    setColumns((prev) => prev.filter((c) => c.id !== deletingColumn.id));
    toast.success(`Column "${deletingColumn.title}" deleted`);
    setDeletingColumn(null);
  };

  const handleAddColumn = () => {
    const colNumber = columns.length + 1;
    const newColId = `col-${Date.now()}`;
    const newCol: Column = {
      id: newColId,
      title: `New Column ${colNumber}`,
      dotColor: "bg-slate-500",
      bgTint: "bg-slate-50/60",
      borderTint: "border-slate-200/70",
      badgeBg: "bg-slate-100",
      badgeText: "text-slate-700",
    };
    setColumns((prev) => [...prev, newCol]);
    toast.success(`Added "New Column ${colNumber}"`);
  };

  // Dialog triggers
  const handleOpenAddTask = (colId: string) => {
    setEditingTask(null);
    setTargetColumnId(colId);
    handleOpenChange(true);
  };

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

      {/* Columns Container with DndContext */}
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto px-4 md:px-6 pb-6 pt-2 custom-scrollbar">
          <div className="flex items-start gap-4 md:gap-5 min-w-max">
            {columns.map((col) => {
              const columnTasks = filteredTasks.filter((t) => t.columnId === col.id);
              return (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  tasks={columnTasks}
                  onAddTask={handleOpenAddTask}
                  onMoveColumn={handleMoveColumn}
                  onDeleteTask={(t) => setDeletingTask(t)}
                  onEditTask={handleEditTask}
                  onRenameColumn={(c) => setRenamingColumn(c)}
                  onDeleteColumn={handleDeleteColumnRequest}
                />
              );
            })}

            {/* Add Column Button */}
            <div
              onClick={handleAddColumn}
              className="flex w-64 shrink-0 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/90 bg-slate-50/50 p-6 text-slate-400 hover:border-slate-300 hover:bg-slate-100/50 hover:text-slate-600 transition-all cursor-pointer min-h-[140px]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-2xs border border-slate-200 mb-2">
                <Plus className="h-4 w-4 text-slate-500" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Add column</span>
            </div>
          </div>
        </div>

        {/* Drag Overlay preview */}
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* Dialog for creating/editing tasks */}
      <NewTaskDialog
        open={isDialogOpen}
        onOpenChange={handleOpenChange}
        defaultColumnId={targetColumnId}
        taskToEdit={editingTask}
        onSaveTask={handleSaveTask}
      />

      {/* Dialog for renaming columns */}
      <RenameColumnDialog
        open={!!renamingColumn}
        onOpenChange={(open) => !open && setRenamingColumn(null)}
        column={renamingColumn}
        onRenameColumn={handleRenameColumn}
      />

      {/* Confirmation AlertDialog for deleting task */}
      <AlertDialog open={!!deletingTask} onOpenChange={(open) => !open && setDeletingTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation AlertDialog for deleting empty column */}
      <AlertDialog open={!!deletingColumn} onOpenChange={(open) => !open && setDeletingColumn(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Column</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete column &quot;{deletingColumn?.title}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteColumn}>Delete Column</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
