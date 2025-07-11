import { z } from "zod";

export const queryOptionValidation = z.object({
  q: z.any().transform((val) => (typeof val === "string" ? val : undefined)),
  page: z.optional(
    z.union([
      z.literal("").transform(() => undefined),
      z
        .any()
        .refine((val) => parseInt(val) > -1, "Page must be number")
        .transform((val) => (parseInt(val) > 0 ? parseInt(val) : undefined)),
    ])
  ),
  limit: z.optional(
    z.union([
      z.literal("").transform(() => undefined),
      z
        .any()
        .refine((val) => parseInt(val) > -1, "Limit must be number")
        .transform((val) => (parseInt(val) > 0 ? parseInt(val) : undefined)),
    ])
  ),
  orderBy: z
    .any()
    .transform((val) => (typeof val === "string" ? val : undefined)),
  sortBy: z
    .any()
    .transform((val) =>
      !!val && typeof val === "string" ? val.toUpperCase() : "ASC"
    )
    .refine((val) => val === "ASC" || val === "DESC", {
      message: "SortBy must be 'ASC' or 'DESC'",
    }),
});
