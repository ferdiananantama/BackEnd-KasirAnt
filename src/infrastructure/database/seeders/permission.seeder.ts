import { TPermissionList } from "@/const";
import { Permission } from "../models";

export const seedPermissions = async () => {
    const permissions: { name: TPermissionList, description: string }[] = [
        { name: "CREATE" as TPermissionList, description: "Create permission" },
        { name: "READ" as TPermissionList, description: "Read permission" },
        { name: "UPDATE" as TPermissionList, description: "Update permission" },
        { name: "DELETE" as TPermissionList, description: "Delete permission" }
    ];

    for (const permission of permissions) {
        await Permission.findOrCreate({
            where: { name: permission.name },
            defaults: permission
        });
    }
};
