import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        enableOfflineQueue: false,
        maxRetriesPerRequest: null,
      },
    }),
    BullModule.registerQueue(
      { name: 'semantic-queue' },
      { name: 'content-queue' },
      { name: 'publication-queue' },
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}
