import { injectable } from "inversify";
import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { TimePublisher } from "@/presentation/socket/publisher/time-publisher";

// example of emit socket from service is in permission service
// the default namespace is root namespace, client use socket url http://baseurl:port
@injectable()
export class SocketIo {
  declare static io: SocketServer;

  constructor(private _timePublisher: TimePublisher) {}

  public setPublisher() {
    this._timePublisher.publish(SocketIo.io);
  }

  public initialize(server: HttpServer) {
    if (!server) {
      throw "Express Server Required First";
    }
    SocketIo.io = new SocketServer(server, {
      cors: {
        origin: "*",
        methods: "*",
      },
    });
  }

  public getInstance() {
    return SocketIo.io;
  }
}
