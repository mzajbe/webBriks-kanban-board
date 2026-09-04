"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Loader2, Columns3, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  pointerWithin,
  CollisionDetection,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { Column } from "@/types/column";
import { Task, TaskPriority } from "@/types/task";
import { getColumns, deleteColumn } from "@/lib/api/columns";
import { getTasks, deleteTask, moveTask } from "@/lib/api/tasks";
import { ApiError } from "@/lib/api/client";
import { useBoards } from "@/hooks/use-boards";
import { BoardToolbar } from "@/components/kanban/board-toolbar";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { TaskCard } from "@/components/kanban/task-card";
import { NewTaskDialog } from "@/components/kanban/new-task-dialog";
import { RenameColumnDialog } from "@/components/kanban/rename-column-dialog";
import { CreateColumnDialog } from "@/components/kanban/create-column-dialog";
import { Button } from "@/components/ui/button";
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
  boardId?: string;
  isNewTaskDialogOpen?: boolean;
  onNewTaskDialogChange?: (open: boolean) => void;
}

export function KanbanBoard({
  boardId: propBoardId,
  isNewTaskDialogOpen = false,
  onNewTaskDialogChange,
}: KanbanBoardProps) {
  const { activeBoard, members } = useBoards();
  const effectiveBoardId = propBoardId || activeBoard?.id;

  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [boardError, setBoardError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | "ALL">("ALL");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | "ALL">("ALL");

  // DND state
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  // Filter check
  const isFilterActive =
    searchQuery.trim() !== "" ||
    selectedPriority !== "ALL" ||
    selectedAssigneeId !== "ALL";

  // DND sensors: distance: 5 allows normal clicks/dropdown actions without accidental drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Collision detection prioritizing tasks over column containers
  const collisionDetection: CollisionDetection = useCallback((args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      const taskCollision = pointerCollisions.find(
        (c) => c.data?.droppableContainer?.data?.current?.type === "task"
      );
      if (taskCollision) return [taskCollision];
      return pointerCollisions;
    }
    return closestCorners(args);
  }, []);

  // Task Dialog & Modal state
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<string>("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Column Dialog states
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [renamingColumn, setRenamingColumn] = useState<Column | null>(null);
  const [deletingColumn, setDeletingColumn] = useState<Column | null>(null);
  const [isDeletingColumn, setIsDeletingColumn] = useState(false);

  // Delete Task confirmation modal state
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  const isDialogOpen = isNewTaskDialogOpen || isTaskDialogOpen;

  const handleOpenTaskDialogChange = (open: boolean) => {
    setIsTaskDialogOpen(open);
    if (onNewTaskDialogChange) {
      onNewTaskDialogChange(open);
    }
    if (!open) {
      setEditingTask(null);
    }
  };

  // Fetch columns and tasks from backend
  const fetchBoardData = useCallback(async (boardId: string) => {
    try {
      setIsLoading(true);
      setBoardError(null);

      const [columnsRes, tasksRes] = await Promise.all([
        getColumns(boardId),
        getTasks(boardId),
      ]);

      const loadedColumns = (columnsRes.data || []).sort(
        (a, b) => a.position - b.position
      );
      const loadedTasks = (tasksRes.data || []).sort(
        (a, b) => a.position - b.position
      );

      setColumns(loadedColumns);
      setTasks(loadedTasks);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to load board data";
      setBoardError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (effectiveBoardId) {
      fetchBoardData(effectiveBoardId);
    } else {
      setColumns([]);
      setTasks([]);
      setIsLoading(false);
    }
  }, [effectiveBoardId, fetchBoardData]);

  // Filter tasks based on search, priority, assignee
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter: title & description
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc =
          task.description?.toLowerCase().includes(query) || false;
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

  // ----------------------------------------------------
  // Task Handlers (Real Backend API)
  // ----------------------------------------------------

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const confirmDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      setIsDeletingTask(true);
      await deleteTask(deletingTask.id);
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      toast.success("Task deleted successfully");
      setDeletingTask(null);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to delete task");
      }
    } finally {
      setIsDeletingTask(false);
    }
  };

  const handleOpenAddTask = (colId?: string) => {
    setEditingTask(null);
    setTargetColumnId(colId || columns[0]?.id || "");
    handleOpenTaskDialogChange(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTargetColumnId(task.columnId);
    handleOpenTaskDialogChange(true);
  };

  // ----------------------------------------------------
  // Column Actions (Real Backend API)
  // ----------------------------------------------------

  const handleColumnCreated = (newColumn: Column) => {
    setColumns((prev) => [...prev, newColumn]);
  };

  const handleColumnRenamed = (updatedColumn: Column) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === updatedColumn.id ? updatedColumn : col))
    );
  };

  const confirmDeleteColumn = async () => {
    if (!deletingColumn) return;
    try {
      setIsDeletingColumn(true);
      await deleteColumn(deletingColumn.id);
      setColumns((prev) => prev.filter((c) => c.id !== deletingColumn.id));
      // Remove tasks associated with this column locally
      setTasks((prev) => prev.filter((t) => t.columnId !== deletingColumn.id));
      toast.success(`Column "${deletingColumn.name}" deleted successfully`);
      setDeletingColumn(null);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to delete column");
      }
    } finally {
      setIsDeletingColumn(false);
    }
  };

  // ----------------------------------------------------
  // Drag and Drop Handlers (@dnd-kit)
  // ----------------------------------------------------

  const handleDragStart = (event: DragStartEvent) => {
    if (isFilterActive) return;
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (isFilterActive) return;
    const { over } = event;
    if (!over) {
      setOverColumnId(null);
      return;
    }
    const overId = over.id as string;
    if (columns.some((c) => c.id === overId)) {
      setOverColumnId(overId);
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        setOverColumnId(overTask.columnId);
      } else {
        setOverColumnId(null);
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setOverColumnId(null);

    if (isFilterActive || !over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const draggedTask = tasks.find((t) => t.id === activeId);
    if (!draggedTask) return;

    const sourceColumnId = draggedTask.columnId;
    let targetColumnId: string;
    let targetPosition: number;

    const isOverColumn = columns.some((c) => c.id === overId);

    if (isOverColumn) {
      targetColumnId = overId;
      if (sourceColumnId === targetColumnId) {
        const colTasks = tasks
          .filter((t) => t.columnId === sourceColumnId)
          .sort((a, b) => a.position - b.position);
        const oldIndex = colTasks.findIndex((t) => t.id === activeId);
        const newIndex = colTasks.length - 1;
        if (oldIndex === newIndex) return;
        targetPosition = newIndex;
      } else {
        const targetTasks = tasks
          .filter((t) => t.columnId === targetColumnId && t.id !== activeId)
          .sort((a, b) => a.position - b.position);
        targetPosition = targetTasks.length;
      }
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) return;

      targetColumnId = overTask.columnId;

      if (sourceColumnId === targetColumnId) {
        const colTasks = tasks
          .filter((t) => t.columnId === sourceColumnId)
          .sort((a, b) => a.position - b.position);
        const oldIndex = colTasks.findIndex((t) => t.id === activeId);
        const newIndex = colTasks.findIndex((t) => t.id === overId);

        if (oldIndex === newIndex || oldIndex === -1 || newIndex === -1) return;

        targetPosition = newIndex;
      } else {
        const targetTasks = tasks
          .filter((t) => t.columnId === targetColumnId && t.id !== activeId)
          .sort((a, b) => a.position - b.position);
        const overIndexInTarget = targetTasks.findIndex((t) => t.id === overId);

        const isBelow = Boolean(
          active.rect.current.translated &&
          over.rect &&
          active.rect.current.translated.top > over.rect.top + over.rect.height / 2
        );

        targetPosition = isBelow ? overIndexInTarget + 1 : overIndexInTarget;
        targetPosition = Math.max(0, Math.min(targetPosition, targetTasks.length));
      }
    }

    // Save previous state for rollback
    const previousTasks = [...tasks];
    let nextTasks: Task[] = [];

    if (sourceColumnId === targetColumnId) {
      const colTasks = tasks
        .filter((t) => t.columnId === sourceColumnId)
        .sort((a, b) => a.position - b.position);
      const oldIndex = colTasks.findIndex((t) => t.id === activeId);

      const reordered = [...colTasks];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(targetPosition, 0, moved);

      const updatedColTasks = reordered.map((t, idx) => ({
        ...t,
        position: idx,
      }));

      const otherTasks = tasks.filter((t) => t.columnId !== sourceColumnId);
      nextTasks = [...otherTasks, ...updatedColTasks].sort(
        (a, b) => a.position - b.position
      );
    } else {
      const sourceTasks = tasks
        .filter((t) => t.columnId === sourceColumnId && t.id !== activeId)
        .sort((a, b) => a.position - b.position)
        .map((t, idx) => ({ ...t, position: idx }));

      const targetTasks = tasks
        .filter((t) => t.columnId === targetColumnId && t.id !== activeId)
        .sort((a, b) => a.position - b.position);

      const reorderedTarget = [...targetTasks];
      const movedTask: Task = {
        ...draggedTask,
        columnId: targetColumnId,
        position: targetPosition,
      };
      reorderedTarget.splice(targetPosition, 0, movedTask);

      const updatedTargetTasks = reorderedTarget.map((t, idx) => ({
        ...t,
        columnId: targetColumnId,
        position: idx,
      }));

      const otherTasks = tasks.filter(
        (t) => t.columnId !== sourceColumnId && t.columnId !== targetColumnId
      );

      nextTasks = [...otherTasks, ...sourceTasks, ...updatedTargetTasks].sort(
        (a, b) => a.position - b.position
      );
    }

    // Optimistic UI update
    setTasks(nextTasks);

    try {
      await moveTask(draggedTask.id, {
        targetColumnId,
        targetPosition,
      });
    } catch (err) {
      // Rollback on failure
      setTasks(previousTasks);
      const message =
        err instanceof ApiError ? err.message : "Failed to move task";
      toast.error(message);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-1 flex-col h-full overflow-hidden bg-[#F8FAFC]">
        {/* Board Toolbar */}
        <BoardToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          selectedAssigneeId={selectedAssigneeId}
          onAssigneeChange={setSelectedAssigneeId}
          totalTaskCount={filteredTasks.length}
          members={members}
          onAddTask={() => handleOpenAddTask()}
          isAddDisabled={columns.length === 0}
        />

        {/* Filter Warning Banner */}
        {isFilterActive && (
          <div className="flex items-center gap-2 px-4 md:px-6 py-2 bg-amber-50/90 border-b border-amber-200/70 text-amber-800 text-xs font-medium shrink-0">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Task reordering is disabled while search or filters are active to prevent position ambiguity.</span>
          </div>
        )}

        {/* Main Board Columns Area */}
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center bg-[#F8FAFC]">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-800" />
              <p className="text-xs font-semibold text-slate-500">Loading board...</p>
            </div>
          </div>
        ) : boardError ? (
          <div className="flex flex-1 items-center justify-center p-6 bg-[#F8FAFC]">
            <div className="flex flex-col items-center text-center max-w-sm p-8 rounded-3xl bg-white border border-rose-200/80 shadow-xs space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <AlertCircle className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Failed to load board</h3>
                <p className="text-xs text-slate-500">{boardError}</p>
              </div>
              {effectiveBoardId && (
                <Button
                  onClick={() => fetchBoardData(effectiveBoardId)}
                  className="bg-[#1b4332] hover:bg-[#143627] text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Retry
                </Button>
              )}
            </div>
          </div>
        ) : columns.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-6 bg-[#F8FAFC]">
            <div className="flex flex-col items-center text-center max-w-sm p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                <Columns3 className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No columns yet</h3>
                <p className="text-xs text-slate-500">
                  Get started by adding columns to organize your tasks and workflow.
                </p>
              </div>
              <Button
                onClick={() => setIsAddColumnDialogOpen(true)}
                className="bg-[#1b4332] hover:bg-[#143627] text-white rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add First Column</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto px-4 md:px-6 pb-6 pt-2 custom-scrollbar">
            <div className="flex items-start gap-4 md:gap-5 min-w-max">
              {columns.map((col, index) => {
                // Group and sort tasks by columnId and position ASC
                const columnTasks = filteredTasks
                  .filter((t) => t.columnId === col.id)
                  .sort((a, b) => a.position - b.position);

                return (
                  <KanbanColumn
                    key={col.id}
                    column={col}
                    columnIndex={index}
                    tasks={columnTasks}
                    isHighlighted={overColumnId === col.id}
                    isDragDisabled={isFilterActive}
                    onDeleteTask={(t) => setDeletingTask(t)}
                    onEditTask={handleEditTask}
                    onRenameColumn={(c) => setRenamingColumn(c)}
                    onDeleteColumn={(c) => setDeletingColumn(c)}
                  />
                );
              })}

              {/* Add Column Button */}
              <div
                onClick={() => setIsAddColumnDialogOpen(true)}
                className="flex w-64 shrink-0 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/90 bg-slate-50/50 p-6 text-slate-400 hover:border-slate-300 hover:bg-slate-100/50 hover:text-slate-600 transition-all cursor-pointer min-h-[140px]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-2xs border border-slate-200 mb-2">
                  <Plus className="h-4 w-4 text-slate-500" />
                </div>
                <span className="text-xs font-semibold text-slate-600">Add column</span>
              </div>
            </div>
          </div>
        )}

        {/* Dialog for creating a new column */}
        {effectiveBoardId && (
          <CreateColumnDialog
            open={isAddColumnDialogOpen}
            onOpenChange={setIsAddColumnDialogOpen}
            boardId={effectiveBoardId}
            onColumnCreated={handleColumnCreated}
          />
        )}

        {/* Dialog for renaming columns */}
        <RenameColumnDialog
          open={!!renamingColumn}
          onOpenChange={(open) => !open && setRenamingColumn(null)}
          column={renamingColumn}
          onRenameColumn={handleColumnRenamed}
        />

        {/* Confirmation AlertDialog for deleting column */}
        <AlertDialog
          open={!!deletingColumn}
          onOpenChange={(open) => !open && !isDeletingColumn && setDeletingColumn(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Column</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete column &quot;{deletingColumn?.name}&quot;?
                All tasks in this column will also be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingColumn}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  confirmDeleteColumn();
                }}
                disabled={isDeletingColumn}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                {isDeletingColumn ? "Deleting..." : "Delete Column"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog for creating / editing tasks (Real Task API) */}
        {effectiveBoardId && (
          <NewTaskDialog
            open={isDialogOpen}
            onOpenChange={handleOpenTaskDialogChange}
            boardId={effectiveBoardId}
            columns={columns}
            members={members}
            defaultColumnId={targetColumnId || columns[0]?.id || ""}
            taskToEdit={editingTask}
            onTaskCreated={handleTaskCreated}
            onTaskUpdated={handleTaskUpdated}
          />
        )}

        {/* Confirmation AlertDialog for deleting task (Real Task API) */}
        <AlertDialog
          open={!!deletingTask}
          onOpenChange={(open) => !open && !isDeletingTask && setDeletingTask(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete task &quot;{deletingTask?.title}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingTask}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  confirmDeleteTask();
                }}
                disabled={isDeletingTask}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                {isDeletingTask ? "Deleting..." : "Delete Task"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Drag Overlay for smooth card preview while dragging */}
      <DragOverlay dropAnimation={null}>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
