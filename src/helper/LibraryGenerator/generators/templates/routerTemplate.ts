const routerTemplate = `
import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import { %%entityName%%Controller } from "@/presentation/controllers/%%entityFilePath%%";
import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class %%entityName%%Routes {
    public route = '/%%entityRoute%%';
    %%entityName%%ControllerInstance = container.get<%%entityName%%Controller>(%%entityName%%Controller);

    public setRoutes(router: Router) {
        router.get(
            \`\${this.route}\`,
            asyncWrap(this.%%entityName%%ControllerInstance.getAll%%entityName%%.bind(this.%%entityName%%ControllerInstance))
        );

        router.post(
            \`\${this.route}\`,
            asyncWrap(this.%%entityName%%ControllerInstance.create.bind(this.%%entityName%%ControllerInstance))
        );

        router.put(
            \`\${this.route}/:id\`,
            asyncWrap(this.%%entityName%%ControllerInstance.update.bind(this.%%entityName%%ControllerInstance))
        );

        router.delete(
            \`\${this.route}/:id\`,
            asyncWrap(this.%%entityName%%ControllerInstance.delete.bind(this.%%entityName%%ControllerInstance))
        );
    }
}
`;

module.exports = { routerTemplate };
