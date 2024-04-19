import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import pino from 'pino';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    });
  }
  async onModuleInit() {
    await this.$connect();
    const logger = pino({
      transport: {
        target: 'pino-pretty',
      },
    });

    this.$extends({
      query: {
        $allModels: {
          async $allOperations({ operation, model, args, query }) {
            const start = performance.now();
            const result = await query(args);
            const end = performance.now();
            logger.info(`Operation: ${operation}`);
            logger.info(`Model: ${model}`);
            logger.info(`Took ${end - start}ms`);
            return result;
          },
        },
      },
    });
  }
}
