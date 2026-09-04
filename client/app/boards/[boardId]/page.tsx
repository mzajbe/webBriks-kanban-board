"use client";

import { use } from "react";
import { DashboardClient } from "@/components/dashboard-client";

export default function BoardPage({ params }: { params: Promise<{ boardId: string }> }) {
  const resolvedParams = use(params);
  return <DashboardClient boardId={resolvedParams.boardId} />;
}
