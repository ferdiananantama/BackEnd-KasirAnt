import { Role } from "../models";

export const seedRoles = async () => {
  const roles = [
    { name: "Super Admin", description: "Full system access" },
    { name: "Admin", description: "Administrative access" },
    { name: "Employee", description: "Basic user access" },
  ];

  for (const role of roles) {
    await Role.findOrCreate({
      where: { name: role.name },
      defaults: role,
    });
  }
};
