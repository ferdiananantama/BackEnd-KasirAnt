import { injectable } from "inversify";
import { Transaction } from "sequelize";
import { sequelize } from "@/infrastructure/database/sequelize";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";

@injectable()
export default class ManagedTransactionService {
  public async runOnSingleTransaction<T>(
    callback: (t: Transaction) => T,
    errorMessage: string,
    optionalCallback?: {
      onSuccess?: () => void;
      onDone?: () => void;
      onFailed?: () => void;
    }
  ): Promise<T> {
    const t = await sequelize.transaction();
    try {
      const result = await callback(t);
      await t.commit();
      if (optionalCallback && optionalCallback.onSuccess) {
        await optionalCallback.onSuccess();
      }
      return result;
    } catch (err) {
      console.log(err);
      await t.rollback();
      if (optionalCallback && optionalCallback.onFailed) {
        await optionalCallback.onFailed();
      }
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError({
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        description: errorMessage,
      });
    } finally {
      if (optionalCallback && optionalCallback.onDone) {
        await optionalCallback.onDone();
      }
    }
  }
}
