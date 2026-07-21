import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RecordMetricCommand } from '../record-metric.command';
import { Logger } from '@nestjs/common';

@CommandHandler(RecordMetricCommand)
export class RecordMetricHandler implements ICommandHandler<RecordMetricCommand> {
  private readonly logger = new Logger(RecordMetricHandler.name);

  async execute(command: RecordMetricCommand): Promise<{ metricId: string; status: string }> {
    const { dto } = command;
    const metricId = `met_${Date.now()}`;

    this.logger.log(`[Analytics Engine] Recording metric ${dto.metricName}=${dto.value} for project ${dto.projectId} (${metricId})`);

    return { metricId, status: 'RECORDED' };
  }
}
