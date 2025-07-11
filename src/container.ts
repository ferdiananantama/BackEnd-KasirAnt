import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

// Routes
import { Routes } from "@/presentation/routes/routes";
import { UserRoutes } from "@/presentation/routes/web-admin/user-routes";
import { WebadminAuthRoute } from "./presentation/routes/web-admin/auth-route";
import { PermissionRoutes } from "@/presentation/routes/web-admin/permission-routes";
import { MenuRoutes } from "@/presentation/routes/web-admin/menu-routes";
import { RoleRoutes } from "@/presentation/routes/web-admin/role-routes";
import { SeederRoutes } from "@/presentation/routes/web-admin/seeder-routes";

//Publisher / Socket
import { TimePublisher } from "@/presentation/socket/publisher/time-publisher";

//Cache Handler
import { CacheHandler } from "@/libs/cache-handler";

// Domain Repository
import { UserRepository } from "@/domain/service/user-management/user-repository";
import PermissionRepository from "@/domain/service/user-management/permission-repository";
import { MenuRepository } from "@/domain/service/user-management/menu-repository";
import { RoleRepository } from "@/domain/service/user-management/role-repository";
import { MenuPermissionRuleRepository } from "@/domain/service/user-management/menu-permission-rule-repository";
import { RoleAccessRepository } from "@/domain/service/user-management/role-access-repository";
import { CategoryRepository } from "./domain/service/app-management/category-repository";

// Domain Repository / Infrastructur implementation
import { UserSequelizeRepository } from "@/persistence/repository/user-sequelize-repository";
import { PermissionSequelizeRepository } from "@/persistence/repository/permission-sequelize-repository";
import { MenuSequelizeRepository } from "@/persistence/repository/menu-sequelize-repository";
import { RoleSequelizeRepository } from "@/persistence/repository/role-sequelize-repository";
import { MenuPermissionRuleSequelizeRepository } from "@/persistence/repository/menu-permission-rule-sequelize-repository";
import RoleAccessSequelizeRepository from "@/persistence/repository/role-access-sequelize-repository";
import { CategorySequelizeRepository } from "./persistence/repository/category-sequelize-repository";

// Service Implementation
import { UserService } from "@/services/web-admin/user-service";
import { WebadminAuthService } from "./services/web-admin/auth-service";
import { PermissionService } from "@/services/web-admin/permission-service";
import { MenuService } from "@/services/web-admin/menu-service";
import { RoleService } from "@/services/web-admin/role-service";
import ManagedTransactionService from "@/services/managed-transaction-service";
import { SeederService } from "@/services/web-admin/seeder-service";
import { CategoryService } from "./services/web-admin/category-service";

// Controller
import UserController from "@/presentation/controllers/web-admin/user-controller";
import { WebadminAuthController } from "./presentation/controllers/web-admin/auth-controller";
import PermissionController from "@/presentation/controllers/web-admin/permission-controller";
import { SeederController } from "@/presentation/controllers/web-admin/seeder-controller";
import CategoryController from "./presentation/controllers/web-admin/category-controller";

//Cron Job
import { ExampleCron } from "@/presentation/cron/example-cron";

//Middleware
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { RoleAccessMiddleware } from "./presentation/middleware/role-access-middleware";

// Bootstrap / kernel
import { IServer, Server } from "@/presentation/server";
import { SocketIo } from "@/presentation/socket";
import MenuController from "@/presentation/controllers/web-admin/menu-controller";
import RoleController from "@/presentation/controllers/web-admin/role-controller";
import { FileWatcher } from "@/presentation/watcher/file-watcher";
import { CategoryRoutes } from "./presentation/routes/web-admin/category-route";
import { ProductRoutes } from "./presentation/routes/web-admin/product-route";
import { ProductSevice } from "./services/web-admin/product-service";
import ProductController from "./presentation/controllers/web-admin/product-controller";
import { ProductRepository } from "./domain/service/app-management/product-repository";
import { ProductSequelizeRepository } from "./persistence/repository/product-sequelize";
import { CompanyRepository } from "./domain/service/app-management/company-repository";
import { CompanySequelizeRepository } from "./persistence/repository/company-sequilize-repository";

