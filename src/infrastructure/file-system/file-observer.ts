import chokidar from "chokidar";
import fs from "fs-extra";
import { FSWatcher } from "chokidar";
// import { injectable } from "inversify";
import { logger } from "@/libs/logger";

export class FileObserver {
  private _watcher: FSWatcher;

  //   call constructor to reinitialize watcher
  constructor(private _paths: string) {
    this._watcher = chokidar.watch(_paths, {
      persistent: true,
      awaitWriteFinish: true,
      alwaysStat: true,
    });

    logger.info(_paths);
  }

  //   function watch file inside selected path
  public watch(): void {
    /* There are another event listener, for example : 

    this._watcher.on("all" , async (path: string) => {});
    this._watcher.on("change" , async (path: string) => {});
    this._watcher.on("unlink" , async (path: string) => {});
    this._watcher.on("add dir" , async (path: string) => {});
    etc,

    chokidar watcher documentation => https://www.npmjs.com/package/chokidar
    */

    // This code below is example for Watch event on Add file only
    this._watcher.on("add", async (path: string) => {
      /*
        You can add validation for the text like code below

        if you want to check the extension of file, you can use this
        const filename = path.split(".");

        const fileExtension = filename[filename.lenght - 1] --> will return the extension
        */
      if (path.includes("Some Value")) {
        return;
      }

      //   To read the contents of text or txt
      const text = fs.readFileSync(path);

      /*
    Used for get the data one by one, 
    for example this data will be get one row 
    and then per row will be split by separated value ("," , "|" , "\t")  
    */
      const arr = text
        .toString()
        .split("\n")
        .map((el) => el.split("|"));

      try {
        // Your bussiness logic will start here
        for (const _item of arr) {
          // Fill your bussiness logic
        }
      } catch (error) {
        console.log("error => ", error);
      }
    });
  }

  //   To stop watching files
  public unwatch(): void {
    this._watcher.unwatch(this._paths);
  }

  //   To remove all listeners form watched files
  public async stop(): Promise<void> {
    this._watcher.close();
  }
}
