import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEventTypes, TaskStatusChangedEvent, TaskStatus, TaskType } from '@seo-saas/shared';
import { AiProviderService } from '../../../infrastructure/ai/ai-provider.service';

@Processor('content-queue')
export class ContentProcessor extends WorkerHost {
  private readonly logger = new Logger(ContentProcessor.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly aiProvider: AiProviderService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { taskId, projectId, topic, primaryKeyword, secondaryKeywords } = job.data;
    this.logger.log(`[ContentWorker] Starting multi-stage AI generation for task ${taskId}...`);

    try {
      // Stage 1: Generate Outline
      this.emitTaskStatus(taskId, projectId, TaskStatus.PROCESSING, 20, `Generating structured outline for "${topic}"...`);
      const outline = await this.aiProvider.generateOutline(topic, primaryKeyword);

      // Stage 2: Full Article & SEO Meta Generation
      this.emitTaskStatus(taskId, projectId, TaskStatus.PROCESSING, 60, `Writing article sections & optimizing meta tags...`);
      const articleResult = await this.aiProvider.generateArticleContent(
        topic,
        primaryKeyword,
        secondaryKeywords,
        `Project ID context: ${projectId}`
      );

      // Stage 3: Completion
      this.emitTaskStatus(
        taskId,
        projectId,
        TaskStatus.COMPLETED,
        100,
        `Article generated! Word count: ${articleResult.wordCount}. Meta Title: "${articleResult.metaTitle}"`
      );

      return {
        articleId: `art_${Date.now()}`,
        title: articleResult.title,
        wordCount: articleResult.wordCount,
        outline: articleResult.outline,
      };
    } catch (error: any) {
      this.logger.error(`[ContentWorker Error] Task ${taskId} failed: ${error.message}`);

      // Emit FAILED status event to notify SSE clients & dashboard UI
      this.emitTaskStatus(
        taskId,
        projectId,
        TaskStatus.FAILED,
        0,
        `Task Failed: ${error.message || 'Unknown error occurred during content generation'}`
      );

      // Re-throw so BullMQ triggers automatic retries
      throw error;
    }
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
