import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GenerateArticleCommand } from '../generate-article.command';
import { DomainEventTypes, TaskStatusChangedEvent, TaskStatus, TaskType } from '@seo-saas/shared';
import { Logger } from '@nestjs/common';

@CommandHandler(GenerateArticleCommand)
export class GenerateArticleHandler implements ICommandHandler<GenerateArticleCommand> {
  private readonly logger = new Logger(GenerateArticleHandler.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async execute(command: GenerateArticleCommand): Promise<{ taskId: string; status: string }> {
    const { dto } = command;
    const taskId = `task_content_${Date.now()}`;
    
    this.logger.log(`Enqueueing GenerateArticleCommand for topic: "${dto.topic}" (${taskId})`);

    const taskEvent: TaskStatusChangedEvent = {
      eventId: `evt_${Date.now()}`,
      eventType: DomainEventTypes.TASK_STATUS_CHANGED,
      aggregateId: taskId,
      timestamp: new Date().toISOString(),
      payload: {
        taskId,
        projectId: dto.projectId,
        taskType: TaskType.GENERATE_ARTICLE,
        status: TaskStatus.QUEUED,
        progress: 0,
        message: 'Article generation job queued'
      }
    };

    this.eventEmitter.emit(DomainEventTypes.TASK_STATUS_CHANGED, taskEvent);

    return { taskId, status: 'QUEUED' };
  }
}
