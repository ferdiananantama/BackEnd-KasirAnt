import { z } from "zod";
import { soleUuidValidation } from "@/presentation/validation/web-admin/sole-uuid-validation";

export const roleCreateValidation = z.object({
  name: z.string().nonempty().trim(),
});

export const roleUpdateValidation =
  roleCreateValidation.merge(soleUuidValidation);

export const roleIdValidation = z.object({
  roleId: z.string().nonempty().uuid(),
});

export const updateRoleAccessesValidation = z
  .object({
    menuId: z.string().nonempty().uuid(),
    permissionId: z.string().nonempty().uuid(),
    status: z.boolean(),
  })
  .array();
