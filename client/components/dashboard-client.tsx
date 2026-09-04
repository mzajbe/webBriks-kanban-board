"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { useBoards } from "@/hooks/use-boards";
import { Loader2, Plus, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateBoardDialog } from "@/components/boards/create-board-dialog";

interface DashboardClientProps {
  boardId?: string;
}

export function DashboardClient({ boardId }: DashboardClientProps) {
  const router = useRouter();
  const { boards, activeBoard, isLoadingBoards, isLoadingActiveBoard, selectBoard } = useBoards();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (boardId) {
      if (!activeBoard || activeBoard.id !== boardId) {
        selectBoard(boardId);
      }
    } else if (boards.length > 0 && !activeBoard) {
      router.replace(`/boards/${boards[0].id}`);
    }
  }, [boardId, boards, activeBoard, selectBoard, router]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      {/* Desktop Left Sidebar */}
      <div className="hidden lg:flex h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      <MobileSidebar
        open={mobileSidebarOpen}
        onOpenChange={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col h-full overflow-hidden min-w-0">
        {/* Top Header */}
        <Topbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Content Body */}
        <div className="flex-1 overflow-hidden">
          {isLoadingBoards || isLoadingActiveBoard ? (
            <div className="flex h-full w-full items-center justify-center bg-[#F8FAFC]">
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-800" />
                <p className="text-xs font-semibold text-slate-500">Loading board...</p>
              </div>
            </div>
          ) : boards.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center p-6 bg-[#F8FAFC]">
              <div className="flex flex-col items-center text-center max-w-sm p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                  <LayoutDashboard className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No Boards Yet</h3>
                  <p className="text-xs text-slate-500">
                    Create your first board or ask a team member to share a board with you.
                  </p>
                </div>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-[#1b4332] hover:bg-[#143627] text-white rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create First Board</span>
                </Button>
              </div>
            </div>
          ) : (
            <KanbanBoard />
          )}
        </div>
      </main>

      {/* Create Board Modal */}
      <CreateBoardDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
