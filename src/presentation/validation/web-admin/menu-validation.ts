import { z } from "zod";
import { soleUuidValidation } from "@/presentation/validation/web-admin/sole-uuid-validation";

export const menuCreateValidation = z.object({
  name: z.string().nonempty().trim(),
  order: z.union([
    z.number().nonnegative(),
    z
      .string()
      .nonempty()
      .refine((val) => parseInt(val) > 0)
      .transform((val) => parseInt(val)),
  ]),
  parentId: z.union([
    z.literal("").transform(() => null),
    z.string().nonempty().uuid(),
  ]),
});

export const menuUpdateValidation =
  menuCreateValidation.merge(soleUuidValidation);

export const changeRuleValidation = z.object({
  menuId: z.string().nonempty().uuid(),
  permissionId: z.string().nonempty().uuid(),
  status: z.boolean(),
});
