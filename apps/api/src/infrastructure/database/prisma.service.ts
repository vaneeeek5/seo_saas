import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma Client connected to PostgreSQL database successfully.');
    } catch (err: any) {
      this.logger.warn(`Prisma Client connection deferred (no active local DB server): ${err.message}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
