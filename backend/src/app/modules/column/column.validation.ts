import { z } from "zod";

export const createColumnSchema = z.object({
  name: z.string().min(1, "Column name is required").max(100, "Column name must be 100 characters or less"),
});

export const updateColumnSchema = z.object({
  name: z.string().min(1, "Column name cannot be empty").max(100, "Column name must be 100 characters or less"),
});

export const reorderColumnsSchema = z.object({
  columnIds: z.array(z.string()).min(1, "At least one column ID is required"),
});

export type CreateColumnInput = z.infer<typeof createColumnSchema>;
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>;
export type ReorderColumnsInput = z.infer<typeof reorderColumnsSchema>;
