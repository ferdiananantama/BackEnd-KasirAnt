import { seedRoles } from "./role.seeder";
import { seedPermissions } from "./permission.seeder";
import { seedMenus } from "./menu.seeder";
import { seedUsers } from "./user.seeder";
import { seedCompany } from "./company.seeder";

export const runSeeders = async () => {
  try {
    console.log("Starting database seeding...");

    // Run role seeder first because user depends on it
    await seedRoles();
    await seedPermissions();
    await seedMenus();
    await seedCompany();
    await seedUsers();

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};
