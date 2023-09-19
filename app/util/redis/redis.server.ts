import { Redis } from "ioredis";
import { singleton } from "../singleton.server";

export const redis = singleton("redis", () => new Redis(`${process.env.REDIS_URL}`));
