import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DomainEventTypes, TaskStatusChangedEvent } from '@seo-saas/shared';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  private readonly taskEvents$ = new Subject<TaskStatusChangedEvent>();

  @OnEvent(DomainEventTypes.TASK_STATUS_CHANGED)
  handleTaskStatusChanged(event: TaskStatusChangedEvent) {
    this.logger.log(`Task status changed: ${event.payload.taskId} -> ${event.payload.status}`);
    this.taskEvents$.next(event);
  }

  getTaskStream(): Observable<MessageEvent> {
    return this.taskEvents$.asObservable().pipe(
      map((event) => ({
        data: JSON.stringify(event.payload),
      } as MessageEvent))
    );
  }
}
