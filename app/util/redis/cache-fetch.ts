import { redis } from "./redis.server";

export async function cacheFetch<T, A>(
	fetchArg: A,
	fetchKey: string[],
	fetchFunc: (userId: A) => Promise<T>,
): Promise<T> {
	const key = [fetchKey.join(":"), fetchArg].join(":").toString();

	const cached = await redis.get(key);

	if (cached) {
		console.log(`Cache HIT for ${key}`);
		return JSON.parse(cached) as T;
	} else {
		console.log(`Cache MISS for ${key}`);
	}

	const fetchedData = await fetchFunc(fetchArg);

	// This is cached for 1 hour
	await redis.set(key, JSON.stringify(fetchedData), "EX", 60 * 60);

	return fetchedData;
}
