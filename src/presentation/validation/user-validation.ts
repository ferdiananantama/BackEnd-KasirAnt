import { z } from "zod";
import { IMulterFile } from "@/presentation/validation/types";
import { soleUuidValidation } from "@/presentation/validation/web-admin/sole-uuid-validation";

export const userCreateScheme = z.object({
  email: z.string().email(),
  password: z.string(),
  fullname: z.string(),
  isActive: z.optional(
    z
      .any()
      .refine(
        (val) =>
          val === "true" || val === "false" || val === true || val === false,
        "Is Active must be boolean"
      )
      .transform((val) => (typeof val === "boolean" ? val : val === "true"))
  ),
  roleId: z.string(),
  avatarPath: z
    .any()
    .nullish()
    .refine((val) => typeof val === "object", "Avatar is invalid object")
    .transform((val) => <IMulterFile>val),
});

export const userUpdateScheme = z
  .object({
    email: z.string().email(),
    password: z.any().transform((val) => <string | undefined>val),
    fullname: z.string(),
    isActive: z.optional(
      z
        .any()
        .refine(
          (val) =>
            val === "true" || val === "false" || val === true || val === false,
          "Is Active must be boolean"
        )
        .transform((val) => (typeof val === "boolean" ? val : val === "true"))
    ),
    roleId: z.string(),
    avatarPath: z.optional(
      z
        .any()
        .nullish()
        .refine((val) => typeof val === "object", "Avatar is invalid object")
        .transform((val) => <IMulterFile>val)
    ),
  })
  .merge(soleUuidValidation);

export const userDataTableScheme = z.object({
  page: z
    .preprocess((val) => Number(val), z.number())
    .nullish()
    .transform((value) => value ?? undefined),
  limit: z
    .preprocess((val) => Number(val), z.number())
    .nullish()
    .transform((value) => value ?? undefined),
  search: z
    .string()
    .nullish()
    .transform((value) => value ?? undefined),
});
export const mobileChangePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmNewPassword: z.string(),
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });
