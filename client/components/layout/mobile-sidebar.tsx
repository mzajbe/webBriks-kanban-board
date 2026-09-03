"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigateBoard?: (boardId: string) => void;
}

export function MobileSidebar({ open, onOpenChange, onNavigateBoard }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[240px] p-0 border-r border-slate-200">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Sidebar</SheetTitle>
        </SheetHeader>
        <Sidebar
          className="w-full border-r-0 h-full"
          onNavigateBoard={(id) => {
            if (onNavigateBoard) onNavigateBoard(id);
            onOpenChange(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
