"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { KanbanBoard } from "@/components/kanban/kanban-board";

export default function Home() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      {/* Desktop Left Sidebar (Sticky/Fixed) */}
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
        <Topbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onNewTaskClick={() => setNewTaskDialogOpen(true)}
        />

        {/* Kanban Board Content */}
        <KanbanBoard
          isNewTaskDialogOpen={newTaskDialogOpen}
          onNewTaskDialogChange={setNewTaskDialogOpen}
        />
      </main>
    </div>
  );
}
