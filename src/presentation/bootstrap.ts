import * as bodyParser from "body-parser";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { AppError } from "@/libs/exceptions/app-error";
import { errorHandler } from "@/libs/exceptions/error-handler";
import { logger } from "@/libs/logger";
import { APP_URL_PREFIX } from "@/libs/utils";
import { Routes } from "@/presentation/routes/routes";
import { createServer } from "http";
import { SocketIo } from "@/presentation/socket";

export class Bootstrap {
  public app = express();
  public httpServer = createServer();

  constructor(private appRoutes: Routes, private socketIo: SocketIo) {
    this.app = express();
    this.middleware();
    this.setRoutes();
    this.middlewareError();
    this.createServer(); // Create Http Server
    this.initSocket(); // Initialize Socket Presentation
  }

  private middleware(): void {
    const requestLogger = (
      request: Request,
      response: Response,
      next: NextFunction
    ) => {
      response.removeHeader("x-powered-by");
      response.header("Access-Control-Allow-Origin", "*");
      response.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
      );
      response.header(
        "Access-Control-Allow-Headers",
        "content-type, Authorization"
      );
      console.log(`${request.method} url:: ${request.url}`);
      next();
    };
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static(path.join(__dirname, "../../public")));
    this.app.use(requestLogger);
  }

  private middlewareError(): void {
    const errorLogger = (
      error: AppError,
      req: Request,
      _: Response,
      next: NextFunction
    ) => {
      logger.error(
        JSON.stringify({
          type: "App Error",
          where: req.url,
          error: error,
        })
      );
      next(error); // calling next middleware
    };

    const errorResponder = (
      error: AppError,
      _: Request,
      response: Response,
      _1: NextFunction
    ) => {
      errorHandler.handleError(error, response);
    };

    const invalidPathHandler = (_: Request, response: Response) => {
      response.status(400);
      response.json({
        message: "invalid path",
      });
    };

    this.app.use(errorLogger);
    this.app.use(errorResponder);
    this.app.use(invalidPathHandler);
  }

  private setRoutes(): void {
    const router = express.Router();
    this.app.use(APP_URL_PREFIX, router);
    router.get("/health-check", (_, res) => {
      res.json({
        message: "server is up boys",
      });
    });
    this.appRoutes.setRoutes(router);
    this.app.use(
      "/storage",
      express.static(path.join(process.cwd(), "./storage"))
    );
    this.app.get("*", (_, res) => {
      try {
        fs.readFileSync(path.join(__dirname, "../../public/index.html"));
        return res.sendFile(path.join(__dirname, "../../public/index.html"));
      } catch (e) {
        return res.status(404).send("NOT FOUND");
      }
    });
  }

  private createServer(): void {
    this.httpServer = createServer(this.app);
  }

  private initSocket(): void {
    this.socketIo.initialize(this.httpServer); // Initialize Socket Server
    this.socketIo.setPublisher(); // Turn On Publisher
  }
}
