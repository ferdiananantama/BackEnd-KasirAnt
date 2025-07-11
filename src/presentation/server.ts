import { container } from "@/container";
import { APP_HOST, APP_PORT } from "@/libs/utils";
import { Application } from "express";
import { injectable } from "inversify";
import { Bootstrap } from "@/presentation/bootstrap";
import { Routes } from "@/presentation//routes/routes";
import { SocketIo } from "@/presentation/socket";
import { ExampleCron } from "@/presentation/cron/example-cron";
import { FileWatcher } from "@/presentation//watcher/file-watcher";

export interface IServer {
  start(): Application;
}

@injectable()
export class Server implements IServer {
  start(): Application {
    const app = new Bootstrap(
      container.resolve<Routes>(Routes),
      container.resolve<SocketIo>(SocketIo)
    );
    const exampleCron = container.get(ExampleCron);
    const exampleWatcher = container.get(FileWatcher);

    exampleCron.start();
    exampleWatcher.startWatching();

    app.httpServer.listen(
      <number>(<unknown>APP_PORT),
      APP_HOST,
      undefined,
      () => {
        console.log(`HTTP Server started at http://${APP_HOST}:${APP_PORT}`);
      }
    );
    return app.app;
  }
}