// NewImport

const container = new Container();

// Kernel Bootstrap
container.bind<IServer>(TYPES.Server).to(Server).inSingletonScope();
container.bind(TYPES.SocketIo).to(SocketIo).inSingletonScope();

// Router
container.bind<Routes>(Routes).toSelf().inSingletonScope();
container.bind<UserRoutes>(UserRoutes).toSelf().inSingletonScope();
container
  .bind<WebadminAuthRoute>(WebadminAuthRoute)
  .toSelf()
  .inSingletonScope();
container.bind(PermissionRoutes).toSelf().inSingletonScope();
container.bind(MenuRoutes).toSelf().inSingletonScope();
container.bind(RoleRoutes).toSelf().inSingletonScope();
container.bind(SeederRoutes).toSelf().inSingletonScope();

// NewRouteBinding
container.bind(CategoryRoutes).toSelf().inSingletonScope();
container.bind(ProductRoutes).toSelf().inSingletonScope();

//Publisher
container.bind<TimePublisher>(TimePublisher).toSelf().inSingletonScope();

//Cache Handler
container.bind(CacheHandler).toSelf().inSingletonScope();

// Service Layer
// Mobile Service
container.bind(TYPES.UserService).to(UserService);
container.bind(TYPES.PermissionService).to(PermissionService);
container.bind(TYPES.MenuService).to(MenuService);
container.bind(TYPES.RoleService).to(RoleService);
container.bind(TYPES.ManagedTransactionService).to(ManagedTransactionService);
container.bind(TYPES.SeederService).to(SeederService);

// NewServiceBinding
container.bind(TYPES.CategoryService).to(CategoryService);
container.bind(TYPES.ProductService).to(ProductSevice);

// Web Admin Service
container.bind(TYPES.WebadminAuthService).to(WebadminAuthService);

// Controller
container.bind(UserController).toSelf();
container.bind(WebadminAuthController).toSelf();
container.bind(PermissionController).toSelf();
container.bind(MenuController).toSelf();
container.bind(RoleController).toSelf();
container.bind(SeederController).toSelf();

// NewControllerBinding
container.bind(CategoryController).toSelf();
container.bind(ProductController).toSelf();

//CRON
container.bind(ExampleCron).toSelf().inSingletonScope();

//File Watcher
container.bind(FileWatcher).toSelf().inSingletonScope();

// Middleware
container.bind(MobileAuthMiddleware).toSelf();
container.bind(RoleAccessMiddleware).toSelf();

// implement infrastructur
container
  .bind<UserRepository>(TYPES.UserRepository)
  .to(UserSequelizeRepository);
container
  .bind<PermissionRepository>(TYPES.PermissionRepository)
  .to(PermissionSequelizeRepository);
container
  .bind<MenuRepository>(TYPES.MenuRepository)
  .to(MenuSequelizeRepository);
container
  .bind<RoleRepository>(TYPES.RoleRepository)
  .to(RoleSequelizeRepository);
container
  .bind<MenuPermissionRuleRepository>(TYPES.MenuPermissionRuleRepository)
  .to(MenuPermissionRuleSequelizeRepository);
container
  .bind<RoleAccessRepository>(TYPES.RoleAccessRepository)
  .to(RoleAccessSequelizeRepository);

// NewRepositoryBinding
container
  .bind<CategoryRepository>(TYPES.CategoryRepository)
  .to(CategorySequelizeRepository);
container
  .bind<ProductRepository>(TYPES.ProductRepository)
  .to(ProductSequelizeRepository);
container
  .bind<CompanyRepository>(TYPES.CompanyRepository)
  .to(CompanySequelizeRepository);

export { container };
