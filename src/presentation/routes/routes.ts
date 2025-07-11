import { Router } from "express";
import { injectable } from "inversify";
import { UserRoutes } from "@/presentation/routes/web-admin/user-routes";
import { WebadminAuthRoute } from "@/presentation/routes/web-admin/auth-route";
import { PermissionRoutes } from "@/presentation/routes/web-admin/permission-routes";
import { MenuRoutes } from "@/presentation/routes/web-admin/menu-routes";
import { RoleRoutes } from "@/presentation/routes/web-admin/role-routes";
import { SeederRoutes } from "@/presentation/routes/web-admin/seeder-routes";
import { CategoryRoutes } from "./web-admin/category-route";
import { ProductRoutes } from "./web-admin/product-route";

// NewImportRoutes

@injectable()
export class Routes {
  constructor(
    private userRoutes: UserRoutes,
    private webadminAuthRoute: WebadminAuthRoute,
    private permissionRoutes: PermissionRoutes,
    private menuRoutes: MenuRoutes,
    private roleRoutes: RoleRoutes,
    private seederRoutes: SeederRoutes,

    // NewRoutes
    private categoryRoutes: CategoryRoutes,
    private productRoutes: ProductRoutes
  ) {}

  public setRoutes(router: Router) {
    this.userRoutes.setRoutes(router);
    this.webadminAuthRoute.setRoutes(router);
    this.permissionRoutes.setRoutes(router);
    this.menuRoutes.setRoutes(router);
    this.roleRoutes.setRoutes(router);
    this.seederRoutes.setRoutes(router);

    // NewIndexSetRoutes
    this.categoryRoutes.setRoutes(router);
    this.productRoutes.setRoutes(router);
  }
}
