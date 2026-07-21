import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HealthController } from './health.controller';

@Module({
  imports: [CqrsModule],
  controllers: [HealthController],
})
export class HealthModule {}
