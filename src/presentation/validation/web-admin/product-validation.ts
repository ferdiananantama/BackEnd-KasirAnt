import { z } from "zod";
import { IMulterFile } from "../types";
import { soleUuidValidation } from "./sole-uuid-validation";

export const ProductCreateScheme = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  imagePath: z.optional(
    z
      .any()
      .nullish()
      .refine(
        (val) => typeof val === "object",
        "Product Image is invalid object"
      )
      .transform((val) => <IMulterFile>val)
  ),
  price_buy: z.coerce.number().nonnegative(),
  price_sell: z.coerce.number().nonnegative(),
  stock: z.coerce.number().nonnegative(),
  unit: z.string().min(1, "Unit is required"),
  categoryId: z.string().uuid().nullable(),
});

export const ProductUpdateScheme = z
  .object({
    name: z.string().min(1, "Name is required").max(50, "Name is too long"),
    imagePath: z.optional(
      z
        .any()
        .nullish()
        .refine(
          (val) => typeof val === "object",
          "Product Image is invalid object"
        )
        .transform((val) => <IMulterFile>val)
    ),
    price_buy: z.coerce.number().nonnegative(),
    price_sell: z.coerce.number().nonnegative(),
    stock: z.coerce.number().nonnegative(),
    unit: z.string().min(1, "Unit is required"),
    categoryId: z.string().uuid().nullable(),
  })
  .merge(soleUuidValidation);
