const fs = require('fs');
const path = require('path');

// Menggunakan __dirname untuk merujuk ke direktori skrip ini
const { serviceDomainTemplate } = require(path.join(__dirname, 'templates', 'serviceDomainTemplate.ts'));
const { modelTemplate } = require(path.join(__dirname, 'templates', 'modelDomainTemplate.ts'));
const { sequelizeRepositoryTemplate } = require(path.join(__dirname, 'templates', 'sequelizeRepositoryTemplate.ts'));
const { modelDatabaseTemplate } = require(path.join(__dirname, 'templates', 'modelDatabaseTemplate.ts'));
const { serviceTemplate } = require(path.join(__dirname, 'templates', 'serviceTemplate.ts'));
const { controllerTemplate } = require(path.join(__dirname, 'templates', 'controllerTemplate.ts'));
const { routerTemplate } = require(path.join(__dirname, 'templates', 'routerTemplate.ts'));
const typeFilePath = path.join(process.cwd(), 'src/types.ts');
const containerFilePath = path.join(process.cwd(), 'src/container.ts');
const routesFilePath = path.join(process.cwd(), 'src/presentation/routes/routes.ts');


function toDashCase(str) {
    return str
        .replace(/\s+/g, '-') // Ganti spasi dengan dash
        .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`) // Ganti huruf kapital dengan dash di depan
        .replace(/^-/, '') // Hapus dash di depan
        .toLowerCase(); // Ubah semua huruf menjadi lowercase
}

function toLowerFirstChar(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}


function createFile(destinationPath, replaceMap, template) {
    // Ganti placeholder dengan nilai dari replaceMap
    for (const key in replaceMap) {
        const regex = new RegExp(`%%\\s*${key}\\s*%%`, 'g');  // Ganti format dengan %%
        template = template.replace(regex, replaceMap[key]);
    }

    // Tulis file yang telah diubah ke tujuan
    fs.writeFileSync(destinationPath, template, 'utf8');
    console.log(`File created at ${destinationPath}`);
}

function generateServiceDomainFile(entityName) {
    const entityFileName = toDashCase(entityName);
    const replaceMap = {
        entityName: entityName,
        entityFileName: entityFileName,
    };

    // Menggunakan __dirname untuk menentukan path tujuan
    const destinationPath = path.join(process.cwd(), 'src/domain/service', `${entityFileName}-repository.ts`);


    createFile(destinationPath, replaceMap, serviceDomainTemplate);
}

function generateModelFile(entityName) {
    const entityFileName = toDashCase(entityName);
    const replaceMap = {
        entityName: entityName,
    };

    // Menggunakan __dirname untuk menentukan path tujuan
    const destinationPath = path.join(process.cwd(), 'src/domain/models', `${entityFileName}.ts`);


    createFile(destinationPath, replaceMap, modelTemplate);
}

function generateRepositoryFile(entityName) {
    const entityFileName = toDashCase(entityName);
    const replaceMap = {
        entityName: entityName,
        entityFileName: entityFileName,
    };

    // Menggunakan __dirname untuk menentukan path tujuan
    const destinationPath = path.join(process.cwd(), 'src/persistence/repository', `${entityFileName}-sequelize-repository.ts`);

    createFile(destinationPath, replaceMap, sequelizeRepositoryTemplate);
}

function generateDatabaseModelFile(entityName) {
    const entityFileName = toDashCase(entityName);
    const replaceMap = {
        entityName: entityName,
    };

    // Menggunakan __dirname untuk menentukan path tujuan
    const destinationPath = path.join(process.cwd(), 'src/infrastructure/database/models', `${entityFileName}-sequelize.ts`);

    createFile(destinationPath, replaceMap, modelDatabaseTemplate);
}

function generateServiceFile(entityName) {
    const entityFileName = toDashCase(entityName);
    const entityNameLowerFirst = toLowerFirstChar(entityName);
    const replaceMap = {
        entityName: entityName,
        entityFileName: entityFileName,
        repoEntityName: entityNameLowerFirst,
    };

    // Menggunakan __dirname untuk menentukan path tujuan
    const destinationPath = path.join(process.cwd(), 'src/services', `${entityFileName}-service.ts`);

    createFile(destinationPath, replaceMap, serviceTemplate);
}

function generateControllerFile(entityName) {
    const entityFileName = toDashCase(entityName);
    const replaceMap = {
        entityName: entityName,
        entityFileName: entityFileName,
    };

    // Menggunakan __dirname untuk menentukan path tujuan
    const destinationPath = path.join(process.cwd(), 'src/presentation/controllers', `${entityFileName}-controller.ts`);

    createFile(destinationPath, replaceMap, controllerTemplate);
}

function generateRouteFile(entityName) {
    const entityFileName = toDashCase(entityName);
    const replaceMap = {
        entityName: entityName,
        entityFilePath: `${entityFileName}-controller`,
        entityRoute: `${entityFileName}s`, // Contoh: 'uoms'
    };

    // Menggunakan __dirname untuk menentukan path tujuan
    const destinationPath = path.join(process.cwd(), 'src/presentation/routes', `${entityFileName}-routes.ts`);

    createFile(destinationPath, replaceMap, routerTemplate);
}

function addServiceToFile(serviceName, repositoryName, controllerName) {
    // Baca isi file secara sinkron
    let fileData = fs.readFileSync(typeFilePath, 'utf-8');
    console.log(repositoryName);
    // Cek apakah service sudah ada untuk menghindari duplikasi
    if (fileData.includes(serviceName) || fileData.includes(repositoryName) || fileData.includes(controllerName)) {
        console.error(`${serviceName} || ${repositoryName} || ${controllerName} sudah ada di file.`);
        return;
    }

    // Buat string untuk service baru
    const newRepository = `    ${repositoryName}: Symbol.for("${repositoryName}"),\n`;
    const newService = `    ${serviceName}: Symbol.for("${serviceName}"),\n`;
    const newController = `    ${controllerName}: Symbol.for("${controllerName}"),\n`;

    // Cari posisi komentar // NEWService
    const newRepositoryMarker = '// NEWRepository';
    const newServiceMarker = '// NEWService';
    const newControllerMarker = '// NEWController';

    // Tambahkan service baru sebelum // NEWService
    fileData = fileData.replace(newRepositoryMarker, `${newRepository}${newRepositoryMarker}`);
    fileData = fileData.replace(newServiceMarker, `${newService}${newServiceMarker}`);
    fileData = fileData.replace(newControllerMarker, `${newController}${newControllerMarker}`);

    // Tulis kembali file secara sinkron
    fs.writeFileSync(typeFilePath, fileData, 'utf-8');
    console.log(`${serviceName} berhasil ditambahkan.`);
}

function addContainerToFile(containerName) {
    const routeName = containerName;
    const serviceName = containerName;
    const controllerName = containerName;
    const repositoryName = containerName;

    // Baca isi file secara sinkron
    let fileData = fs.readFileSync(containerFilePath, 'utf-8');

    // Cek apakah service sudah ada untuk menghindari duplikasi
    if (fileData.includes(routeName) || fileData.includes(serviceName) || fileData.includes(controllerName) || fileData.includes(repositoryName)) {
        console.error(`${routeName} || ${serviceName} || ${controllerName} || ${repositoryName} sudah ada di file.`);
        return;
    }

    // Buat string untuk service baru
    const newService = `container.bind<${serviceName}Service>(TYPES.${serviceName}Service).to(${serviceName}Service);\n`;
    const newController = `container.bind(${controllerName}Controller).toSelf();\n`;
    const newRepository = `container.bind<${repositoryName}Repository>(TYPES.${repositoryName}Repository).to(${repositoryName}SequelizeRepository);\n`;
    const newRoute = `container.bind<${routeName}Routes>(${routeName}Routes).toSelf().inSingletonScope();\n`;


    // Cari posisi komentar // NEWService
    const newRouteMarker = '// NewRouteBinding';
    const newServiceMarker = '// NewServiceBinding';
    const newControllerMarker = '// NewControllerBinding';
    const newRepositoryMarker = '// NewRepositoryBinding';
    const newImportMarker = '// NewImport';


    // Tambahkan service baru sebelum // NEWService
    fileData = fileData.replace(newRouteMarker, `${newRoute}${newRouteMarker}`);
    fileData = fileData.replace(newServiceMarker, `${newService}${newServiceMarker}`);
    fileData = fileData.replace(newControllerMarker, `${newController}${newControllerMarker}`);
    fileData = fileData.replace(newRepositoryMarker, `${newRepository}${newRepositoryMarker}`);
    // Tambahkan import baru di marker // NewImport
    // Membuat string import untuk controller, service, repository, dan route baru
    const formattedContainerName = containerName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''); // Format penamaan
    const newImport = `
import { ${controllerName}Controller } from "./presentation/controllers/${formattedContainerName}-controller";
import { ${serviceName}Service } from "./services/${formattedContainerName}-service";
import { ${repositoryName}Repository } from "./domain/service/${formattedContainerName}-repository";
import { ${routeName}Routes } from "./presentation/routes/${formattedContainerName}-routes";
import { ${repositoryName}SequelizeRepository } from "./persistence/repository/${formattedContainerName}-sequelize-repository";\n

`;


    fileData = fileData.replace(newImportMarker, `${newImport}${newImportMarker}`);
    // Tulis kembali file secara sinkron
    fs.writeFileSync(containerFilePath, fileData, 'utf-8');
    console.log(`${containerName} berhasil ditambahkan.`);
}

function addRoutesToFile(containerName) {
    const formattedContainerName = containerName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''); // Format penamaan

    // Buat string import untuk route baru
    const newImport = `import { ${containerName}Routes } from "./${formattedContainerName}-routes";\n`;

    // Buat string untuk deklarasi private di constructor
    const newRoutesDeclaration = `private ${containerName}Routes: ${containerName}Routes,\n`;

    // Buat string untuk pemanggilan setRoutes baru
    const newIndexSetRoutes = `this.${containerName}Routes.setRoutes(router);\n`;

    // Baca isi file secara sinkron
    let fileData = fs.readFileSync(routesFilePath, 'utf-8');

    // Cek apakah route sudah ada untuk menghindari duplikasi
    if (fileData.includes(`${containerName}Routes`)) {
        console.error(`${containerName}Routes sudah ada di file.`);
        return;
    }

    // Tambahkan import baru di marker // NewImportRoutes
    const newImportRoutesMarker = '// NewImportRoutes';
    fileData = fileData.replace(newImportRoutesMarker, `${newImport}${newImportRoutesMarker}`);

    // Tambahkan deklarasi private di constructor di marker // NewRoutes
    const newRoutesMarker = '// NewRoutes';
    fileData = fileData.replace(newRoutesMarker, `${newRoutesDeclaration}${newRoutesMarker}`);

    // Tambahkan panggilan setRoutes baru di marker // NewIndexSetRoutes
    const newIndexSetRoutesMarker = '// NewIndexSetRoutes';
    fileData = fileData.replace(newIndexSetRoutesMarker, `${newIndexSetRoutes}${newIndexSetRoutesMarker}`);

    // Tulis kembali file secara sinkron
    fs.writeFileSync(routesFilePath, fileData, 'utf-8');
    console.log(`${containerName}Routes berhasil ditambahkan ke routes.ts.`);
}

function addIndexToFile(entityName) {
    const formattedEntityName = entityName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
    
    // Read the index file
    const indexFilePath = path.join(process.cwd(), 'src/infrastructure/database/models/index.ts');
    let fileData = fs.readFileSync(indexFilePath, 'utf-8');

    // Add import statement at the top with other imports
    const importStatement = `import { ${entityName} } from "@/infrastructure/database/models/${formattedEntityName}-sequelize";\n`;
    fileData = fileData.replace(/\/\/ Apps Sequelize Model Import/, 
        `// Apps Sequelize Model Import\n${importStatement}`);

    // Add sync statement with other syncs
    const syncStatement = `await ${entityName}.sync({ alter: false });\n`;
    fileData = fileData.replace(/\/\/ Apps Model Synchronisation/, 
        `// Apps Model Synchronisation\n  ${syncStatement}`);

    // Add export statement at bottom
    fileData = fileData.replace(/\/\/ Apps Model Export/, 
        `// Apps Model Export\nexport { ${entityName} };`);

    // Write back to file
    fs.writeFileSync(indexFilePath, fileData, 'utf-8');
    console.log(`${entityName} model successfully added to index.ts`);
}

module.exports = {
    generateServiceDomainFile,
    generateModelFile,
    generateDatabaseModelFile,
    generateRepositoryFile,
    generateServiceFile,
    generateControllerFile,
    generateRouteFile,
    addServiceToFile,
    addContainerToFile,
    addRoutesToFile,
    addIndexToFile
};