import { redis } from "./redis.server";

export function invalidateCache(userId: string, fetchKey: string): Promise<number> {
	const key = [fetchKey, userId].join(":");
	return redis.del(key);
}
