import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { AiProviderModule } from './infrastructure/ai/ai-provider.module';
import { ProjectModule } from './modules/project/project.module';
import { TaskModule } from './modules/task/task.module';
import { SemanticModule } from './modules/semantic/semantic.module';
import { ContentModule } from './modules/content/content.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { DecisionModule } from './modules/decision/decision.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    PrismaModule,
    QueueModule,
    AiProviderModule,
    ProjectModule,
    TaskModule,
    SemanticModule,
    ContentModule,
    KnowledgeModule,
    DecisionModule,
  ],
})
export class AppModule {}
