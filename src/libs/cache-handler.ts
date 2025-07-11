import NodeCache from "node-cache";
import { injectable } from "inversify";

interface IGetCachedDataProps<T> {
  payload?: string;
  eventName: string;
  moduleName: string;
  ttl?: number;
  fetchData: () => Promise<T>;
}

interface ICreateCacheKeyProps {
  payload?: string;
  eventName: string;
  moduleName: string;
}

@injectable()
export class CacheHandler {
  declare static cache: NodeCache;
  private CACHE_TTL_IN_SECONDS = 300 as const;
  private GLOBAL_DELIMITER = "___3UBJ6vA3t5Smej42ES7oVcxdK7BghW___" as const;

  constructor() {
    CacheHandler.cache = new NodeCache();
    CacheHandler.cache.setMaxListeners(50);
  }

  public getInstance() {
    return CacheHandler.cache;
  }

  public createCacheKey({
    payload = "default",
    eventName,
    moduleName,
  }: ICreateCacheKeyProps): string {
    return `${payload}${this.GLOBAL_DELIMITER}${eventName}${this.GLOBAL_DELIMITER}${moduleName}`;
  }

  public async findOrCreate<T>({
    payload,
    eventName,
    moduleName,
    ttl = this.CACHE_TTL_IN_SECONDS,
    fetchData,
  }: IGetCachedDataProps<T>): Promise<T> {
    const cacheKey = this.createCacheKey({
      payload,
      eventName,
      moduleName,
    });
    const cachedData = CacheHandler.cache.get(cacheKey) as string | undefined;
    if (cachedData !== undefined) return JSON.parse(cachedData) as T;

    const lockKey = cacheKey + "_lock";
    const isCacheLocked = CacheHandler.cache.get(lockKey) as string | undefined;
    const parsedLock: boolean =
      isCacheLocked !== undefined ? JSON.parse(isCacheLocked) : false;
    if (parsedLock) {
      (await new Promise((resolve) => {
        const deleteListener = (key: string) => {
          if (key === lockKey) {
            CacheHandler.cache.removeListener("del", deleteListener);
            resolve();
          }
        };
        CacheHandler.cache.on("del", deleteListener);
      })) as void;

      return JSON.parse(CacheHandler.cache.get(cacheKey) as string) as T;
    }

    CacheHandler.cache.set(lockKey, JSON.stringify(true));

    const data = await fetchData();

    CacheHandler.cache.set(cacheKey, JSON.stringify(data), ttl);
    CacheHandler.cache.del(lockKey);

    return data;
  }
}
