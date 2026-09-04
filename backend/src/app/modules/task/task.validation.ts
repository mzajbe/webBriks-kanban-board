import { z } from "zod";

const isValidDateString = (val: string) => !isNaN(Date.parse(val));

export const createTaskSchema = z.object({
  columnId: z.string().uuid("Invalid column ID format"),
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Task title must be 200 characters or less"),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .optional()
    .nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assigneeId: z.string().uuid("Invalid assignee ID format").optional().nullable(),
  dueDate: z
    .string()
    .refine(isValidDateString, { message: "Invalid date format" })
    .optional()
    .nullable(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title cannot be empty")
    .max(200, "Task title must be 200 characters or less")
    .optional(),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .optional()
    .nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assigneeId: z.string().uuid("Invalid assignee ID format").optional().nullable(),
  dueDate: z
    .string()
    .refine(isValidDateString, { message: "Invalid date format" })
    .optional()
    .nullable(),
});

export const moveTaskSchema = z.object({
  targetColumnId: z.string().uuid("Invalid target column ID format"),
  targetPosition: z.number().int("Position must be an integer").min(0, "Position must be >= 0"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
