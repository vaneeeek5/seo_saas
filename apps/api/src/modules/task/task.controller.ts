import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Sse('stream')
  streamTaskEvents(): Observable<MessageEvent> {
    return this.taskService.getTaskStream();
  }
}
