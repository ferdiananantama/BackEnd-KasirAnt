import { createLogger, transports, format } from "winston";
export const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({
      dirname: "logs",
      filename: "skeleton-general.log",
    }),
  ],
  format: format.combine(format.colorize(), format.timestamp(), format.json()),
});
