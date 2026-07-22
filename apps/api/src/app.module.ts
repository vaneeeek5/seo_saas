import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { SecurityModule } from './infrastructure/security/security.module';
import { AiProviderModule } from './infrastructure/ai/ai-provider.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { ProjectModule } from './modules/project/project.module';
import { TaskModule } from './modules/task/task.module';
import { SemanticModule } from './modules/semantic/semantic.module';
import { ContentModule } from './modules/content/content.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { DecisionModule } from './modules/decision/decision.module';
import { PublisherModule } from './modules/publisher/publisher.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { IntegrationModule } from './modules/integration/integration.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    PrismaModule,
    QueueModule,
    SecurityModule,
    AiProviderModule,
    OrganizationModule,
    ProjectModule,
    TaskModule,
    SemanticModule,
    ContentModule,
    KnowledgeModule,
    DecisionModule,
    PublisherModule,
    AnalyticsModule,
    HealthModule,
    IntegrationModule,
  ],
})
export class AppModule {}
