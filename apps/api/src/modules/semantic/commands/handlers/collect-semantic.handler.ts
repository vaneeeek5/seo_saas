import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CollectSemanticCommand } from '../collect-semantic.command';
import { DomainEventTypes, TaskStatusChangedEvent, TaskStatus, TaskType } from '@seo-saas/shared';
import { Logger } from '@nestjs/common';

@CommandHandler(CollectSemanticCommand)
export class CollectSemanticHandler implements ICommandHandler<CollectSemanticCommand> {
  private readonly logger = new Logger(CollectSemanticHandler.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async execute(command: CollectSemanticCommand): Promise<{ taskId: string; status: string }> {
    const { dto } = command;
    const taskId = `task_sem_${Date.now()}`;
    
    this.logger.log(`Enqueueing CollectSemanticCommand for project: ${dto.projectId} (${taskId})`);

    // Emit initial status change event (Queue First paradigm)
    const taskEvent: TaskStatusChangedEvent = {
      eventId: `evt_${Date.now()}`,
      eventType: DomainEventTypes.TASK_STATUS_CHANGED,
      aggregateId: taskId,
      timestamp: new Date().toISOString(),
      payload: {
        taskId,
        projectId: dto.projectId,
        taskType: TaskType.COLLECT_SEMANTICS,
        status: TaskStatus.QUEUED,
        progress: 0,
        message: 'Semantic collection job queued'
      }
    };

    this.eventEmitter.emit(DomainEventTypes.TASK_STATUS_CHANGED, taskEvent);

    return { taskId, status: 'QUEUED' };
  }
}
