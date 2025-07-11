import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import ProductController from "@/presentation/controllers/web-admin/product-controller";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { Router } from "express";
import { injectable } from "inversify";
import multer from "multer";

const tmpUploadedFiles = multer({
  dest: "tmp_uploaded_files/user",
});

@injectable()
export class ProductRoutes {
  public route = "/products";

  controller = container.get<ProductController>(ProductController);
  authMiddleware = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);

  public setRoutes(router: Router) {
    router.get(
      `${this.route}`,
      this.authMiddleware.handle.bind(this.authMiddleware),
      asyncWrap(this.controller.getAll.bind(this.controller))
    );
    router.post(
      `${this.route}`,
      this.authMiddleware.handle.bind(this.authMiddleware),
      tmpUploadedFiles.single("imagePath"),
      asyncWrap(this.controller.create.bind(this.controller))
    );
    router.get(
      `${this.route}/:id`,
      this.authMiddleware.handle.bind(this.authMiddleware),
      asyncWrap(this.controller.getById.bind(this.controller))
    );
    router.put(
      `${this.route}/:id`,
      this.authMiddleware.handle.bind(this.authMiddleware),
      tmpUploadedFiles.single("imagePath"),
      asyncWrap(this.controller.update.bind(this.controller))
    );
    router.delete(
      `${this.route}/:id`,
      this.authMiddleware.handle.bind(this.authMiddleware),
      asyncWrap(this.controller.destroy.bind(this.controller))
    );
  }
}
