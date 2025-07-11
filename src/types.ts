const TYPES = {
  Logger: Symbol.for("Logger"),
  Database: Symbol.for("Database"),
  Server: Symbol.for("Server"),
  SocketIo: Symbol.for("SocketIo"),
  HTTPRouter: Symbol.for("HTTPRouter"),

  // Impelementation Domain Service
  // User Management Domain Service
  UserRepository: Symbol.for("UserRepository"),
  PermissionRepository: Symbol.for("PermissionRepository"),
  MenuRepository: Symbol.for("MenuRepository"),
  RoleRepository: Symbol.for("RoleRepository"),
  MenuPermissionRuleRepository: Symbol.for("MenuPermissionRuleRepository"),
  RoleAccessRepository: Symbol.for("RoleAccessRepository"),

  // NEWRepository
  CategoryRepository: Symbol.for("CategoryRepositroy"),
  ProductRepository: Symbol.for("ProductRepository"),
  CompanyRepository: Symbol.for("CompanyRepository"),

  // Service Layer
  // User Management Service
  UserService: Symbol.for("UserService"),
  PermissionService: Symbol.for("PermissionService"),
  MenuService: Symbol.for("MenuService"),
  WebadminAuthService: Symbol.for("WebadminAuthService"),
  RoleService: Symbol.for("RoleService"),

  ManagedTransactionService: Symbol.for("ManagedTransactionService"),
  SeederService: Symbol.for("SeederService"),

  // NEWService
  CategoryService: Symbol.for("CategoryService"),
  ProductService: Symbol.for("ProductService"),

  // NEWController
};

export { TYPES };
