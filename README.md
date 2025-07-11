<<<<<<< HEAD
# BackEnd-KasirAnt
=======
# Backend TypeScript v2 Scaffolding

Backend starter template menggunakan TypeScript dengan fitur authentication dan role-based access control.

## Teknologi yang Digunakan

- Node.js
- TypeScript
- Express.js
- Sequelize ORM
- PostgreSQL
- Inversify (Dependency Injection)
- JWT Authentication
- Winston Logger

## Fitur

- [x] Authentication & Authorization
- [x] Role-Based Access Control (RBAC)
- [x] Menu Management
- [x] Permission Management
- [x] User Management
- [x] Database Seeding
- [x] Error Handling
- [x] Logger
- [x] API Documentation

## Struktur Project

```
src/
├── const/               # Constants dan enums
├── domain/             # Domain logic dan interfaces
├── infrastructure/     # Implementasi infrastruktur
│   ├── database/      
│   │   ├── models/    # Sequelize models
│   │   └── seeders/   # Database seeders
│   └── logger/        # Logger implementation
├── persistence/        # Repository implementations
├── presentation/      # HTTP handlers dan routes
└── types/            # TypeScript type definitions
```

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
```

3. Update database configuration di .env file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_db_password
```

4. Build dan jalankan aplikasi:
```bash
# Development
npm run dev

# Production
npm run build
npm run serve
```

## Database Seeding

Aplikasi ini memiliki default seeder untuk:

1. Roles:
   - Super Admin
   - Admin
   - User

2. Permissions:
   - CREATE
   - READ
   - UPDATE
   - DELETE

3. Default Menus:
   - Dashboard
   - User Management
   - Role Management
   - Settings

4. Default Super Admin User:
   - Email: superadmin@example.com
   - Password: superadmin123

Seeder akan berjalan otomatis saat aplikasi pertama kali dijalankan.

## Development

### Adding New Model

1. Buat file model di `src/infrastructure/database/models/`
2. Register model di `src/infrastructure/database/models/index.ts`
3. Buat repository interface di `src/domain/repositories/`
4. Implementasikan repository di `src/persistence/repository/`
5. Bind repository di `src/container.ts`

### Adding New Seeder

1. Buat file seeder di `src/infrastructure/database/seeders/`
2. Register seeder di `src/infrastructure/database/seeders/index.ts`

## Production Build

Untuk membuat production build:

```bash
# Build TypeScript
npm run build

# Bundle aplikasi (menggunakan pkg)
npm run bundle
```

## License

MIT

## Naming Convention

1. File
   - menggunakan separator dash (-) jika nama file lebih dari 1 kata
   - Nama file harus sama dengan nama class / interface yg dibuat
2. Class
   - PascalCase (PermissionSequelizeRepository)
3. Interface
   - Untuk interface yang juga berfungsi sebagai type gunakan prefix **I** (IPermission)
4. Type
   - Gunakan prefix T (TPermission)
5. Variable & Function
   - Gunakan camelCase (getAllPermission, permissionRawData)
   - Gunakan penamaan yg bersifat self-documented (nama menjelaskan fungsi dan tujuan variable & function)
6. constant
   - Gunakan kapital dan separator underscore (\_) jika nama constant lebih dari 1 kata (MATH_PI)

## Flow

1. Definisikan domain / entity data (di domain -> model)
2. Definisikan interface repository (di domain -> service)
3. Di infrastructure database, definisikan model sequelize berdasarkan domain / entity yg sudah di buat (di infrastructure -> database -> model)
4. Implementasikan domain service pada persistence repository
5. Service dapat memanggil multiple repository
6. Controller hanya memanggil 1 service
7. Gunakan dto jika membutuhkan custom output structure pada service

## Library requirements

1. Nodejs >= v18.x
2. Yarn >= 1.22.x
3. Pkg (install as global package) >= 5.8.x
4. Git >= 2.40.x

## Notes

1. On development use ".env.local" but on production with bundled apps (.exe) use ".env"
2. Create database first based on env config
3. Tables will auto migrate when running the apps
4. Seed menu by setup on const/seed-menu.ts and then run the seed by hitting endpoint GET "baseUrl/api/seeders/user-managements"
>>>>>>> 063da8b (push first)
