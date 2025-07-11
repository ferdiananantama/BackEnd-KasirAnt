import { z } from "zod";

export const webadminLoginScheme = z.object({
  email: z.string(),
  password: z.string(),
});
