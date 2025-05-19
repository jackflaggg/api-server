import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisService {
    private redisClient: Redis;

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
        this.redisClient = new Redis({
            host: 'localhost',
            port: 6379,
        });

        this.redisClient.on('error', (err) => {
            console.error('Redis Client Error', err);
        });
    }

    async delByPattern(pattern: string) {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length) {
            await this.redisClient.del(...keys);
        }
    }
}