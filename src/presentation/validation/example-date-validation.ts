import { z } from "zod";
import { isValidDate, parseDateStringToDate } from "@/libs/formatters";
import { DATE_FORMAT } from "@/const";

export const exampleDateValidation = z
  .object({
    year: z.preprocess((val) => Number(val), z.number()),
    startDate: z
      .string()
      .refine((val) => isValidDate(val), {
        message: `Invalid date format for startDate, use '${DATE_FORMAT}'`,
      })
      .transform((val) => parseDateStringToDate(val)),
    endDate: z
      .string()
      .refine((val) => isValidDate(val), {
        message: `Invalid date format for endDate, use '${DATE_FORMAT}'`,
      })
      .transform((val) => parseDateStringToDate(val)),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (startDate.getTime() > endDate.getTime()) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid start date and end date combination",
      });
    }
  });
