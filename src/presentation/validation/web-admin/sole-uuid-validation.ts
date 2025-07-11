import { z } from "zod";

export const soleUuidValidation = z.object({
  id: z.string().nonempty().uuid(),
});
