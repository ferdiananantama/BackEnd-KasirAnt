import { TPermissionList } from "@/const";

export const MENU_LIST = {
  DASHBOARD: "DASHBOARD",
  REPORT: "REPORT",
  LOG_ALERT: "LOG_ALERT",
  MASTER_DATA: "MASTER_DATA",
  RATE_KWH: "RATE_KWH",
  PRODUCTION: "PRODUCTION",
  COEFFICIENT_CARBON: "COEFFICIENT_CARBON",
  TARGET: "TARGET",
  USER: "USER",
  ACCOUNT: "ACCOUNT",
  ACCESS: "ACCESS",
  SUPPORT: "SUPPORT",
} as const;

export type TMenuList = (typeof MENU_LIST)[keyof typeof MENU_LIST];

export interface IMenuSeed {
  name: TMenuList;
}

export interface IMenuSeedWithChildren extends IMenuSeed {
  children: IMenuSeedWithChildren[];
}

export const MENU_SEED: IMenuSeedWithChildren[] = [
  {
    name: "DASHBOARD",
    children: [],
  },
  {
    name: "REPORT",
    children: [],
  },
  {
    name: "LOG_ALERT",
    children: [],
  },
  {
    name: "MASTER_DATA",
    children: [
      {
        name: "RATE_KWH",
        children: [],
      },
      {
        name: "PRODUCTION",
        children: [],
      },
      {
        name: "COEFFICIENT_CARBON",
        children: [],
      },
      {
        name: "TARGET",
        children: [],
      },
    ],
  },
  {
    name: "USER",
    children: [
      {
        name: "ACCOUNT",
        children: [],
      },
      {
        name: "ACCESS",
        children: [],
      },
    ],
  },
  {
    name: "SUPPORT",
    children: [],
  },
];

export type IEnabledMenuPermissionRule = {
  [K in TMenuList]: TPermissionList[];
};

export const ENABLED_MENU_PERMISSION_RULE: IEnabledMenuPermissionRule = {
  DASHBOARD: ["ALL", "VIEW"],
  REPORT: ["ALL", "VIEW", "EXPORT"],
  LOG_ALERT: ["ALL", "VIEW"],
  MASTER_DATA: ["ALL", "VIEW"],
  RATE_KWH: ["ALL", "VIEW", "CREATE", "UPDATE", "DELETE"],
  PRODUCTION: ["ALL", "VIEW", "CREATE", "UPDATE", "DELETE"],
  COEFFICIENT_CARBON: ["ALL", "VIEW", "CREATE", "UPDATE", "DELETE"],
  TARGET: ["ALL", "VIEW", "CREATE", "UPDATE", "DELETE"],
  USER: ["ALL", "VIEW"],
  ACCOUNT: ["ALL", "VIEW", "CREATE", "UPDATE", "DELETE"],
  ACCESS: ["ALL", "VIEW", "CREATE", "UPDATE", "DELETE"],
  SUPPORT: ["ALL", "VIEW"],
};
