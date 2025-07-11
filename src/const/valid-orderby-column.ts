export const VALID_ORDERBY_COLUMN = {
  // Core entity
  ROLE: ["name"],
  USER: ["isActive", "fullname", "email", "role"],
  CATEGORY: ["name"],
  PRODUCT: ["name", "imagePath", "price_buy", "price_sell", "stock", "unit"],
  COMPANY: ["name", "address", "logoPath"],

  // Apps entity
  DEVICE: ["macAddress", "name", "isMain"],
  CARBON_COEFFICIENT_LOG: ["changedAt"],
  DEVICE_LIMITATION: ["macAddress", "name"],
  FISCAL_YEAR: ["year", "startDate", "endDate", "totalBudget"],
};
