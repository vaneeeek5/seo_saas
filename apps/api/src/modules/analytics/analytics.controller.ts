import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RecordMetricCommand, RecordMetricDto } from './commands/record-metric.command';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('metrics')
  @HttpCode(HttpStatus.CREATED)
  async recordMetric(@Body() dto: RecordMetricDto) {
    return await this.commandBus.execute(new RecordMetricCommand(dto));
  }

  @Get('summary/:projectId')
  async getSummary(@Param('projectId') projectId: string) {
    return {
      projectId,
      totalKeywordsRanked: 142,
      top3Keywords: 18,
      organicTrafficMonthly: 12500,
      indexedPages: 45,
      healthScore: 94,
    };
  }
}
