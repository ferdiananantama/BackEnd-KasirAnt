import { injectable } from "inversify";
import pino from "pino";

@injectable()
export class Logger {
  get(): pino.Logger {
    return pino({
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    });
  }
}
