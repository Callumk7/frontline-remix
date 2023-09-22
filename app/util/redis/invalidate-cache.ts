import { redis } from "./redis.server";

export function invalidateCache<A>(queryArg: A, fetchKey: string[]): Promise<number> {
	const key = [queryArg, fetchKey.join(":")].join(":");
	console.log(`Invalidating cache for ${key}`);
	return redis.del(key);
}
