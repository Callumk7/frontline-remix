# Notes

## caching

## Invalidation function

```ts
export function invalidateCache(userId: string, fetchKey: string): Promise<number> {
	const key = [fetchKey, userId].join(":");
	return redis.del(key);
}
```

This function needs the entire fetchKey, but what we want is logic that can account for progressing through each request, and then invalidating ALL keys
that match a certain pattern.

In order to achieve this we will need to store a map of all queryKeys, so that we can check for them.
Once we have identified the full keys that we want to invalidate, we can delete them.

Finally, we might want to build functionality that will mean we can update the cache in place, for example if we successfully perform a data write, we should
have the option of directly updating the cache with new data. This would only work when:

-   The write is successful
-   The write returns a complete set of data that we can use in the update

## Storing the queryKeys

I guess we want to use redis?
A new redis list of query keys that can be returned as an array?
We check through each key (using the : deliminator)
