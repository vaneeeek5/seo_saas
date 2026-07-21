import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { ProjectModule } from './modules/project/project.module';
import { TaskModule } from './modules/task/task.module';
import { SemanticModule } from './modules/semantic/semantic.module';
import { ContentModule } from './modules/content/content.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    PrismaModule,
    QueueModule,
    ProjectModule,
    TaskModule,
    SemanticModule,
    ContentModule,
  ],
})
export class AppModule {}
