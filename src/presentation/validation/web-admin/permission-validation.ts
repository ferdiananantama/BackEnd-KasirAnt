import { z } from "zod";
import { soleUuidValidation } from "@/presentation/validation/web-admin/sole-uuid-validation";
import { PermissionList, TPermissionList } from "@/const";

export const permissionCreateValidation = z.object({
  name: z
    .string()
    .nonempty()
    .trim()
    .refine(
      (val) =>
        Object.keys(PermissionList).find(
          (key) => PermissionList[<TPermissionList>key] === val
        ),
      `Inputted permission value not permitted, allowed: ${Object.keys(
        PermissionList
      ).join(", ")}`
    ),
});

export const permissionUpdateValidation =
  permissionCreateValidation.merge(soleUuidValidation);
