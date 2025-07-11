import { z } from "zod";

export const CategoryCreateScheme = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  description: z.string().optional(),
});

export const CategoryUpdateScheme = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  description: z.string().optional(),
});
