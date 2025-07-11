import { Menu } from "../models";

export const seedMenus = async () => {
    const menus = [
        { name: "Dashboard", path: "/dashboard", icon: "dashboard", order: 1 },
        { name: "User Management", path: "/users", icon: "users", order: 2 },
        { name: "Role Management", path: "/roles", icon: "shield", order: 3 },
        { name: "Settings", path: "/settings", icon: "settings", order: 4 }
    ];

    for (const menu of menus) {
        await Menu.findOrCreate({
            where: { name: menu.name },
            defaults: menu
        });
    }
};
