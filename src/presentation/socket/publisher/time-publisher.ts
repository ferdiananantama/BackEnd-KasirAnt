import { injectable, inject } from "inversify";
import { Socket, Server as SocketServer } from "socket.io";
import moment from "moment";
import { logger } from "@/libs/logger";
import { TYPES } from "@/types";
import { RoleService } from "@/services/web-admin/role-service";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { soleUuidValidation } from "@/presentation/validation/web-admin/sole-uuid-validation";
import { PermissionService } from "@/services/web-admin/permission-service";

interface IHandleEventProps {
  socket: Socket;
  eventName: string;
  query: any;
  eventFunction: (socket: Socket, query: any) => Promise<void>;
}

interface IHandleNamespaceProps {
  namespace: string;
  handlers: Record<string, (socket: Socket, query: any) => Promise<void>>;
}

// ! possible circular dependency when using socket instance on service that already injected here
@injectable()
export class TimePublisher {
  private _delayEvent = 1000; // force 1 seconds event delay
  private _keyDelimiter = "___3UBJ6vA3t5Smej42ES7oVcxdK7BghW___";
  private server: SocketServer | null = null;

  constructor(
    @inject(TYPES.RoleService)
    private _roleService: RoleService,
    @inject(TYPES.PermissionService)
    private _permissionService: PermissionService
  ) {}

  private async handleEvent({
    socket,
    eventName,
    query,
    eventFunction,
  }: IHandleEventProps) {
    try {
      const eventTimeoutId = setTimeout(async () => {
        try {
          if (socket.connected) {
            await eventFunction(socket, query);
          } else {
            console.log(
              "SOCKET LOG: FORCE client disconnect with socket id ",
              socket.id
            );
            socket.disconnect();
            clearTimeout(eventTimeoutId);
          }
        } catch (error: AppError | any) {
          socket.emit("error", error);
          logger.error(
            JSON.stringify({
              type: "Socket Error",
              where: `${socket.id}=>${eventName}`,
              error: error,
            })
          );
          clearTimeout(eventTimeoutId);
        }
      }, this._delayEvent);
    } catch (error: AppError | any) {
      socket.emit("error", error);
      logger.error(
        JSON.stringify({
          type: "Socket Error",
          where: `${socket.id}=>${eventName}`,
          error: error,
        })
      );
    }
  }

  private handleNamespace({ namespace, handlers }: IHandleNamespaceProps) {
    if (!this.server) {
      throw "Socket Server Required First";
    }

    this.server.of(namespace).on("connection", (socket) => {
      console.log(
        `SOCKET LOG: Something Connected to Socket IO ${namespace} => ${socket.id}`
      );
      for (const [eventName, eventFunction] of Object.entries(handlers)) {
        socket.on(eventName, (query) => {
          console.log(
            "SOCKET LOG: Trigger event ",
            eventName,
            " on namespace ",
            namespace
          );
          this.handleEvent({
            socket: socket,
            eventName: eventName,
            query: query,
            eventFunction: eventFunction,
          });
        });
      }

      socket.on("disconnect", () => {
        console.log(
          "SOCKET LOG: Client disconnect successfully with socket id ",
          socket.id
        );
      });
    });
  }

  public publish(server: SocketServer) {
    // Set the socket server instance
    this.server = server;

    // Root Namespace
    this.handleNamespace({
      namespace: "/",
      handlers: {
        time: async (socket) => {
          const time = moment().format("HH:mm:ss");
          socket.emit("time", { time });
        },
      },
    });

    // Role Namespace
    this.handleNamespace({
      namespace: "/roles",
      handlers: {
        time: async (socket) => {
          const time = moment().format("HH:mm:ss");
          socket.emit("time", { time });
        },
        findById: async (socket, query) => {
          const validatedReq = soleUuidValidation.safeParse(query);
          if (!validatedReq.success) {
            throw new AppError({
              statusCode: HttpCode.VALIDATION_ERROR,
              description: "Validation Error",
              data: validatedReq.error.flatten().fieldErrors,
            });
          }
          const role = await this._roleService.findById(validatedReq.data.id);
          socket.emit("findById", {
            message: "success",
            data: role,
            key: `findById${this._keyDelimiter}${JSON.stringify(query)}`,
          });
        },
      },
    });

    // Permission Namespace
    this.handleNamespace({
      namespace: "/permissions",
      handlers: {
        time: async (socket) => {
          const time = moment().format("HH:mm:ss");
          socket.emit("time", { time });
        },
        findById: async (socket, query) => {
          const validatedReq = soleUuidValidation.safeParse(query);
          if (!validatedReq.success) {
            throw new AppError({
              statusCode: HttpCode.VALIDATION_ERROR,
              description: "Validation Error",
              data: validatedReq.error.flatten().fieldErrors,
            });
          }
          const data = await this._permissionService.findById(
            validatedReq.data.id
          );
          socket.emit("findById", {
            message: "success",
            data: data,
            key: `findById${this._keyDelimiter}${JSON.stringify(query)}`,
          });
        },
      },
    });
  }
}
