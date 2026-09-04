import { z } from "zod";

export const createBoardSchema = z.object({
  name: z.string().min(1, "Board name is required"),
  description: z.string().optional(),
});

export const updateBoardSchema = z.object({
  name: z.string().min(1, "Board name cannot be empty").optional(),
  description: z.string().optional(),
});

export const addMemberSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
