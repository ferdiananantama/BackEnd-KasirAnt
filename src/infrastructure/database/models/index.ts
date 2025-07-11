// Core Sequelize Model Import
import { User } from "@/infrastructure/database/models/user-sequelize";
import { Permission } from "@/infrastructure/database/models/permission-sequelize";
import { Menu } from "@/infrastructure/database/models/menu-sequelize";
import { Role } from "@/infrastructure/database/models/role-sequelize";
import { MenuPermissionRule } from "@/infrastructure/database/models/menu-permission-rule-sequelize";
import { RoleAccess } from "@/infrastructure/database/models/role-access-sequelize";
import { runSeeders } from "../seeders";
import { Category } from "@/infrastructure/database/models/category-sequelize";
import { Product } from "./product-sequelieze";
import { Company } from "./company-sequelize";

// Apps Sequelize Model Import

(async () => {
  // Core Model Synchronisation
  await Role.sync({ alter: false });
  await Company.sync({ alter: false });
  await User.sync({ alter: false });
  await Permission.sync({ alter: false });
  await Menu.sync({ alter: false });
  await MenuPermissionRule.sync({ alter: false });
  await RoleAccess.sync({ alter: false });

  // Apps Model Synchronisation
  await Category.sync({ alter: false });
  await Product.sync({ alter: false });

  // Sync Model Assosiation
  // Run seeders
  await runSeeders();
})();

// Core Model Assosiation
Menu.hasOne(Menu, {
  foreignKey: "parentId",
  as: "parent",
});
Menu.hasMany(Menu, {
  foreignKey: "parentId",
  as: "children",
});
RoleAccess.belongsTo(Role);
RoleAccess.belongsTo(Permission);
RoleAccess.belongsTo(Menu);
Role.hasMany(User, {
  foreignKey: "roleId",
  as: "users",
});
User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role",
});

// Apps Model Assosiation
Category.hasMany(Product, {
  foreignKey: "categoryId",
  as: "products",
});
Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});
Company.hasMany(User, {
  foreignKey: "companyId",
  as: "users",
});
User.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company",
});

// Core Model Export
export {
  User,
  Permission,
  Menu,
  Role,
  MenuPermissionRule,
  RoleAccess,
  Category,
  Product,
  Company,
};

// Apps Model Export
