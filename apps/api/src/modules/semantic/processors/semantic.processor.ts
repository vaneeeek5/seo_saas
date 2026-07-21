import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEventTypes, TaskStatusChangedEvent, TaskStatus, TaskType } from '@seo-saas/shared';

@Processor('semantic-queue')
export class SemanticProcessor extends WorkerHost {
  private readonly logger = new Logger(SemanticProcessor.name);

  constructor(private readonly eventEmitter: EventEmitter2) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { taskId, projectId, seedKeywords } = job.data;
    this.logger.log(`[SemanticWorker] Processing job ${job.id} for task ${taskId}...`);

    // Step 1: Processing Status Event
    this.emitTaskStatus(taskId, projectId, TaskStatus.PROCESSING, 30, 'Parsing keywords...');

    // Simulate AI parsing / cluster logic delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.emitTaskStatus(taskId, projectId, TaskStatus.PROCESSING, 80, 'Clustering keywords into topics...');

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Step 2: Completion Event
    this.emitTaskStatus(taskId, projectId, TaskStatus.COMPLETED, 100, `Successfully collected & clustered keywords: ${seedKeywords?.join(', ')}`);

    return { keywordsFound: 150, clustersCreated: 12 };
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
        taskType: TaskType.COLLECT_SEMANTICS,
        status,
        progress,
        message,
      },
    };
    this.eventEmitter.emit(DomainEventTypes.TASK_STATUS_CHANGED, event);
  }
}
