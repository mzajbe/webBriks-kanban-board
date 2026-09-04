"use client";

import { useBoardContext } from "@/providers/board-provider";

export function useBoards() {
  return useBoardContext();
}
