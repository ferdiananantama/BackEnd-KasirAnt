import PermissionList from "@/const/permission-list";
import {
  ENABLED_MENU_PERMISSION_RULE,
  IEnabledMenuPermissionRule,
  MENU_LIST,
  TMenuList,
  MENU_SEED,
  IMenuSeedWithChildren,
} from "@/const/seed-menu";
import { VALID_ORDERBY_COLUMN } from "@/const/valid-orderby-column";

type TPermissionList = (typeof PermissionList)[keyof typeof PermissionList];
const SUPER_ADMIN_ROLE = "SUPER ADMIN" as const;
export const DATE_FORMAT = "YYYY-MM-DD";
export const DECIMAL_PRECISION: number = 5;
export const SEED_USER_ADMIN = {
  email: "admin@gmail.com",
  password: "password",
  fullname: "Admin",
};

export {
  TPermissionList,
  PermissionList,
  ENABLED_MENU_PERMISSION_RULE,
  IEnabledMenuPermissionRule,
  MENU_LIST,
  TMenuList,
  MENU_SEED,
  IMenuSeedWithChildren,
  SUPER_ADMIN_ROLE,
  VALID_ORDERBY_COLUMN,
};
