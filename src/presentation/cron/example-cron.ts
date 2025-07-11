import { injectable } from "inversify";
import { CronJob } from "cron";

@injectable()
export class ExampleCron {
  private _job: CronJob;

  //inject any service you want to use
  constructor() {
    this._job = new CronJob(
      "* * * * *",
      async () => {
        console.log("cron ticked");
      },
      null,
      false,
      "Asia/Jakarta"
    );
  }

  public start() {
    this._job.start();
  }

  public stop() {
    this._job.stop();
  }
}
