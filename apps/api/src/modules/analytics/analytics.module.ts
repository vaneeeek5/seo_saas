import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AnalyticsController } from './analytics.controller';
import { RecordMetricHandler } from './commands/handlers/record-metric.handler';

@Module({
  imports: [CqrsModule],
  controllers: [AnalyticsController],
  providers: [RecordMetricHandler],
})
export class AnalyticsModule {}
