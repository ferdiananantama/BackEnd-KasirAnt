import { FileObserver } from "@/infrastructure/file-system";
import { logger } from "@/libs/logger";
import { injectable } from "inversify";

@injectable()
export class FileWatcher {
  private watcher: FileObserver;

  constructor() {
    this.watcher = new FileObserver("");
  }

  //   Create path value
  private path(): string {
    return "<Your Path Goes here>";
  }
  /* if you want more than 2 folder you can use this
  private path(): string[] {
    return [
        "<Your Path Goes here>",
        "<Your Path Goes here>",
    ];
  }
 */

  public startWatching(): void {
    try {
      // Call the path
      const path = this.path();

      // Refresh the watcher
      this.watcher.unwatch();

      //   Start new Watch for selected path
      this.watcher = new FileObserver(path);
      this.watcher.watch();
    } catch (error) {
      logger.error(JSON.stringify(error));
    }
  }
}
