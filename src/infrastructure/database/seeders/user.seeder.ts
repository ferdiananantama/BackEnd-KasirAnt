import { User, Role, Company } from "../models";
import bcrypt from "bcrypt";

export const seedUsers = async () => {
  // Find Super Admin role first
  const superAdminRole = await Role.findOne({
    where: { name: "Super Admin" },
  });

  const defaultCompany = await Company.findOne({
    where: { name: "Company 1" },
  });

  if (!superAdminRole || !defaultCompany) {
    console.log("Super Admin role not found. Please run role seeder first.");
    return;
  }

  const defaultUsers = [
    {
      username: "superadmin",
      password: await bcrypt.hash("superadmin123", 10),
      email: "superadmin@example.com",
      fullName: "Super Admin",
      role: superAdminRole.id,
      company: defaultCompany.id,
      isActive: true,
    },
  ];

  for (const user of defaultUsers) {
    await User.findOrCreate({
      where: { email: user.email },
      defaults: {
        password: user.password,
        email: user.email,
        fullname: user.fullName,
        roleId: user.role,
        companyId: user.company,
        isActive: user.isActive,
      },
    });
  }
};
