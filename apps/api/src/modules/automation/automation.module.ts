import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CqrsModule } from '@nestjs/cqrs';
import { AutopilotScheduler } from './autopilot.scheduler';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CqrsModule,
  ],
  providers: [AutopilotScheduler],
  exports: [AutopilotScheduler],
})
export class AutomationModule {}
