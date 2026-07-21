import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { GenerateArticleCommand } from '../generate-article.command';
import { DomainEventTypes, TaskStatusChangedEvent, TaskStatus, TaskType } from '@seo-saas/shared';
import { Logger } from '@nestjs/common';

@CommandHandler(GenerateArticleCommand)
export class GenerateArticleHandler implements ICommandHandler<GenerateArticleCommand> {
  private readonly logger = new Logger(GenerateArticleHandler.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue('content-queue') private readonly contentQueue: Queue,
  ) {}

  async execute(command: GenerateArticleCommand): Promise<{ taskId: string; status: string }> {
    const { dto } = command;
    const taskId = `task_content_${Date.now()}`;
    
    this.logger.log(`Enqueueing GenerateArticleCommand into BullMQ queue for topic: "${dto.topic}" (${taskId})`);

    // Dispatch job to BullMQ queue
    await this.contentQueue.add('generate-article-job', {
      taskId,
      projectId: dto.projectId,
      topic: dto.topic,
      primaryKeyword: dto.primaryKeyword,
      secondaryKeywords: dto.secondaryKeywords,
    }).catch(err => this.logger.warn(`BullMQ Redis enqueue warning: ${err.message}`));

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
        message: 'Article generation job enqueued in BullMQ',
      },
    };

    this.eventEmitter.emit(DomainEventTypes.TASK_STATUS_CHANGED, taskEvent);

    return { taskId, status: 'QUEUED' };
  }
}
