const generator = require('./generators/fileGenerator');

const entityName = process.argv[2];

if (!entityName) {
    console.error('Please provide an entity name');
    process.exit(1);
}

generator.generateServiceDomainFile(entityName);
generator.generateModelFile(entityName);
generator.generateDatabaseModelFile(entityName);
generator.generateRepositoryFile(entityName);
generator.generateServiceFile(entityName);
generator.generateControllerFile(entityName);
generator.generateRouteFile(entityName);
generator.addServiceToFile(entityName + 'Service', entityName + 'Repository', entityName + 'Controller');
generator.addContainerToFile(entityName);
generator.addRoutesToFile(entityName);
generator.addIndexToFile(entityName);