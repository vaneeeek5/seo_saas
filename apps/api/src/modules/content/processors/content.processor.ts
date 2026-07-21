import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEventTypes, TaskStatusChangedEvent, TaskStatus, TaskType } from '@seo-saas/shared';

@Processor('content-queue')
export class ContentProcessor extends WorkerHost {
  private readonly logger = new Logger(ContentProcessor.name);

  constructor(private readonly eventEmitter: EventEmitter2) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { taskId, projectId, topic, primaryKeyword } = job.data;
    this.logger.log(`[ContentWorker] Processing job ${job.id} for article topic "${topic}"...`);

    this.emitTaskStatus(taskId, projectId, TaskStatus.PROCESSING, 20, `Generating outline for "${topic}"...`);
    await new Promise((resolve) => setTimeout(resolve, 800));

    this.emitTaskStatus(taskId, projectId, TaskStatus.PROCESSING, 60, `Writing section drafts & optimizing for "${primaryKeyword}"...`);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.emitTaskStatus(taskId, projectId, TaskStatus.COMPLETED, 100, `Article generated successfully for topic "${topic}".`);

    return { articleId: `art_${Date.now()}`, wordCount: 1850 };
  }

  private emitTaskStatus(taskId: string, projectId: string, status: TaskStatus, progress: number, message: string) {
    const event: TaskStatusChangedEvent = {
      eventId: `evt_${Date.now()}`,
      eventType: DomainEventTypes.TASK_STATUS_CHANGED,
      aggregateId: taskId,
      timestamp: new Date().toISOString(),
      payload: {
        taskId,
        projectId,
        taskType: TaskType.GENERATE_ARTICLE,
        status,
        progress,
        message,
      },
    };
    this.eventEmitter.emit(DomainEventTypes.TASK_STATUS_CHANGED, event);
  }
}
